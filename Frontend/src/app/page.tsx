"use client";
import Hero from "./(components)/Sections/Hero";
import { EventCategory } from "./(components)/Sections/EventCategory";
import { PopularEvent } from "./(components)/Sections/PopularEvent";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { getSession } from "@/action";
import { EventPopular } from "./(components)/EventPopular";
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

export default function Home() {
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);


    useEffect(() => {
        const fetchEvents = async () => {
          const session = await getSession();
          try {
            const token = session.password;
            
            const response = await axios.get<Event | Event[]>(
              "http://localhost:5000/events",
              {
                headers: {
                  token: token, // Include the token in the Authorization header
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


    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className="font-poppins bg-primarycolor p-10">
            <Hero />
            <EventPopular />
            <EventCategory />
      
        </div>
    );
}
