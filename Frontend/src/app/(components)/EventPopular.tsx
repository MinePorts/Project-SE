import React, { useState } from "react";
import { PopularEvent } from "./Sections/PopularEvent"; 
import { Combobox } from "./Combobox"; 

export function EventPopular() {
    const [selectedRegion, setSelectedRegion] = useState<string | null>(null);

    return (
        <div className="pt-10">
            <Combobox selectedRegion={selectedRegion} onRegionChange={setSelectedRegion} />
            <PopularEvent selectedRegion={selectedRegion} />
        </div>
    );
}
