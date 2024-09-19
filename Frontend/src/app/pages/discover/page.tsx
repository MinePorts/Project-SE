"use client";
import * as React from "react";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import SearchTab from "@/app/(components)/SearchTab";
import AnimatedDiv from "@/app/(components)/simpleAnimate";
import { useState, useEffect } from "react";
import { Cross1Icon } from "@radix-ui/react-icons";
import { EventCard } from "@/app/(components)/EventCard";
import axios from "axios";
import { getSession } from "@/action";
import { set } from "lodash";
import DatePicker from "react-datepicker";
// npm install react-datepicker
// npm install --save-dev @types/react-datepicker
import "react-datepicker/dist/react-datepicker.css";
import { useSearchParams } from "next/navigation";

type Option = {
    value: string;
    label: string;
};

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

export default function Discover() {
    const [selectedLocation, setSelectedLocation] = useState<Option | null>(
        null
    );
    const [selectedTopic, setSelectedTopic] = useState<Option | null>(null);
    const [selectedTimeRange, setSelectedTimeRange] = useState<
        [Date | null, Date | null]
    >([null, null]);
    const [selectedPriceRange, setSelectedPriceRange] = useState<
        [number, number]
    >([0, 1000]);

    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [locations, setLocations] = useState<Option[]>([]);
    const [topics, setTopics] = useState<Option[]>([]);
    const searchParams = useSearchParams();

    useEffect(() => {
        const topic = searchParams.get("topic");
        if (topic) {
            const selectedTopic = topics.find(
                (option) => option.label === topic
            );
            console.log("selectedTopic", selectedTopic);
            if (selectedTopic) {
                setSelectedTopic(selectedTopic);
            }
            const fetchEvents = async () => {
                try {
                    const session = await getSession();
                    const token =  session.password;

                    const response = await axios.get<Event[]>(
                        "http://localhost:5000/GetFilterEvent",
                        {
                            headers: {
                                token: token,
                            },
                            params: { label: topic },
                        }
                    );

                    const eventData = response.data.data;
                    setEvents(eventData);
                } catch (error) {
                    console.error(
                        "There was an error fetching the events!",
                        error
                    );
                    setError("There was an error fetching the events");
                } finally {
                    setLoading(false);
                }
            };
            fetchEvents();
        }
    }, [topics]);

    const resetSelection = (
        setSelected: React.Dispatch<React.SetStateAction<Option | null>>
    ) => {
        setSelectedLocation(null);
        setSelectedTopic(null);
        setSelectedTimeRange([null, null]);
        setSelectedPriceRange([0, 1000]);
        fetchEvents({});
    };

    useEffect(() => {
        const fetchLocations = async () => {
            const session = await getSession();
            try {
                const token = session.password;
                const response = await axios.get(
                    "http://localhost:5000/GetRegion",
                    {
                        headers: {
                            token: token,
                        },
                    }
                );
                const locationData = response.data.data.map(
                    (region: string, index: number) => ({
                        value: (index + 1).toString(),
                        label: region,
                    })
                );

                setLocations(locationData);
            } catch (error) {
                console.error(
                    "There was an error fetching the locations!",
                    error
                );
                setError("There was an error fetching the locations");
            }
        };

        const fetchTopics = async () => {
            const session = await getSession();
            try {
                const token = session.password;
                const response = await axios.get(
                    "http://localhost:5000/GetTopics",
                    {
                        headers: {
                            token: token,
                        },
                    }
                );
                const topicData = response.data.data.map(
                    (topic: string, index: number) => ({
                        value: (index + 1).toString(),
                        label: topic,
                    })
                );
                setTopics(topicData);
            } catch (error) {
                console.error("There was an error fetching the topics!", error);
                setError("There was an error fetching the topics");
            }
        };
        fetchEvents({});
        fetchLocations();
        fetchTopics();
    }, []);

    const fetchEvents = async (filters: any) => {
        try {
            const session = await getSession();
            const token = session.password;

            const formattedFilters = {
                ...filters,
                startTime: selectedTimeRange[0]?.toISOString().split("T")[0],
                endTime: selectedTimeRange[1]?.toISOString().split("T")[0],
            };

            const response = await axios.get<Event[]>(
                "http://localhost:5000/GetFilterEvent",
                {
                    headers: {
                        token: token,
                    },
                    params: filters,
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

    return (
        <div className="h-screen flex p-10">
            <div className="flex">
                <div className="px-8">
                    <Accordion
                        type="single"
                        collapsible
                        className="w-full text-white min-w-72 border-2 border-secondarycolor p-4 rounded-lg "
                    >
                        <h1 className="font-semibold">Filter</h1>
                        <AnimatedDiv direction="bottom" delay={0.1}>
                            <AccordionItem value="item-1">
                                <AccordionTrigger>Location</AccordionTrigger>
                                <AccordionContent>
                                    <div className="flex items-center justify-between">
                                        <AnimatedDiv
                                            direction="left"
                                            duration={0.3}
                                        >
                                            <SearchTab
                                                placeholder="Location"
                                                options={locations}
                                                selectedOption={
                                                    selectedLocation
                                                }
                                                onOptionSelect={(option) => {
                                                    setSelectedLocation(option);
                                                    fetchEvents({
                                                        region: option?.label,
                                                    });
                                                }}
                                            />
                                        </AnimatedDiv>

                                        {selectedLocation && (
                                            <AnimatedDiv direction="right">
                                                <div className="p-2">
                                                    <Cross1Icon
                                                        className="w-6 h-6 text-secondarycolor hover:text-white transition-colors cursor-pointer"
                                                        onClick={() =>
                                                            resetSelection(
                                                                setSelectedLocation
                                                            )
                                                        }
                                                    />
                                                </div>
                                            </AnimatedDiv>
                                        )}
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        </AnimatedDiv>

                        <AnimatedDiv direction="bottom" delay={0.3}>
                            <AccordionItem value="item-3">
                                <AccordionTrigger>Topic</AccordionTrigger>
                                <AccordionContent>
                                    <div className="flex items-center justify-between">
                                        <AnimatedDiv
                                            direction="left"
                                            duration={0.3}
                                        >
                                            <SearchTab
                                                placeholder="Topic"
                                                options={topics}
                                                selectedOption={selectedTopic}
                                                onOptionSelect={(option) => {
                                                    setSelectedTopic(option);
                                                    fetchEvents({
                                                        label: option?.label,
                                                    });
                                                }}
                                            />
                                        </AnimatedDiv>

                                        {selectedTopic && (
                                            <AnimatedDiv direction="right">
                                                <div className="p-2">
                                                    <Cross1Icon
                                                        className="w-6 h-6 text-secondarycolor hover:text-white transition-colors cursor-pointer"
                                                        onClick={() =>
                                                            resetSelection(
                                                                setSelectedTopic
                                                            )
                                                        }
                                                    />
                                                </div>
                                            </AnimatedDiv>
                                        )}
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        </AnimatedDiv>

                        <AnimatedDiv direction="bottom" delay={0.4}>
                            <AccordionItem value="item-4">
                                <AccordionTrigger>Time Range</AccordionTrigger>
                                <AccordionContent>
                                    <div className="flex items-center justify-between">
                                        <AnimatedDiv
                                            direction="left"
                                            duration={0.3}
                                        >
                                            <DatePicker
                                                selectsRange={true}
                                                startDate={selectedTimeRange[0]}
                                                endDate={selectedTimeRange[1]}
                                                onChange={(dates: any) => {
                                                    setSelectedTimeRange(dates);
                                                    fetchEvents({
                                                        startTime: dates[0]
                                                            ?.toISOString()
                                                            .split("T")[0],
                                                        endTime: dates[1]
                                                            ?.toISOString()
                                                            .split("T")[0],
                                                    });
                                                }}
                                                dateFormat="yyyy-MM-dd"
                                                placeholderText="Select a date range"
                                                className="border border-gray-300 rounded-md px-3 py-2 text-black"
                                            />
                                        </AnimatedDiv>

                                        {selectedTimeRange[0] &&
                                            selectedTimeRange[1] && (
                                                <AnimatedDiv direction="right">
                                                    <div className="p-2">
                                                        <Cross1Icon
                                                            className="w-6 h-6 text-secondarycolor hover:text-white transition-colors cursor-pointer"
                                                            onClick={() =>
                                                                resetSelection(
                                                                    setSelectedTimeRange
                                                                )
                                                            }
                                                        />
                                                    </div>
                                                </AnimatedDiv>
                                            )}
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        </AnimatedDiv>

                        <AnimatedDiv direction="bottom" delay={0.5}>
                            <AccordionItem value="item-5">
                                <AccordionTrigger>Price Range</AccordionTrigger>
                                <AccordionContent>
                                    <div className="flex items-center justify-between">
                                        <AnimatedDiv
                                            direction="left"
                                            duration={0.3}
                                        >
                                            <div className="flex items-center space-x-2">
                                                <input
                                                    type="number"
                                                    name="minPrice"
                                                    value={
                                                        selectedPriceRange[0]
                                                    }
                                                    onChange={(e) => {
                                                        const minValue =
                                                            parseFloat(
                                                                e.target.value
                                                            );
                                                        setSelectedPriceRange([
                                                            minValue,
                                                            selectedPriceRange[1],
                                                        ]);
                                                        fetchEvents({
                                                            minPrice: minValue,
                                                            maxPrice:
                                                                selectedPriceRange[1],
                                                        });
                                                    }}
                                                    className="border border-gray-300 rounded-md px-3 py-2 text-black"
                                                />
                                            </div>
                                            <div className="mt-2">
                                                <div className="justify-center items-center flex">
                                                    <span>To</span>
                                                </div>
                                                <input
                                                    type="number"
                                                    name="maxPrice"
                                                    value={
                                                        selectedPriceRange[1]
                                                    }
                                                    onChange={(e) => {
                                                        const maxValue =
                                                            parseFloat(
                                                                e.target.value
                                                            );
                                                        setSelectedPriceRange([
                                                            selectedPriceRange[0],
                                                            maxValue,
                                                        ]);
                                                        fetchEvents({
                                                            minPrice:
                                                                selectedPriceRange[0],
                                                            maxPrice: maxValue,
                                                        });
                                                    }}
                                                    className="border border-gray-300 rounded-md px-3 py-2 text-black"
                                                />
                                            </div>
                                        </AnimatedDiv>

                                        {selectedPriceRange[0] !== 0 ||
                                            (selectedPriceRange[1] !== 100 && (
                                                <AnimatedDiv direction="right">
                                                    <div className="p-2">
                                                        <Cross1Icon
                                                            className="w-6 h-6 text-secondarycolor hover:text-white transition-colors cursor-pointer"
                                                            onClick={() =>
                                                                resetSelection(
                                                                    setSelectedPriceRange
                                                                )
                                                            }
                                                        />
                                                    </div>
                                                </AnimatedDiv>
                                            ))}
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        </AnimatedDiv>
                    </Accordion>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 px-4">
                    {events?.length > 0 ? (
                        events?.slice(0, 8).map((event, index) => (
                            <div
                                key={event.ID}
                                className="drop-shadow-xl hover:shadow-primaryred hover:shadow-lg rounded-lg transition-all duration-600"
                            >
                                <AnimatedDiv
                                    direction="bottom"
                                    delay={0.2 * index + 1}
                                    duration={1}
                                >
                                    <EventCard event={event} />
                                </AnimatedDiv>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-4 text-center text-white">
                            No events found.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
