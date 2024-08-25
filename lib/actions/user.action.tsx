"use server";

import { ID } from "node-appwrite";
import { createAdminClient } from "@/lib/appwrite";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { createSessionClient } from "../appwrite";
import { encryptId, parseStringify } from "../utils";
import {
  CountryCode,
  ProcessorTokenCreateRequest,
  ProcessorTokenCreateRequestProcessorEnum,
  Products,
} from "plaid";
import { plaidClient } from "@/lib/plaid";
import { revalidatePath } from "next/cache";
import { addFundingSource } from "./dwolla.action";

export const signIn = async ({ email, password }: signInProps) => {
  try {
    // Mutation / DataBase / Make Fetch
    const { account } = await createAdminClient();
    const response = await account.createEmailPasswordSession(email, password);

    return parseStringify(response);
  } catch (error) {
    console.error("error", error);
  }
};
export const signUp = async (userData: SignUpParams) => {
  const { email, password, firstName, lastName } = userData;
  try {
    // Create a User account
    const { account } = await createAdminClient();

    const newUserAccount = await account.create(
      ID.unique(),
      email,
      password,
      `${firstName}  ${lastName}`
    );

    const session = await account.createEmailPasswordSession(email, password);

    cookies().set("appwrite-session", session.secret, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    });

    return parseStringify(newUserAccount);
  } catch (error) {
    console.error("error", error);
  }
};

// ... your initilization functions

export async function getLoggedInUser() {
  try {
    const { account } = await createSessionClient();
    const user = await account.get();
    return parseStringify(user);
  } catch (error) {
    return null;
  }
}

export const logoutAccount = async () => {
  try {
    const { account } = await createSessionClient();

    cookies().delete("appwrite-session");

    await account.deleteSession("current");
  } catch (error) {}
};

export const createBankAccount = async ({
  userId,
  bankId,
  accountId,
  fundingSourceUrl,
  sharableId,
}:createBankAccountProps) => {
  try {
    const {dataBase} = await createAdminClient();

    const bankAccount = await dataBase.createDocument()
  } catch (error) {
    console.log("error", error);
  }
};

export const createLinkToken = async (user: User) => {
  try {
    const tokenParams = {
      user: {
        client_user_id: user.$id,
      },
      client_name: user.name,
      products: ["auth"] as Products[],
      language: "en",
      country_codes: ["US"] as CountryCode[],
    };
    const response = await plaidClient.linkTokenCreate(tokenParams);
    return parseStringify({ linkToken: response.data.link_token });
  } catch (error) {
    console.log("error", error);
  }
};

export const exchangePublicToken = async ({ publicToken, user }) => {
  try {
    const response = await plaidClient.itemPublicTokenExchange({
      public_token: publicToken,
    });
    const accessToken = response.data.access_token;
    const itemId = response.data.item_id;

    // GET ACCOUNT INFORMATION FROM PLAID USING THE ACCESS TOKEN
    const accountResponse = await plaidClient.accountsGet({
      access_token: accessToken,
    });
    const accountData = accountResponse.data.accounts[0];

    // CREATE A PROCESSOR TOKEN FOR DWOLLA USING THE ACCESS TOKEN AND ACCOUNT ID
    const request: ProcessorTokenCreateRequest = {
      access_token: accessToken,
      account_id: accountData.account_id,
      processor: "dwalla" as ProcessorTokenCreateRequestProcessorEnum,
    };

    const processorTokenResponse = await plaidClient.processorTokenCreate(
      request
    );
    const processorToken = await processorTokenResponse.data.processor_token;

    // CREATE A FUNFDING SOURCE URL FOR THE ACCOUNT USING THE DWOLLA CUSTOMER ID , PROCESSOR TOKEN AND BANK NAME

    const fundingSourceUrl = await addFundingSource({
      dwollaCustomerId: user.dwollaCustomerId,
      processorToken,
      bankName: accountData.name,
    });

    if (!fundingSourceUrl) throw Error;

    await createBankAccount({
      userId: user.$id,
      bankId: itemId,
      accountId: accountData.account_id,
      fundingSourceUrl,
      sharableId: encryptId(accountData.account_id),
    });
    revalidatePath("/");

    return parseStringify({
      publicTokenExachange: "complete",
    });
  } catch (error) {
    console.log("error", error);
  }
};
