import { use, useEffect, useState } from "react";
import { CardBody, CardContainer, CardItem } from "@/components/ui/3d-card";
import AnimatedDiv from "../simpleAnimate";
import { getSession } from "@/action";
import { Button } from "@/components/ui/button";
import jwt from "jsonwebtoken";
import axios from "axios";
import { GearIcon } from "@radix-ui/react-icons";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { z } from "zod";
import { useRouter } from "next/navigation";

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

const formSchema = z.object({
    username: z
        .string()
        .min(5, "Username must be between 5 and 20 characters")
        .max(20, "Username must be between 5 and 20 characters"),
    email: z.string().email("Invalid email address"),
    phone: z.string().regex(/^\d+$/, "Phone number must only contain numbers"),
    age: z.number().int(),
});

interface FormValues {
    username: string;
    email: string;
    phone: string;
    age: number;
}

export default function EditProfile() {
    const [user, setUser] = useState<User>();
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        console.log("Form submitted");
        e.preventDefault();

        const formData = new FormData(e.currentTarget);

        const newFormValues: FormValues = {
            username: formData.get("username") as string,
            email: formData.get("email") as string,
            phone: (formData.get("phone") as string).replace(/-/g, ""),
            age: parseInt(formData.get("age") as string),
        };

        try {
            formSchema.parse(newFormValues);

            axios.put(
                `http://localhost:5000/account/update/${user?.ID}`,
                newFormValues
            );
        } catch (error) {
            if (error instanceof z.ZodError) {
                const fieldErrors: Record<string, string> = {};
                error.errors.forEach((err) => {
                    if (err.path) {
                        fieldErrors[err.path[0]] = err.message;
                    }
                });
                setError(error.errors[0].message);
            } else {
                console.error("Form validation error:", error);
            }
        }
    };

    useEffect(() => {
        console.log(error);
    }, []);
    const EditTab = () => {
        return (
            <DialogContent className="sm:max-w-[425px] border-secondarycolor text-white">
                <DialogHeader>
                    <DialogTitle>Edit profile</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4  ">
                    <form
                        className="grid grid-cols-4 items-center gap-4"
                        onSubmit={handleSubmit}
                    >
                        <Label htmlFor="name" className="text-right">
                            Username
                        </Label>
                        <Input
                            id="username"
                            name="username"
                            defaultValue={user?.username}
                            className="col-span-3"
                        />
                        <Label htmlFor="name" className="text-right">
                            Email
                        </Label>
                        <Input
                            id="email"
                            name="email"
                            defaultValue={user?.email}
                            className="col-span-3"
                        />
                        <Label htmlFor="name" className="text-right">
                            Phone
                        </Label>
                        <Input
                            id="phone"
                            name="phone"
                            defaultValue={user?.phone}
                            className="col-span-3"
                        />
                        <Label htmlFor="name" className="text-right">
                            Age
                        </Label>
                        <Input
                            id="age"
                            name="age"
                            defaultValue={user?.age}
                            className="col-span-3"
                        />

                       
                        <div className="col-span-4 justify-end flex">
                            <Button type="submit">Save changes</Button>
                        </div>
                    </form>
                </div>
            </DialogContent>
        );
    };

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
                // console.log(user);

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
        <AnimatedDiv direction="top" duration={0.8}>
            <CardContainer className="inter-var ">
                <CardBody className="flex-col w-full items-start bg-gradient-to-br from-orange-500 to-secondarycolor relative group/card  dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1]  h-auto rounded-xl p-6 border  ">
                    <div className="flex-grow grid grid-cols-2 gap-4 text-white font-bold text-xl ">
                        <CardItem
                            className="col-span-2 mx-auto"
                            translateZ={50}
                        >
                            <div className="flex justify-center items-center">
                                <img
                                    src={user?.avatar ?? ""}
                                    alt="avatar"
                                    width={250}
                                    className="rounded-full border-4  "
                                />
                            </div>
                        </CardItem>
                        <CardItem translateZ={20} className="p-2">
                            <h1 className="">Username</h1>
                        </CardItem>
                        <CardItem
                            translateZ={20}
                            className="flex justify-end items-end border-2 rounded-xl p-2 w-auto hover:border-none hover:bg-white hover:text-secondarycolor transition-all"
                        >
                            <h1 className="flex font-medium">
                                {user?.username}
                            </h1>
                        </CardItem>
                        <CardItem translateZ={20} className="p-2">
                            <h1>Email</h1>
                        </CardItem>
                        <CardItem
                            translateZ={20}
                            className="flex justify-end items-end border-2 rounded-xl p-2 w-auto hover:border-none hover:bg-white hover:text-secondarycolor transition-all"
                        >
                            <h1 className="font-medium">{user?.email}</h1>
                        </CardItem>
                        <CardItem translateZ={20} className="p-2">
                            <h1>Phone</h1>
                        </CardItem>
                        <CardItem
                            translateZ={20}
                            className="flex justify-end items-end border-2 rounded-xl p-2 w-auto hover:border-none hover:bg-white hover:text-secondarycolor transition-all"
                        >
                            <h1 className="font-medium">{user?.phone}</h1>
                        </CardItem>
                        <CardItem translateZ={20} className="p-2">
                            <h1>Age</h1>
                        </CardItem>
                        <CardItem
                            translateZ={20}
                            className="flex justify-end items-end border-2 rounded-xl p-2 w-auto hover:border-none hover:bg-white hover:text-secondarycolor transition-all"
                        >
                            <h1 className="font-medium ">{user?.age}</h1>
                        </CardItem>
                    </div>
                    <CardItem
                        translateZ={20}
                        className=" w-auto justify-end flex py-4 "
                    >
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="group bg-no border-2 hover:border-none hover:bg-white hover:text-secondarycolor transition-all"
                                >
                                    <GearIcon className="h-7 w-7 text-white group-hover:text-secondarycolor transition-all" />
                                </Button>
                            </DialogTrigger>
                            <EditTab />
                        </Dialog>
                    </CardItem>
                </CardBody>
            </CardContainer>
        </AnimatedDiv>
    );
}
