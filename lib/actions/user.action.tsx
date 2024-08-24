"use server";

import { ID } from "node-appwrite";
import { createAdminClient } from "@/lib/appwrite";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { createSessionClient } from "../appwrite";
import { parseStringify } from "../utils";

export const signIn = async ({email , password}:signInProps) => {
  try {
    // Mutation / DataBase / Make Fetch
    const { account } = await createAdminClient();
    const response = await account.createEmailPasswordSession(email, password)

    return parseStringify(response)
  } catch (error) {
    console.error("error", error);
  }
};
export const signUp = async (userData: SignUpParams) => {
    const {email, password, firstName, lastName} = userData;
  try {
    // Create a User account
    const { account } = await createAdminClient();

    const newUserAccount = await account.create(
      ID.unique(),
      email,
      password,
      `${firstName} + ${lastName}`
    );

    const session = await account.createEmailPasswordSession(email, password);

    cookies().set("appwrite-session", session.secret, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    });

    return parseStringify(newUserAccount)
  } catch (error) {
    console.error("error", error);
  }
};

// ... your initilization functions

export async function getLoggedInUser() {
  try {
    const { account } = await createSessionClient();
    const user =  await account.get();
    return parseStringify(user)
  } catch (error) {
    return null;
  }
}
