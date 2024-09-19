"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import { getSession } from "@/action";
import jwt from "jsonwebtoken";
import { motion } from "framer-motion";
import AnimatedDiv from "@/app/(components)/simpleAnimate";

export default function Points() {
    const [user, setUser] = useState<User | null>(null);
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
                console.log(user);

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
        <div className="min-h-screen p-10 text-white ">
            {!loading && (
                <div className="flex flex-col items-center">
                    <motion.div
                        initial={{ width: "10%" }}
                        animate={{ width: "100%" }}
                        transition={{
                            delay: 0.5,
                            duration: 1,
                            ease: "easeInOut",
                        }}
                        className="object-contain overflow-hidden p-2 max-w-[60vw]   "
                    >
                        <div className="w[60vw] bg-secondarycolor rounded-lg ">
                            <h1 className="text-center font-semibold text-[1vw]">
                                FrontRow Points
                            </h1>
                            <h2 className="text-center font-bold text-[3vw]">
                                {user?.point ?? 0}
                            </h2>
                        </div>
                    </motion.div>

                    <div className="py-6">
                        <h1 className="text-4xl text-center ">
                            Redeem Points For Rewards
                        </h1>
                        <div className="grid grid-cols-3 w-[60vw] gap-4">
                            {[...Array(3)].map((_, index) => (
                                <AnimatedDiv delay={index * 0.1}>
                                    <div
                                        key={index}
                                        className="group m-2 hover:m-0 transition-all bg-gradient-to-tr from-orange-500 to-secondarycolor flex flex-col justify-center items-center rounded-lg p-5"
                                    >
                                        <h1 className="text-3xl font-semibold group-hover:text-4xl transition-all">
                                            10% OFF
                                        </h1>
                                        <h1 className="pt-2 pb-1 text-lg font-medium">
                                            100 Points
                                        </h1>
                                        <button className="inline-flex h-12 animate-shimmer items-center justify-center rounded-md border-2  bg-[linear-gradient(110deg,#FFC94A,50%,#F29B72,55%,#FFC94A)] bg-[length:200%_100%] px-6 font-medium text-white transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-secondarycolor">
                                            REDEEM
                                        </button>
                                    </div>
                                </AnimatedDiv>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h1 className="text-4xl text-center ">
                            Points Activity
                        </h1>
                        <div>
                            <div></div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
