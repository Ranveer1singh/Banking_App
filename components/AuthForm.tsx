"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import CustomInput from "./CustomInput";
import { authFormSchema } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { signIn, signUp } from "@/lib/actions/user.action";

const AuthForm = ({ type }: { type: string }) => {
  const router = useRouter(); 
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const formSchema = authFormSchema(type);

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // 2. Define a submit handler.
  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      // Sign up with Appwrite &  create plain link token
      if(type === 'sign-up'){
        const newUser = await signUp(data) ;
        setUser(newUser)
      }
      if(type === 'sign-in'){
        const response = await signIn({
          email:data.email,
          password:data.password,
        })
        if(response) router.push('/')
      }

      // console.log(values);
      // setIsLoading(false);
    } catch (error) {
      console.log(error);
      
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="auth-form">
      <header className="flex flex-col gap-5 md:gap-8">
        <Link href="/" className=" cursor-pointer items-center gap-1 px-4">
          <Image src="/icons/logo.svg" width={34} height={34} alt="logo" />
          <h1 className="text-26 font-ibm-plex-serif font-bold text-black-1 ">
            Horizon
          </h1>
        </Link>
        <div className="flex flex-col gap-1 md-gap-3">
          <h1 className="text-24 lg:text-36 font-semibold text-gray-900 ">
            {user ? "Link Account" : type === "sign-in" ? "Sign In" : "Sign Up"}
          </h1>
          <p className="text-16 font-normal text-gray-600">
            {user
              ? "Link your account to get started"
              : "Please enter your details"}
          </p>
        </div>
      </header>
      {user ? (
        <div className="flex flex-col gap-4">{/* plaidLink */}</div>
      ) : (
        <>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {type === "sign-up" && (
                <>
                  <div className="flex gap-4">
                    <CustomInput
                      control={form.control}
                      label="First Name"
                      name="firstName"
                      placeholder="Enter your first name"
                    />
                    <CustomInput
                      control={form.control}
                      label="Last Name"
                      name="lastName"
                      placeholder="Enter your last name"
                    />
                  </div>
                  <CustomInput
                    control={form.control}
                    label="Address Name"
                    name="addressName"
                    placeholder="Enter your Address name"
                  />
                  <CustomInput
                    control={form.control}
                    label="City Name"
                    name="cityName"
                    placeholder="Enter your City name"
                  />
                  <div className="flex gap-4">
                    <CustomInput
                      control={form.control}
                      label="State Name"
                      name="stateName"
                      placeholder="Ex : Mp"
                    />
                    <CustomInput
                      control={form.control}
                      label="Postal Code"
                      name="postalCode"
                      placeholder="Ex : 461111"
                    />
                  </div>
                  <div className="flex gap-4">
                    <CustomInput
                      control={form.control}
                      label="Date of birth"
                      name="dateOfbirth"
                      placeholder="YYYY-MM-DD"
                    />
                    <CustomInput
                      control={form.control}
                      label="SSN"
                      name="ssn"
                      placeholder="Ex : 123"
                    />
                  </div>
                </>
              )}
              <CustomInput
                control={form.control}
                name="email"
                label="Email"
                placeholder="Enter your Email"
              />
              <CustomInput
                control={form.control}
                name="password"
                label="Password"
                placeholder="Enter Password"
              />
              <div className="flex flex-col gap-4">
                <Button type="submit" className="form-btn" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="animate-spin" size={20} /> &nbsp;
                      Loading....
                    </>
                  ) : type === "sign-in" ? (
                    "Sign In"
                  ) : (
                    "Sign Up"
                  )}
                </Button>
              </div>
            </form>
          </Form>
          <footer className="flex justify-center gap-1 ">
            <p className="text-14 font-normal text-gray-600">
              {type === "sign-in"
                ? "Dont have an account?"
                : "Already have a account?"}
            </p>
            <Link
              className="form-link"
              href={type === "sign-in" ? "/sign-up" : "/sign-in"}
            >
              {type === "sign-in" ? "sign-up" : "sign-in"}
            </Link>
          </footer>
        </>
      )}
    </section>
  );
};

export default AuthForm;
