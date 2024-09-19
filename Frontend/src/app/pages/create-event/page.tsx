"use client";

import * as React from "react";
import { CalendarIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";
import { DateRange } from "react-day-picker";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { AceLabel } from "@/components/ui/ace-label";
import { Input } from "@/components/ui/ace-input";
import { motion } from "framer-motion";

export function CreateEvent({
    className,
}: React.HTMLAttributes<HTMLDivElement>) {
    const today = new Date();
    const [date, setDate] = React.useState<DateRange | undefined>({
        from: today,
        to: today,
    });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log("Form submitted");
    };

    return (
        <div className="h-screen flex justify-center p-10 items-center">
            <div className="">
                <div className="max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-white dark:bg-black">
                    <h2 className="font-bold text-xl text-neutral-800 dark:text-neutral-200">
                        Welcome to Aceternity
                    </h2>
                    <p className="text-neutral-600 text-sm max-w-sm mt-2 dark:text-neutral-300">
                        Login to aceternity if you can because we don&apos;t
                        have a login flow yet
                    </p>

                    <form className="my-8" onSubmit={handleSubmit}>
                        <div>
                            <motion.div
                                initial={{ opacity: 0.0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{
                                    delay: 0.1,
                                    duration: 0.8,
                                    ease: "easeInOut",
                                }}
                            >
                                <LabelInputContainer className="mb-4">
                                    <AceLabel htmlFor="email">
                                        Event Title
                                    </AceLabel>
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
                                    delay: 0.1,
                                    duration: 0.8,
                                    ease: "easeInOut",
                                }}
                            >
                                <LabelInputContainer className="mb-4">
                                    <AceLabel htmlFor="email">
                                        Event Date
                                    </AceLabel>

                                    <div
                                        className={cn("grid gap-2", className)}
                                    >
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    id="date"
                                                    variant={"outline"}
                                                    className={cn(
                                                        "w-[300px] justify-start text-left font-normal ",
                                                        !date &&
                                                            "text-muted-foreground"
                                                    )}
                                                >
                                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                                    {date?.from ? (
                                                        date.to ? (
                                                            <>
                                                                {format(
                                                                    date.from,
                                                                    "LLL dd, y"
                                                                )}{" "}
                                                                -{" "}
                                                                {format(
                                                                    date.to,
                                                                    "LLL dd, y"
                                                                )}
                                                            </>
                                                        ) : (
                                                            format(
                                                                date.from,
                                                                "LLL dd, y"
                                                            )
                                                        )
                                                    ) : (
                                                        <span>Pick a date</span>
                                                    )}
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent
                                                className="w-auto p-0"
                                                align="start"
                                            >
                                                <Calendar
                                                    initialFocus
                                                    mode="range"
                                                    defaultMonth={date?.from}
                                                    selected={date}
                                                    onSelect={setDate}
                                                    numberOfMonths={2}
                                                />
                                            </PopoverContent>
                                        </Popover>
                                    </div>
                                </LabelInputContainer>
                            </motion.div>
                        </div>
                        <button
                            className="bg-gradient-to-br relative group/btn from-secondarycolor  dark:to-yellow-600 to-yellow-700 block dark:bg-yellow-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
                            type="submit"
                        >
                            Create Event &rarr;
                            <BottomGradient />
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default CreateEvent;

const BottomGradient = () => {
    return (
        <>
            <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
            <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
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
