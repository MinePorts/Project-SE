import axios from "axios";
import { CarouselMultiple } from "../CarouselMultiple";
import React, { use, useEffect, useState } from "react";
import { getSession } from "@/action";
import AnimatedDiv from "../simpleAnimate";
import { useRouter } from "next/navigation";



export function EventCategory() {
    const [EventCategory, setEventCategory] = useState<String[]>([]);
    const router = useRouter();

    const handleEventCategory = (category: string) => {
        router.push(`/pages/discover?topic=${category}`);
    };
    useEffect(() => {
        const fetchEventCategory = async () => {
            const session = await getSession();
            const token = session.password;
            try {
                const response = await axios.get<String[]>(
                    "http://localhost:5000/GetTopics",
                    {
                        headers: {
                            token: token,
                        },
                    }
                );

                const eventData = response.data.data;
                setEventCategory(eventData);
            } catch (error) {
                console.error("There was an error fetching the events!", error);
            }
        };
        fetchEventCategory();
    }, []);

    return (
        <div className=" h-auto  flex justify-center pt-10 ">
            <div className="  rounded-2xl pt-5 bg-white shadow-2xl drop-shadow-2xl shadow-black/25  ">
                <h1 className="text-primaryred font-bold text-3xl pb-3 px-8 text-secondarycolor">
                    Event Category
                </h1>
                <div>
                    <CarouselMultiple carouselItemClass="md:basis-1/2 lg:basis-1/6">
                        {EventCategory.map((category, index) => (
                            <AnimatedDiv
                                direction="top"
                                key={index}
                                delay={0.1 * index}
                            >
                                <div onClick={() => handleEventCategory(category)} className="group drop-shadow-lg relative m-2 hover:m-0 transition-all rounded-lg bg-cover bg-center aspect-square flex items-end justify-center bg-[url('https://loket-production-sg.s3.ap-southeast-1.amazonaws.com/images/temporary/20231122/1700651289_29NSBm.jpg')]">
                                    <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-50 transition-opacity duration-500 rounded-lg"></div>
                                    <h1 className="relative py-4 z-10 text-white text-3xl">
                                        {category}
                                    </h1>
                                </div>
                            </AnimatedDiv>
                        ))}
                    </CarouselMultiple>
                </div>
            </div>
        </div>
    );
}
