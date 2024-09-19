import React, { useEffect, useState } from "react";
import axios from "axios";
import { getSession } from "@/action";
import { Button } from "@/components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { MapPin } from "react-feather";

type Status = {
    value: string;
    label: string;
};

interface ComboboxProps {
    selectedRegion: string | null;
    onRegionChange: (region: string | null) => void;
}

export function Combobox({ selectedRegion, onRegionChange }: ComboboxProps) {
    const [statuses, setStatuses] = useState<Status[]>([]);
    const currentLocation = statuses.find(status => status.label === selectedRegion);
    const tempLocation = statuses[0]?.label;
    useEffect(() => {
        const fetchLocations = async () => {
            const session = await getSession();
            try {
                const token = session.password;
                const response = await axios.get("http://localhost:5000/GetRegion", {
                    headers: {
                        token: token,
                    },
                });
                const locationData = response.data.data.map(
                    (region: string, index: number) => ({
                        value: (index + 1).toString(),
                        label: region,
                    })
                );

                setStatuses(locationData);
            } catch (error) {
                console.error("There was an error fetching the locations!", error);
            }
        };

        fetchLocations();
    }, []);

    const [open, setOpen] = useState(false);

    return (
        <div className="flex items-center space-x-4 justify-center">
            <p className="text-3xl text-white font-semibold">Popular Event in</p>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        className="justify-center  bg-primarycolor text-white text-2xl border-secondarycolor border-2 "
                    >
                        {currentLocation ? (
                            <>{currentLocation.label}</>
                        ) : (
                            <>{tempLocation}</>
                        )}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="p-0 " side="right" align="start">
                    <Command>
                        <CommandInput placeholder="Cari Lokasi..." />
                        <CommandList>
                            <CommandEmpty>No results found.</CommandEmpty>
                            <CommandGroup>
                                {statuses.map((status) => (
                                    <CommandItem
                                        key={status.value}
                                        value={status.value}
                                        onSelect={(value) => {
                                            onRegionChange(
                                                statuses.find(status => status.value === value)?.label || null
                                            );
                                            setOpen(false);
                                        }}
                                    >
                                        <div className="flex py-2 group ">
                                            <MapPin size={20} className="opacity-50 group-hover:text-secondarycolor transition-colors" />
                                            <div className="px-2 group-hover:text-secondarycolor  transition-colors">{status.label}</div>
                                        </div>
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
        </div>
    );
}
