"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "react-feather";
import { Separator } from "@/components/ui/separator";
import { getSession } from "@/action";
import { useEffect, useState } from "react";
import { IconArmchair } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { logout } from "@/action";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import AnimatedDiv from "../simpleAnimate";
import { motion } from 'framer-motion';

const Navbar: React.FC = () => {
    const router = useRouter();
    const [username, setUsername] = useState<string | undefined>();
    const [profileUrl, setProfileUrl] = useState<string | undefined>();
    const [query, setQuery] = useState<string>("");

    useEffect(() => {
        const fetchSessionData = async () => {
            try {
                const session = await getSession();
                setUsername(session.username);
                setProfileUrl(session.avatar);
            } catch (error) {
                console.error("Error fetching session data:", error);
            }
        };

        fetchSessionData();
    }, []);

    const handleLogin = () => {
        router.push(`/pages/login`);
    };

    const handleProfile = () => {
        router.push(`/pages/profile`);
    };

    const handleHome = () => {
        router.push(`/`);
    };

    const handleLogout = async () => {
        try {
            await logout();
            router.push(`/`);
        } catch (error) {
            console.error("Error logging out:", error);
        }
    };

    const handleSearch = () => {
        router.push(`/pages/results?query=${query}`);
    };
    const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter") {
            handleSearch();
        }
    };
    const [isAnimating, setIsAnimating] = useState(false);


    return (
        <div className="flex-col justify-center items-center">
            <nav className="flex items-center justify-between px-10 py-5  ">
                
                <div
                    className="flex items-center cursor-pointer"
                    onClick={handleHome}
                >
                    <IconArmchair size={32} className="text-secondarycolor" />
                    <h1 className="bg-gradient-to-r from-secondarycolor  to-orange-500 inline-block text-transparent bg-clip-text text-3xl font-semibold">
                        FrontRow
                    </h1>
                </div>
                <AnimatedDiv direction="top">
                    <div className="flex w-full max-w-sm items-center space-x-2">
                        <Input
                            className="max-w-xl text-white border-secondarycolor border-2 bg-transparent"
                            placeholder="Search Events..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onKeyPress={handleKeyPress}
                        />
                        <Button
                            type="submit"
                            variant="outline"
                            size="icon"
                            onClick={handleSearch}
                            className="text-secondarycolor border-secondarycolor border-2"
                        >
                            <Search className=" size-4"></Search>
                        </Button>
                    </div>
                </AnimatedDiv>

                <div className="flex items-center content-between">
                    {username ? (
                        <div>
                            <DropdownMenu>
                                <DropdownMenuTrigger className="flex ">
                                    <button className="px-6 py-2 text-white rounded-lg font-bold transform hover:-translate-y-1 transition duration-400 border-none">
                                        {username}
                                    </button>
                                    <Avatar>
                                        <AvatarImage
                                            src={profileUrl}
                                            alt="@shadcn"
                                        />
                                        <AvatarFallback>CN</AvatarFallback>
                                    </Avatar>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="bg-primarycolor text-white border-secondarycolor border-2">
                                    <DropdownMenuLabel>
                                        My Account
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator className="bg-secondarycolor" />
                                    <DropdownMenuItem onClick={handleProfile}>
                                        Profile
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={handleLogout}>
                                        Logout
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    ) : (
                        <Button
                            className="text-secondarycolor border-secondarycolor border-2"
                            variant={"ghost"}
                            onClick={handleLogin}
                        >
                            Login
                        </Button>
                    )}
                </div>
            </nav>
            <motion.div
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{
                    delay: 0.5,
                    duration: 1,
                    ease: "easeInOut",
                }}
            >
                <div className="bg-gradient-to-r from-transparent via-secondarycolor dark:via-primarycolor to-transparent  h-[1px] w-full" />
            </motion.div>
        </div>
    );
};

export default Navbar;
