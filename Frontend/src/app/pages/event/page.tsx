"use client";

import { getSession } from "@/action";
import { useEffect, useState } from "react";
import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { PlusIcon, MinusIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import axios from "axios";
import AnimatedDiv from "@/app/(components)/simpleAnimate";
import { Calendar, MapPin, Contact } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

interface Ticket {
    ID: string;
    category: string;
    price: number;
    quantity: number;
}

interface Description {
    description: string;
    ImageURL: string;
    syarat_ketentuan: string;
}

interface Event {
    ID: string;
    title: string;
    start_date: string;
    end_date: string;
    image_url: string;
    description: Description[];
    location: string;
    available_ticket: number;
    tickets: Ticket[];
    publisher_name: string;
}

interface TicketOrder {
    ticketId: string;
    quantity: number;
}

export default function event() {
    const maxAvailable = 5;
    const searchParams = useSearchParams();
    const router = useRouter();
    const eventId = searchParams.get("Id");
    if (!eventId) {
        router.push("/");
    }

    const [ticketOrders, setTicketOrders] = useState<TicketOrder[]>([]);
    const [totalPrice, setTotalPrice] = useState<number>(0);
    const [maxTicket, setMaxTicket] = useState<boolean>(false);
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

    function formatDate(inputDate: string | undefined): string {
        if (!inputDate) return "";

        const formattedDate = new Date(inputDate).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric",
        });

        return formattedDate;
    }

    const handleCheckout = () => {
        router.push(
            `/pages/payment?eventId=${eventId}&ticketOrders=${encodeURIComponent(
                JSON.stringify(ticketOrders)
            )}`
        );
    };

    useEffect(() => {
        let total = 0;
        ticketOrders.forEach((order) => {
            const ticket = events?.tickets.find(
                (ticket) => ticket.ID === order.ticketId
            );
            if (ticket) {
                total += ticket.price * order.quantity;
            }
        });
        setTotalPrice(total);
    }, [ticketOrders]);

    useEffect(() => {
        let total = 0;
        ticketOrders.forEach((order) => {
            const ticket = events?.tickets.find(
                (ticket) => ticket.ID === order.ticketId
            );
            if (ticket) {
                total += order.quantity;
            }
        });

        if (total >= maxAvailable) {
            setMaxTicket(true);
        } else {
            setMaxTicket(false);
        }
    }, [ticketOrders]);

    const handleAddToCart = (ticketId: string) => {
        setTicketOrders((prevOrders) => {
            const existingOrder = prevOrders.find(
                (order) => order.ticketId === ticketId
            );
            if (existingOrder) {
                return prevOrders.map((order) =>
                    order.ticketId === ticketId
                        ? { ...order, quantity: order.quantity + 1 }
                        : order
                );
            } else {
                return [...prevOrders, { ticketId, quantity: 1 }];
            }
        });
    };

    const handleRemoveFromCart = (ticketId: string) => {
        setTicketOrders((prevOrders) => {
            const existingOrder = prevOrders.find(
                (order) => order.ticketId === ticketId
            );
            if (existingOrder) {
                if (existingOrder.quantity > 1) {
                    return prevOrders.map((order) =>
                        order.ticketId === ticketId
                            ? { ...order, quantity: order.quantity - 1 }
                            : order
                    );
                } else {
                    return prevOrders.filter(
                        (order) => order.ticketId !== ticketId
                    );
                }
            }
            return prevOrders;
        });
    };

    return (
        <div className="h-auto flex justify-center p-10 ">
            <div className="grid grid-cols-3 gap-10 max-w-[60vw] ">
                <div className="col-span-2">
                    <div className="rounded-lg border-4 border-secondarycolor flex justify-center bg-secondarycolor">
                        <img
                            className="max-w-[40vw] object-cover rounded-lg "
                            src={events?.image_url}
                            alt="Event Image"
                        />
                    </div>
                </div>

                <div className="flex flex-col min-w-[20vw]  justify-between font-semibold text-lg  p-4 bg-secondarycolor rounded-lg text-white">
                    <div>
                        <h1 className="text-white font-bold text-4xl w-full">
                            {events?.title}
                        </h1>
                        <div className="flex py-2">
                            <MapPin />
                            <div className="pl-2 ">{events?.location}</div>
                        </div>
                        <div className="flex py-2">
                            <Calendar />
                            <div className="pl-2">
                                {formatDate(events?.start_date)} -{" "}
                                {formatDate(events?.end_date)}
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className="bg-gradient-to-t from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-4 h-[1px] w-full" />

                        <div className="flex py-2">
                            <Contact />
                            <div className="pl-2">{events?.publisher_name}</div>
                        </div>
                    </div>
                </div>

                <div className="col-span-2">
                    <Tabs defaultValue="description">
                        <TabsList className="grid w-full grid-cols-2 bg-gradient-to-r from-secondarycolor to-orange-500">
                            <TabsTrigger value="description" className="">
                                Description
                            </TabsTrigger>
                            <TabsTrigger value="ticket" className="">
                                Ticket
                            </TabsTrigger>
                        </TabsList>
                        <TabsContent value="description">
                            <AnimatedDiv
                                direction="top"
                                delay={0.1}
                                duration={0.8}
                            >
                                <div className="w-[40vw] flex-col justify-center">
                                    <ScrollArea className="max-w-[40vw]  h-[20vw] rounded-md py-4 pb-8 text-white ">
                                        {events?.description[0].description}
                                    </ScrollArea>
                                    <h1 className="text-secondarycolor text-2xl font-semibold">
                                        Syarat dan Ketentuan
                                    </h1>
                                    <ScrollArea className="max-w-[50vw] min-h-[15vw] rounded-md py-4 text-white ">
                                        {
                                            events?.description[0]
                                                .syarat_ketentuan
                                        }
                                    </ScrollArea>
                                </div>
                            </AnimatedDiv>
                        </TabsContent>
                        <TabsContent value="ticket">
                            <ScrollArea className="max-w-3xl h-[40vw] rounded-md py-4 text-white ">
                                {events?.tickets.map((ticket, index) => (
                                    <div
                                        key={index}
                                        className="p-2 m-1 hover:m-0 transition-all"
                                    >
                                        <AnimatedDiv
                                            direction="top"
                                            delay={0.1 * index}
                                            duration={0.8}
                                        >
                                            <div className="border-secondarycolor shadow-lg shadow-secondarycolor border-2 font-semibold m-3 p-3 rounded-lg">
                                                <div className="flex items-center justify-between ">
                                                    <div>
                                                        <div className="text-xl">
                                                            <h1>
                                                                {
                                                                    ticket.category
                                                                }
                                                            </h1>
                                                        </div>
                                                        <div className="text-md font-light">
                                                            <h1>
                                                                Berakhir pada{" "}
                                                                {formatDate(
                                                                    events?.end_date
                                                                )}
                                                            </h1>
                                                        </div>
                                                    </div>
                                                    <div className="grid grid-rows-1 grid-cols-2 gap-2">
                                                        <AnimatePresence>
                                                            {!maxTicket && (
                                                                <motion.div
                                                                    initial={{
                                                                        opacity: 0,
                                                                    }}
                                                                    animate={{
                                                                        opacity: 1,
                                                                    }}
                                                                    exit={{
                                                                        opacity: 0,
                                                                    }}
                                                                    transition={{
                                                                        duration: 0.5,
                                                                        ease: "easeInOut",
                                                                    }}
                                                                >
                                                                    <Button
                                                                        variant="outline"
                                                                        size="icon"
                                                                        onClick={() =>
                                                                            handleAddToCart(
                                                                                ticket.ID
                                                                            )
                                                                        }
                                                                    >
                                                                        <PlusIcon className="h-4 w-4" />
                                                                    </Button>
                                                                </motion.div>
                                                            )}
                                                        </AnimatePresence>

                                                        <Button
                                                            variant="outline"
                                                            size="icon"
                                                            onClick={() =>
                                                                handleRemoveFromCart(
                                                                    ticket.ID
                                                                )
                                                            }
                                                        >
                                                            <MinusIcon className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </div>
                                                <Separator className="my-4 " />
                                                <div className="flex items-center justify-between">
                                                    <div className="text-lg font-bold">
                                                        <h1>
                                                            Rp {ticket.price}
                                                        </h1>
                                                    </div>
                                                    <div className="text-secondarycolor">
                                                        <h1>Available</h1>
                                                    </div>
                                                </div>
                                            </div>
                                        </AnimatedDiv>
                                    </div>
                                ))}
                            </ScrollArea>
                        </TabsContent>
                    </Tabs>
                </div>
                <div className="grid grid-cols-1 gap-4">
                    <div className="flex flex-col overflow-hidden min-w-[20vw] max-h-[30vw] justify-between font-semibold text-lg  p-4 bg-gradient-to-br from-secondarycolor to-orange-500 rounded-lg text-white">
                        <div>
                            <h1 className="text-3xl">Ticket Order</h1>
                            <div className="text-primarycolor">
                                {ticketOrders.map((order, index) => {
                                    const ticket = events?.tickets.find(
                                        (ticket) => ticket.ID === order.ticketId
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
                                                            {ticket?.category}
                                                        </h1>
                                                        <h1 className="font-light">
                                                            Rp. {ticket?.price}
                                                            ,00
                                                        </h1>
                                                    </div>
                                                    <div className="flex">
                                                        <div className="bg-gradient-to-t from-transparent via-neutral-300 dark:via-neutral-700 to-transparent mx-4 w-[1px] h-full" />
                                                        <h1>
                                                            {order.quantity}x
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
                    <AnimatePresence>
                        {ticketOrders.length !== 0 && (
                            <div>
                                {ticketOrders.length !== 0 && (
                                    <motion.a
                                        key="checkoutButton"
                                        href="#"
                                        onClick={handleCheckout}
                                        className={`group block h-[2vw] border-secondarycolor border-4 rounded-xl hover:border-none hover:bg-secondarycolor transition-all animate-slide-down`}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{
                                            opacity: 0,
                                            transition: { duration: 0.5 },
                                        }}
                                    >
                                        <motion.div
                                            className="flex justify-center h-full"
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            <button className="text-secondarycolor text-xl group-hover:text-white">
                                                Checkout
                                            </button>
                                        </motion.div>
                                    </motion.a>
                                )}
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
