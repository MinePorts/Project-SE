"use client";
import React, { use, useEffect, useState } from "react";
import { getSession } from "@/action";
import { redirect } from "next/navigation";
import LogoutForm from "@/app/(components)/LogoutForm";
import axios from "axios";
import jwt from "jsonwebtoken";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import AnimatedDiv from "@/app/(components)/simpleAnimate";
import RecentPurchase from "../../(components)/Sections/recentPurchase";
import EditProfile from "@/app/(components)/Sections/EditProfile";

interface User {
  ID: string;
  email: string;
  password: string;
  avatar: string;
  username: string;
  createdAt: string;
  phone: string;
  age: number;
  point: number;
}

interface Event {
  ID: string;
  title: string;
  start_date: string;
  end_date: string;
  image_url: string;
  location: string;
  available_ticket: number;
  publisher_name: string;
}





const ProfilePage = () => {
  
  const [user, setUser] = useState<User>();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      const session = await getSession();
      try {
        const token = session.password;

        const decodeToken = jwt.decode(token);

        const userId = decodeToken?.Uid;
        const response = await axios.get<Event | Event[]>(
          `http://localhost:5000/account/${userId}`,
          {
            headers: {
              token: token,
            },
          }
        );

        const user = response.data.data;


        setUser(user);
      } catch (error) {
        console.error("There was an error fetching the events!", error);
        setError("There was an error fetching the events");
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);


  

  

  return (
    <div className="h-auto items-start flex p-10">
      <div className="grid grid-cols-3 w-full gap-10">
        <EditProfile  />

        <RecentPurchase />
        
        <AnimatedDiv direction="top" duration={0.8}>
          <div className="flex flex-col items-center justify-center bg-secondarycolor p-5 text-white rounded-xl">
            <div className="border-4 p-2 rounded-lg w-full ">
              <h1 className="text-center font-semibold text-[1vw]">
                FrontRow Points
              </h1>
              <h2 className="text-center font-bold text-[3vw]">
                {user?.point ?? 0}
              </h2>
            </div>
            <div className="w-full ">
              <h1 className="text-center font-semibold text-2xl py-2">
                Claimable Rewards
              </h1>
              <div className="grid grid-cols-2 gap-4 text-secondarycolor font-bold ">
                <div className="flex justify-between bg-white p-2 rounded-lg hover:bg-secondarycolor hover:border-white hover:border-4 hover:text-white transition-all">
                  <h1 className="text-xl">10% OFF</h1>
                  <h1 className="text-lg">100 pts</h1>
                </div>
                <div className="flex justify-between bg-white p-2 rounded-lg hover:bg-secondarycolor hover:border-white hover:border-4 hover:text-white transition-all">
                  <h1 className="text-xl">10% OFF</h1>
                  <h1 className="text-lg">100 pts</h1>
                </div>
                <div className="flex justify-between bg-white p-2 rounded-lg hover:bg-secondarycolor hover:border-white hover:border-4 hover:text-white transition-all">
                  <h1 className="text-xl">10% OFF</h1>
                  <h1 className="text-lg">100 pts</h1>
                </div>
                <div className="flex justify-between bg-white p-2 rounded-lg hover:bg-secondarycolor hover:border-white hover:border-4 hover:text-white transition-all">
                  <h1 className="text-xl">10% OFF</h1>
                  <h1 className="text-lg">100 pts</h1>
                </div>
              </div>
              <div>
                <Button
                  asChild
                  variant="link"
                  className="text-white p-0 font-bold text-lg"
                >
                  <Link href="/pages/points">Point page</Link>
                </Button>
              </div>
            </div>
          </div>
        </AnimatedDiv>
      </div>
    </div>
  );
};

export default ProfilePage;
