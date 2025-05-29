
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2 } from "lucide-react";

const signInFormSchema = z.object({
  email: z.string().min(1, "Username or Email is required."), // Allow username 'super' or email
  password: z.string().min(1, "Password is required."),
  isAdminLogin: z.boolean().default(false).optional(),
});

type SignInFormValues = z.infer<typeof signInFormSchema>;

export function SignInForm() {
  const { toast } = useToast();
  const { login } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<SignInFormValues>({
    resolver: zodResolver(signInFormSchema),
    defaultValues: {
      email: "",
      password: "",
      isAdminLogin: false,
    },
  });

  async function onSubmit(values: SignInFormValues) {
    setIsLoading(true);
    const user = await login(values.email, values.password);
    setIsLoading(false);

    if (user) {
      toast({
        title: "Signed In!",
        description: `Welcome back, ${user.name}.`,
      });
      if (values.isAdminLogin && user.isAdmin) {
        router.push('/admin/dashboard');
      } else if (values.isAdminLogin && !user.isAdmin) {
        toast({
          title: "Access Denied",
          description: "You are not an administrator.",
          variant: "destructive",
        });
        // Optionally log them out or redirect to user page
         router.push('/jobs'); // Redirect to user dashboard
      }
      else {
        router.push('/jobs'); // Default redirect for regular users
      }
    } else {
      toast({
        title: "Sign In Failed",
        description: "Invalid credentials or user not found. Please try again.",
        variant: "destructive",
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username or Email</FormLabel>
              <FormControl>
                <Input placeholder="super or you@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="••••••••" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="isAdminLogin"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow-sm">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>
                  Sign in as Administrator
                </FormLabel>
              </div>
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Sign In
        </Button>
      </form>
    </Form>
  );
}
