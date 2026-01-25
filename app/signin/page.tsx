"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, ShieldAlert, ExternalLink } from "lucide-react";
import { toast } from "sonner";

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
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const formSchema = z.object({
    email: z.string().email({
        message: "Please enter a valid email address.",
    }),
    password: z.string().min(1, {
        message: "Password is required.",
    }),
});

function SignInContent() {
    const [isLoading, setIsLoading] = useState(false);
    const [isInactive, setIsInactive] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsLoading(true);
        setIsInactive(false);

        try {
            const { signIn } = await import("next-auth/react");

            const result = await signIn("credentials", {
                email: values.email,
                password: values.password,
                redirect: false,
            });

            console.log("[SIGNIN] signIn result:", result);

            if (result?.error) {
                const { getUserStatus } = await import("@/lib/actions");
                const status = await getUserStatus(values.email);

                if (!status.exists) {
                    toast.error("Account not found");
                } else if (status.isActive === false) {
                    setIsInactive(true);
                } else {
                    toast.error("Password is wrong");
                }

                setIsLoading(false);
                return;
            }



            toast.success("Successfully signed in!");
            window.location.href = "/";
        } catch (error) {
            console.error("[SIGNIN] Submission error:", error);
            toast.error("An unexpected error occurred");
            setIsLoading(false);
        }
    }

    const whatsappLink =
        "https://wa.me/8265826528?text=" +
        encodeURIComponent(
            "Hi Admin, my account is not active yet. Please activate my account."
        );

    return (
        <div className="flex h-screen w-full flex-col items-center justify-center px-4 gap-6">
            {isInactive && (
                <Alert className="max-w-sm border-orange-500/50 bg-orange-500/5 shadow-lg shadow-orange-500/10">
                    <ShieldAlert className="h-4 w-4 text-orange-600" />
                    <AlertTitle className="text-orange-700 font-bold">
                        Account Not Active
                    </AlertTitle>
                    <AlertDescription className="text-orange-600/90 text-xs">
                        Your account is not activated yet. Please contact the admin to
                        activate this account.
                        <div className="mt-4">
                            <Button
                                variant="outline"
                                size="sm"
                                className="w-full bg-white border-orange-200 hover:bg-orange-50 text-orange-700 font-bold gap-2 text-[11px] h-8"
                                asChild
                            >
                                <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                                    Contact Admin on WhatsApp
                                    <ExternalLink className="h-3 w-3" />
                                </a>
                            </Button>
                        </div>
                    </AlertDescription>
                </Alert>
            )}

            <Card className="w-full max-w-sm">
                <CardHeader>
                    <CardTitle className="text-2xl">Login</CardTitle>
                    <CardDescription>
                        Enter your email below to login to your account.
                    </CardDescription>
                </CardHeader>

                <CardContent className="grid gap-4">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input placeholder="m@example.com" {...field} />
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
                                        <div className="flex items-center justify-between">
                                            <FormLabel>Password</FormLabel>
                                            <Link
                                                href="#"
                                                className="text-sm underline text-muted-foreground"
                                            >
                                                Forgot password?
                                            </Link>
                                        </div>
                                        <FormControl>
                                            <Input type="password" placeholder="******" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <Button type="submit" className="w-full" disabled={isLoading}>
                                {isLoading && (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                )}
                                Sign In
                            </Button>
                        </form>
                    </Form>
                </CardContent>

                <CardFooter className="flex justify-center">
                    <div className="text-sm text-muted-foreground">
                        Don&apos;t have an account?{" "}
                        <Link href="/signup" className="underline text-primary">
                            Sign up
                        </Link>
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
}

export default function SignInPage() {
    return (
        <Suspense
            fallback={
                <div className="flex h-screen w-full items-center justify-center">
                    <Loader2 className="animate-spin" />
                </div>
            }
        >
            <SignInContent />
        </Suspense>
    );
}
