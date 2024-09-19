import React, { useEffect, useState } from "react";
import axios from "axios";
import { getSession } from "@/action";
import { EventCard } from "../EventCard"; // Adjust the path as necessary
import AnimatedDiv from "../simpleAnimate";
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
}

interface PopularEventProps {
    selectedRegion: string | null;
}

export function PopularEvent({ selectedRegion }: PopularEventProps) {
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchEvents = async () => {
            const session = await getSession();
            const regionToFetch = selectedRegion || "Jakarta"; 

            try {
                const token = session.password;
                const response = await axios.get<Event | Event[]>(
                    `http://localhost:5000/filterRegion/${regionToFetch}`,
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
    }, [selectedRegion]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className="h-auto flex justify-center items-center">
            <div className="flex-col justify-center p-4 overflow-hidden w-[80vw] rounded-2xl">
                <div className="flex justify-evenly">
                    {events?.slice(0, 4).map((event) => (
                        <AnimatedDiv direction="top" >
                            <div
                                key={event.ID}
                                className="drop-shadow-xl hover:shadow-primaryred hover:shadow-lg rounded-lg transition-all duration-600"
                            >
                                <EventCard event={event} />
                            </div>
                        </AnimatedDiv>
                    ))}
                </div>
            </div>
        </div>
    );
}
