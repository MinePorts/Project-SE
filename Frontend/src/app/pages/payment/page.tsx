"use client";
import React, { use, useEffect, useState } from "react";
import { AceLabel } from "@/components/ui/ace-label";
import { Input } from "@/components/ui/ace-input";
import { cn } from "@/utils/cn";
import { useRouter, useSearchParams } from "next/navigation";

import { IconCreditCard } from "@tabler/icons-react";
import { getSession } from "@/action";
import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import AnimatedDiv from "@/app/(components)/simpleAnimate";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import ClickTextCapt from "@/app/(components)/ClickTextCapt";
import { useGithub } from "@/app/(components)/Hooks/useGithub";

interface Ticket {
    ID: string;
    category: string;
    price: number;
    quantity: number;
}

interface Event {
    ID: string;
    title: string;
    start_date: string;
    end_date: string;
    image_url: string;
    description: string;
    location: string;
    available_ticket: number;
    tickets: Ticket[];
    publishername: string;
}

interface TicketOrder {
    ticketId: string;
    quantity: number;
}

const Payment = () => {
    const searchParams = useSearchParams();

    const eventId = searchParams.get("eventId");
    const encodedTicketOrders = searchParams.get("ticketOrders");

    useEffect(() => {
        let decodedTicketOrders: TicketOrder[] = [];
        if (encodedTicketOrders) {
            try {
                decodedTicketOrders = JSON.parse(
                    decodeURIComponent(encodedTicketOrders)
                );
            } catch (error) {
                console.error("Error decoding ticketOrders:", error);
            }
        }

        setTicketOrders(decodedTicketOrders);
    }, []);

    

    const [ticketOrders, setTicketOrders] = useState<TicketOrder[]>([]);
    const [events, setEvents] = useState<Event>();
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchEvents = async () => {
            const session = await getSession();
            try {
                const token = session.password;

                const response = await axios.get<Event | Event[]>(
                    "http://localhost:5000/event/" + eventId,
                    {
                        headers: {
                            token: token,
                        },
                    }
                );
                const eventData = response.data.data;

                setEvents(eventData);
            } catch (error) {
                console.error("There was an error fetching the events!", error);
                setError("There was an error fetching the events");
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, []);

    const totalPrice = ticketOrders.reduce((acc, order) => {
        const ticket = events?.tickets.find(
            (ticket) => ticket.ID === order.ticketId
        );
        return acc + (ticket?.price ?? 0) * order.quantity;
    }, 0);

    function formatDate(inputDate: string | undefined): string {
        if (!inputDate) return "";

        const formattedDate = new Date(inputDate).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric",
        });

        return formattedDate;
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const session = await getSession();
        if (!session) {
            console.error("User is not authenticated!");
            return;
        }

        const bookingData = {
            user_id: session.userId,
            event_id: eventId,
            total_ticket: ticketOrders.reduce((acc, order) => acc + order.quantity, 0),
            booking_date: new Date().toISOString(),
            tickets: ticketOrders.map(order => ({
                ticket_id: order.ticketId,
                quantity: order.quantity
            })),
            total_price: totalPrice,
        };

        try {
            await axios.post("http://localhost:5000/order", bookingData, {
                headers: {
                    token: session.password,
                },
            });
            console.log("Booking successful!");
        } catch (error) {
            console.error("There was an error booking the tickets!", error);
        }
    };

    return (
        <>
            <div className="h-screen flex items-center justify-center">
                <div className="grid gap-4 ">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: "100%" }}
                        transition={{
                            delay: 0.5,
                            duration: 1,
                            ease: "easeIn",
                        }}
                        className="object-contain overflow-hidden"
                    >
                        <div className="bg-gradient-to-tr from-orange-500 to-secondarycolor rounded-xl h-full w-full">
                            <div className="flex-col  items-center p-4">
                                <h1 className="text-3xl text-white font-bold pb-2 px-2">
                                    Payment
                                </h1>

                                <div className="text-white p-2 rounded-lg flex justify-between">
                                    <h1 className="text-4xl font-semibold">
                                        {events?.title}
                                    </h1>

                                    <h1 className="text-secondarycolor text-xl bg-white p-2 rounded-lg">
                                        {formatDate(events?.start_date)} -{" "}
                                        {formatDate(events?.end_date)}
                                    </h1>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                    <div className="grid gap-4 grid-cols-2  ">
                        <div className="bg-gradient-to-r from-secondarycolor to-orange-500 p-2 rounded-3xl">
                            <div className="flex flex-col justify-between w-[30vw] bg-white h-[18vw] rounded-3xl p-4 px-8 shadow-lg shadow-secondarycolor object-contain overflow-hidden ">
                                <div className="flex justify-between  items-center">
                                    <AceLabel className="text-2xl ">
                                        Payment Information
                                    </AceLabel>
                                    <IconCreditCard size={60} />
                                </div>
                                <form className="" onSubmit={handleSubmit}>
                                    <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mb-4">
                                        <LabelInputContainer>
                                            <AceLabel htmlFor="cardNumber">
                                                Card number*
                                            </AceLabel>
                                            <Input
                                                id="cardNumber"
                                                name="cardNumber"
                                                placeholder="0000 0000 0000 0000"
                                                type="text"
                                            />
                                        </LabelInputContainer>
                                        <LabelInputContainer className="max-w-[5vw]">
                                            <AceLabel htmlFor="lastname">
                                                CVV*
                                            </AceLabel>
                                            <Input
                                                id="cvv"
                                                name="cvv"
                                                placeholder="123"
                                                type="text"
                                            />
                                        </LabelInputContainer>
                                    </div>
                                    <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mb-4">
                                        <LabelInputContainer>
                                            <AceLabel htmlFor="Name*">
                                                Name*
                                            </AceLabel>
                                            <Input
                                                id="name"
                                                name="name"
                                                placeholder="John Smith"
                                                type="text"
                                            />
                                        </LabelInputContainer>
                                        <LabelInputContainer className="max-w-[10vw]">
                                            <AceLabel htmlFor="ExpireDate">
                                                Expiration Date*
                                            </AceLabel>
                                            <Input
                                                id="expireDate"
                                                name="expireDate"
                                                placeholder="MM/YY"
                                                type="text"
                                            />
                                        </LabelInputContainer>
                                    </div>
                                </form>
                            </div>
                        </div>

                        <div className="flex flex-col row-span-2 overflow-hidden min-w-[20vw] max-h-[30vw] justify-between font-semibold text-lg  p-4 bg-gradient-to-br from-secondarycolor to-orange-500 rounded-lg text-white">
                            <div>
                                <h1 className="text-3xl">Ticket Order</h1>
                                <div className="text-primarycolor">
                                    {ticketOrders.map((order, index) => {
                                        const ticket = events?.tickets.find(
                                            (ticket) =>
                                                ticket.ID === order.ticketId
                                        );
                                        return (
                                            <div
                                                key={index}
                                                className="flex-col items-center justify-between p-2"
                                            >
                                                <div className="bg-gradient-to-t from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-4 h-[1px] w-full" />
                                                <AnimatedDiv
                                                    direction="left"
                                                    duration={0.8}
                                                >
                                                    <div className="flex justify-between items-center bg-white text-secondarycolor p-2 px-4 rounded-lg drop-shadow-md m-2 hover:m-0 transition-all">
                                                        <div>
                                                            <h1 className="text-xl">
                                                                {
                                                                    ticket?.category
                                                                }
                                                            </h1>
                                                            <h1 className="font-light">
                                                                Rp.{" "}
                                                                {ticket?.price}
                                                                ,00
                                                            </h1>
                                                        </div>
                                                        <div className="flex">
                                                            <div className="bg-gradient-to-t from-transparent via-neutral-300 dark:via-neutral-700 to-transparent mx-4 w-[1px] h-full" />
                                                            <h1>
                                                                {order.quantity}
                                                                x
                                                            </h1>
                                                        </div>
                                                    </div>
                                                </AnimatedDiv>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                            <div className="">
                                <div className="bg-gradient-to-t from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-4 h-[1px] w-full" />
                                <div className="flex justify-between ">
                                    <h1>Total Price</h1>
                                    <h1>Rp. {totalPrice},00</h1>
                                </div>
                            </div>
                        </div>

                        {ticketOrders.length !== 0 && (
                            <div className="flex  items-center justify-center border-2 p-2 rounded-lg border-secondarycolor">
                                <div className="text-white px-5">
                                    <h1 className="text-3xl">Checkout</h1>
                                    <p className="">
                                        Please verify your payment
                                    </p>
                                </div>
                                <div className="flex-col items-center justify-end">
                                    <ClickTextCapt />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Payment;

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
