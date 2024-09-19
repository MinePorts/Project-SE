"use client";
import React, { useState } from "react";
import { AceLabel } from "@/components/ui/ace-label";
import { Input } from "@/components/ui/ace-input";
import { cn } from "@/utils/cn";
import {
    IconBrandApple,
    IconBrandGoogle,
    IconBrandFacebook,
} from "@tabler/icons-react";
import { motion } from "framer-motion";
import axios from "axios";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useRouter } from "next/navigation";
const formSchema = z.object({
    username: z
        .string()
        .min(5, "Username must be between 5 and 20 characters")
        .max(20, "Username must be between 5 and 20 characters"),
    email: z.string().email("Invalid email address"),
    picture: z.any(),

    phone: z.string().regex(/^\d+$/, "Phone number must only contain numbers"),
    password: z
        .string()
        .min(8, "Password must be at least 8 characters long")
        .regex(/[a-z]/, "Password must contain at least one lowercase letter")
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
        .regex(/\d/, "Password must contain at least one number")
        .regex(
            /[^a-zA-Z0-9]/,
            "Password must contain at least one special character"
        ),
});

interface FormValues {
    username: string;
    email: string;
    citizenId: File | null;
    phone: string;
    password: string;
}

export function RegisterForm() {
    const [errors, setErrors] = useState("");
    const router = useRouter();
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);

        const newFormValues: FormValues = {
            username: formData.get("username") as string,
            email: formData.get("email") as string,
            citizenId: formData.get("citizenId") as File,
            phone: formData.get("phone") as string,
            password: formData.get("password") as string,
        };

        try {
            formSchema.parse(newFormValues);
            console.log("Form values are valid:", newFormValues);
            axios.post("http://localhost:5000/register", newFormValues);
            router.push("/pages/login")
        } catch (error) {
            if (error instanceof z.ZodError) {
                const fieldErrors: Record<string, string> = {};
                let isFirstError = true;

                error.errors.some((err) => {
                    if (err.path) {
                        fieldErrors[err.path[0]] = err.message;
                        if (isFirstError) {
                            setErrors(err.message);
                            isFirstError = false;
                        }
                    }
                    return isFirstError;
                });
            } else {
                console.error("Form validation error:", error);
            }
        }
        console.log(errors);
        console.log(newFormValues);
    };

    const handleSignIn = () => {
        event.preventDefault();
        router.push("/pages/login");
    }

    return (
        <motion.div
            initial={{ opacity: 0.0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{
                delay: 0.1,
                duration: 0.6,
                ease: "easeInOut",
            }}
            className="relative flex flex-col gap-4 items-center justify-center px-4"
        >
            <div className="h-screen flex items-start p-10">
                <div className=" w-[40vw] mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-white dark:bg-black shadow-md hover:shadow-lg hover:shadow-secondarycolor shadow-secondarycolor transition-shadow duration-700">
                    <h2 className="font-bold text-xl text-neutral-800 dark:text-neutral-200">
                        Welcome to FrontRow
                    </h2>

                    <form className="my-8" onSubmit={handleSubmit}>
                        <div>
                            <motion.div
                                initial={{ opacity: 0.0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{
                                    delay: 0.1,
                                    duration: 0.9,
                                    ease: "easeInOut",
                                }}
                            >
                                <LabelInputContainer className="mb-4">
                                    <AceLabel htmlFor="username">Username</AceLabel>
                                    <Input
                                        id="username"
                                        name="username"
                                        placeholder="Peter"
                                        type="text"
                                    />
                                </LabelInputContainer>
                            </motion.div>
                        </div>
                        <div>
                            <motion.div
                                initial={{ opacity: 0.0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{
                                    delay: 0.2,
                                    duration: 0.9,
                                    ease: "easeInOut",
                                }}
                            >
                                <LabelInputContainer className="mb-4">
                                    <AceLabel htmlFor="email">Email Address</AceLabel>
                                    <Input
                                        id="email"
                                        name="email"
                                        placeholder="User@Frontrow.com"
                                        type="text"
                                    />
                                </LabelInputContainer>
                            </motion.div>
                        </div>

                        <div>
                            <motion.div
                                initial={{ opacity: 0.0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{
                                    delay: 0.3,
                                    duration: 0.9,
                                    ease: "easeInOut",
                                }}
                            >
                                <LabelInputContainer className="mb-4">
                                    <AceLabel htmlFor="email">Citizen ID</AceLabel>
                                    <Input
                                        id="citizenId"
                                        type="file"
                                        name="citizenId"
                                    />
                                </LabelInputContainer>
                            </motion.div>
                        </div>

                        <div>
                            <motion.div
                                initial={{ opacity: 0.0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{
                                    delay: 0.4,
                                    duration: 0.9,
                                    ease: "easeInOut",
                                }}
                            >
                                <LabelInputContainer className="mb-4">
                                    <AceLabel htmlFor="phone">Phone Number</AceLabel>
                                    <Input
                                        id="phone"
                                        name="phone"
                                        placeholder="Phone Number"
                                        type="phone"
                                    />
                                </LabelInputContainer>
                            </motion.div>
                        </div>

                        <div>
                            <motion.div
                                initial={{ opacity: 0.0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{
                                    delay: 0.5,
                                    duration: 0.9,
                                    ease: "easeInOut",
                                }}
                            >
                                
                                <LabelInputContainer className="mb-4">
                                    <AceLabel htmlFor="password">Password</AceLabel>
                                    <Input
                                        id="password"
                                        name="password"
                                        placeholder="••••••••"
                                        type="password"
                                    />
                                </LabelInputContainer>
                            </motion.div>
                        </div>
                        <h1 className="text-sm font-light text-red-700 py-2">
                            {errors}
                        </h1>

                        <div className="flex justify-between">
                            <div className="flex items-center space-x-2 py-2">
                                <Checkbox
                                    id="terms"
                                    className="border-secondarycolor"
                                />
                                <AceLabel
                                    htmlFor="terms"
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                    Accept terms and conditions
                                </AceLabel>
                            </div>
                            <Button variant="link" className="p-0" onClick={handleSignIn} >Sign in</Button>
                        </div>
                        <button
                            className="bg-gradient-to-br relative group/btn from-secondarycolor  dark:to-yellow-600 to-yellow-700 block dark:bg-yellow-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
                            type="submit"
                        >
                            Sign up &rarr;
                            <BottomGradient />
                        </button>

                        <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-8 h-[1px] w-full" />

                        <div className="flex flex-col space-y-4">
                            <motion.div
                                initial={{ opacity: 0.0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{
                                    delay: 0.6,
                                    duration: 0.9,
                                    ease: "easeInOut",
                                }}
                            >
                                <button
                                    className=" relative group/btn flex space-x-2 items-center justify-start px-4 w-full text-black rounded-md h-10 font-medium shadow-input bg-gray-50 dark:bg-zinc-900 dark:shadow-[0px_0px_1px_1px_var(--neutral-800)]"
                                    type="submit"
                                >
                                    <IconBrandApple className="h-4 w-4 text-neutral-800 dark:text-neutral-300" />
                                    <span className="text-neutral-700 dark:text-neutral-300 text-sm">
                                        Apple ID
                                    </span>
                                    <BottomGradient />
                                </button>
                            </motion.div>
                            <motion.div
                                initial={{ opacity: 0.0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{
                                    delay: 0.7,
                                    duration: 0.9,
                                    ease: "easeInOut",
                                }}
                            >
                                <button
                                    className=" relative group/btn flex space-x-2 items-center justify-start px-4 w-full text-black rounded-md h-10 font-medium shadow-input bg-gray-50 dark:bg-zinc-900 dark:shadow-[0px_0px_1px_1px_var(--neutral-800)]"
                                    type="submit"
                                >
                                    <IconBrandGoogle className="h-4 w-4 text-neutral-800 dark:text-neutral-300" />
                                    <span className="text-neutral-700 dark:text-neutral-300 text-sm">
                                        Google
                                    </span>
                                    <BottomGradient />
                                </button>
                            </motion.div>
                            <motion.div
                                initial={{ opacity: 0.0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{
                                    delay: 0.8,
                                    duration: 0.9,
                                    ease: "easeInOut",
                                }}
                            >
                                <button
                                    className=" relative group/btn flex space-x-2 items-center justify-start px-4 w-full text-black rounded-md h-10 font-medium shadow-input bg-gray-50 dark:bg-zinc-900 dark:shadow-[0px_0px_1px_1px_var(--neutral-800)]"
                                    type="submit"
                                >
                                    <IconBrandFacebook className="h-4 w-4 text-neutral-800 dark:text-neutral-300" />
                                    <span className="text-neutral-700 dark:text-neutral-300 text-sm">
                                        Facebook
                                    </span>
                                    <BottomGradient />
                                </button>
                            </motion.div>
                        </div>
                    </form>
                </div>
            </div>
        </motion.div>
    );
}

const BottomGradient = () => {
    return (
        <>
            <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-secondarycolor to-transparent" />
            <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-yellow-700 to-transparent" />
        </>
    );
};

const LabelInputContainer = ({
    children,
    className,
}: {
    children: React.ReactNode;
    className?: string;
}) => {
    return (
        <div className={cn("flex flex-col space-y-2 w-full", className)}>
            {children}
        </div>
    );
};

export default RegisterForm;
