"use client";

import { useForm } from "react-hook-form";
import { registerFormData, registerSchema } from "@/helper/schema";
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
import { useState } from "react";
import Link from "next/link";
import { backend } from "@/helper/constant";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store/store";
import { axiosInstance } from "@/helper/axios";

export default function Register() {
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const registerInfo = useSelector((state: RootState) => state.register);
  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
  });
  const onSubmit = async (data: registerFormData) => {
    setLoading(false);
    try {
      const response = await axiosInstance({
        baseURL: `${backend}/auth/register`,
        method: "POST",
        data,
      });

      router.push("/Login");
    } catch (error) {
    } finally {
      setLoading(true);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="max-w-md w-full mx-auto px-6 sm:px-0">
        <div className="text-center mb-4 text-center">
          <h2 className="text-2xl font-bold">Register Page</h2>
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
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="block mb-1">Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your email"
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
              <Skeleton className="w-[300px] h-[20px] rounded-full" />
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
              <Link href={"/Login"} className="hover:text-blue-300">
                Login
              </Link>
              <Link href={"/Login"} className="hover:text-blue-300">
                Forgot Password
              </Link>
            </div>
            {!loading && (
              <Skeleton className="w-[300px] h-[20px] rounded-full" />
            )}
            {loading && (
              <Button className="w-full py-2  text-white rounded-md hover:bg-blue-600 transition-colors duration-300">
                Submit
              </Button>
            )}
            {!loading && (
              <Skeleton className="w-[300px] h-[20px] rounded-full" />
            )}
          </form>
        </Form>
      </div>
    </div>
  );
}
