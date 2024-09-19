import * as React from "react";
import Autoplay from "embla-carousel-autoplay";


import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";

export function CarouselSingular() {
    return (
        <Carousel
            className="w-max max-w-6xl"
            plugins={[
                Autoplay({
                    delay: 2000,
                }),
            ]}
        >
            <CarouselContent>
                {Array.from({ length: 5 }).map((_, index) => (
                    <CarouselItem key={index}>
                        <div>
                            <div className="flex items-center justify-center px-4 ">
                                <img
                                    className="rounded-lg shadow-lg shadow-secondarycolor"
                                    src="https://loket-production-sg.s3.ap-southeast-1.amazonaws.com/images/ss/1715920542_Om8rLV.png"
                                    alt=""
                                />
                            </div>
                        </div>
                    </CarouselItem>
                ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
        </Carousel>
    );
}
