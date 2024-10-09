"use client";

import { useForm } from "react-hook-form";
import { loginFormData, loginSchema } from "@/helper/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
export default function Login() {
  const [loading, setLoading] = useState(true);
  const [deviceId, SetDeviceId] = useState("");
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
  });
  const [er, seter] = useState("");
  const onSubmit = async (data: loginFormData) => {
    setLoading(false);
    try {
      signIn("credentials", {
        username: data.username,
        password: data.password,
        deviceId,
        callbackUrl: "/",
      });
    } catch (error: any) {
      seter(toast(error.response.data.error));
    } finally {
    }
  };
  useEffect(() => {
    const fetchIp = async () => {
      try {
        const response = await axios.get("https://api.ipify.org?format=json");
        SetDeviceId(response.data.ip);
      } catch (error) {
        console.error("Error fetching the IP address:", error);
      }
    };

    fetchIp();
  }, []);
  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="max-w-md w-full mx-auto px-6 sm:px-0">
        <div className="text-center mb-4 text-center">
          <h2 className="text-2xl font-bold">Login Page</h2>
        </div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className=" rounded-lg shadow-lg p-6 sm:p-10 space-y-6"
          >
            {loading && (
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="block mb-1">Username</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your username"
                        {...field}
                        className="bg-black"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            {!loading && (
              <Skeleton className="w-[300px] h-[20px] rounded-full " />
            )}
            {loading && (
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="block mb-1">Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Enter your password"
                        {...field}
                        className="bg-black"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <div className="flex justify-between item-center">
              <Link href={"/Register"} className="hover:text-blue-300">
                Register
              </Link>
              <Link href={"/Login"} className="hover:text-blue-300">
                Forgot Password
              </Link>
            </div>
            {!loading && (
              <Skeleton className="w-[300px] h-[20px] rounded-full" />
            )}
            {loading && (
              <div className="flex justify-between items-center space-x-4">
                <button
                  onClick={() => signIn("google")}
                  className="flex items-center  py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
                >
                  <img
                    src="/logo/google.svg"
                    alt="Google Logo"
                    className="h-5 w-40"
                  />
                </button>
                <button
                  onClick={() => signIn("github")}
                  className="flex items-center  py-2 bg-gray-800 text-white rounded-md hover:bg-gray-900 transition"
                >
                  <img
                    src="/logo/github.svg"
                    alt="GitHub Logo"
                    className="h-5 w-40"
                  />
                </button>
              </div>
            )}

            {loading && (
              <Button className="w-full py-2  text-white rounded-md hover:bg-blue-600 transition-colors duration-300">
                Submit
              </Button>
            )}
            {!loading && (
              <Skeleton className="w-[300px] h-[20px] rounded-full" />
            )}
            <Toaster />
          </form>
        </Form>
      </div>
    </div>
  );
}
