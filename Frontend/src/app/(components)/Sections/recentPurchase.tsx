import { useEffect, useState } from "react";
import { getSession } from "@/action";
import axios from "axios";
import jwt from "jsonwebtoken";
import AnimatedDiv from "@/app/(components)/simpleAnimate";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
interface BookingTicket {
    ticket_id: string;
    quantity: number;
}

interface OrderHistory {
    ID: string;
    event_id: string;
    total_ticket: number;
    booking_date: string;
    tickets: BookingTicket[];
    total_price: number;
    event_title?: string;
    ticket_details?: {
        ticket_id: string;
        category: string;
        price: number;
        quantity: number;
    }[];
}
interface Ticket {
    ID: string;
    category: string;
    price: number;
}

function formatDate(inputDate: string | undefined): string {
    if (!inputDate) return "";

    const formattedDate = new Date(inputDate).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
    });

    return formattedDate;
}
export default function RecentPurchase() {
    const router = useRouter();
    const [orderHistory, setOrderHistory] = useState<OrderHistory[]>();
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchHistory();
    }, []);
    const fetchHistory = async () => {
        const session = await getSession();
        try {
            const token = session.password;
            const decodeToken = jwt.decode(token);
            const userId = decodeToken?.Uid;

            const response = await axios.get<{ data: OrderHistory[] }>(
                `http://localhost:5000/orders/${userId}`,
                {
                    headers: {
                        token: token,
                    },
                }
            );

            const orders = response.data.data;

            const enrichedOrders = await Promise.all(
                orders.map(async (order) => {
                    const eventResponse = await axios.get<{ data: Event }>(
                        `http://localhost:5000/event/${order.event_id}`,
                        {
                            headers: {
                                token: token,
                            },
                        }
                    );

                    const event = eventResponse.data.data;

                    const ticketsDetails = await Promise.all(
                        order.tickets.map(async (bookingTicket) => {
                            const ticketResponse = await axios.get<{
                                data: Ticket;
                            }>(
                                `http://localhost:5000/ticket/${bookingTicket.ticket_id}`,
                                {
                                    headers: {
                                        token: token,
                                    },
                                }
                            );

                            const ticket = ticketResponse.data.data;

                            return {
                                ...ticket,
                                ticket_id: bookingTicket.ticket_id,
                                quantity: bookingTicket.quantity,
                            };
                        })
                    );

                    return {
                        ...order,
                        event_title: event.title,
                        ticket_details: ticketsDetails,
                    };
                })
            );

        
            setOrderHistory(enrichedOrders);
            console.log(enrichedOrders[0].ID);
            console.log(enrichedOrders);
        } catch (error) {
            setError("There was an error fetching the History");
        } finally {
            setLoading(false);
        }
    };

        const handleTicketRefund = async (orderId: string) => {
            console.log("Refunding ticket", orderId);
            try {
                await axios.delete(`http://localhost:5000/order/${orderId}`);
            } catch (error) {
                console.error("Error while refunding ticket", error);
            }
        };

    const handleDetail = async (eventId: string) => {
        router.push(`/pages/event?Id=${eventId}`);
    };

    return (
        <AnimatedDiv direction="right" duration={0.8} className="col-span-2 ">
            <div className=" bg-secondarycolor p-5 rounded-xl">
                <h1 className="text-3xl text-white ">Recent Purchases</h1>
                <ScrollArea className="h-[29vw]">
                    {orderHistory?.map((order , index) => (
                        <AnimatedDiv key={order.ID} className="py-2" delay={index * 0.1}>
                        
                            <div className="bg-white p-4 rounded-lg">
                                <div className="flex justify-between">
                                    <h1 className="text-2xl font-semibold text-secondarycolor">
                                        {order.event_title}
                                    </h1>
                                </div>
                                <div className="bg-gradient-to-r from-secondarycolor via-transparent dark:via-orange-500 to-secondarycolor my-2 h-[2px] w-full" />
                                <div className="flex justify-between">
                                    <div className="flex flex-col justify-between">
                                        <p>{formatDate(order.booking_date)}</p>
                                        <div className="grid grid-cols-2 gap-4">
                                            <Button
                                                className="bg-white text-secondarycolor border-2 border-secondarycolor"
                                                variant="outline"
                                                onClick={() => handleDetail (order.event_id)}
                                            >
                                                Detail
                                            </Button>
                                            <Button
                                                className="bg-white text-secondarycolor border-2 border-secondarycolor"
                                                variant="outline"
                                                onClick={() => handleTicketRefund(order.ID)}
                                            >
                                                Refund
                                            </Button>
                                        </div>
                                    </div>
                                    <div>
                                        {order.ticket_details?.map((ticket) => (
                                            <p
                                                key={ticket.ticket_id}
                                                className="text-end"
                                            >
                                                {ticket.category} x{" "}
                                                {ticket.quantity}
                                            </p>
                                        ))}
                                        <div className="bg-gradient-to-l from-orange-500 via-secondarycolor dark:via-orange-500 to-transparent my-2 h-[2px] w-full" />
                                        <p className="text-end">
                                            {order.total_ticket} Ticket
                                        </p>
                                        <p className="text-end">
                                            Rp. {order.total_price},00
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </AnimatedDiv>
                    ))}
                </ScrollArea>
            </div>
        </AnimatedDiv>
    );
}
