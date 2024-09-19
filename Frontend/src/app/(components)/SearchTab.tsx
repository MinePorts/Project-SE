"use client";

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
import { useState } from "react";

type Option = {
    value: string;
    label: string;
};

type ComboxProps = {
    placeholder: string;
    options: Option[];
    selectedOption: Option | null;
    onOptionSelect: (option: Option | null) => void;
};

const Combox: React.FC<ComboxProps> = ({
    placeholder,
    options,
    selectedOption,
    onOptionSelect,
}) => {
    const [open, setOpen] = useState(false);

    const handleSelect = (value: string) => {
        const option = options.find((opt) => opt.value === value) || null;
        onOptionSelect(option);
        setOpen(false);
    };

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    className="justify-center bg-primarycolor text-white text-md font-light border-secondarycolor border-2"
                >
                    {selectedOption ? (
                        <>{selectedOption.label}</>
                    ) : (
                        <>{placeholder}</>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0" side="right" align="start">
                <Command>
                    <CommandInput placeholder={`Select ${placeholder}...`}  />
                    <CommandList>
                        <CommandEmpty>No results found.</CommandEmpty>
                        <CommandGroup>
                            {options.map((option) => (
                                <CommandItem
                                    key={option.value}
                                    value={option.value}
                                    onSelect={handleSelect}
                                >
                                    <div className="flex py-2 group">
                                        <MapPin
                                            size={20}
                                            className="opacity-50 group-hover:text-secondarycolor transition-colors"
                                        />
                                        <div className="px-2 group-hover:text-secondarycolor transition-colors">
                                            {option.label}
                                        </div>
                                    </div>
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
};

export default Combox;
