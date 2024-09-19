"use server";

import { sessionOptions, SessionData, defaultSession } from "@/lib";
import { getIronSession } from "iron-session";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import jwt from "jsonwebtoken";
import axios from "axios";

export const getSession = async () => {
  const session = await getIronSession<SessionData>(cookies(), sessionOptions);
  if (!session.isLoggedIn) {
    session.isLoggedIn = defaultSession.isLoggedIn;
  }
  if (session.isLoggedIn && session.expdate) {
    const expirationDate = new Date(session.expdate);
    if (expirationDate < new Date()) {
      // Session has expired, destroy it
      await session.destroy();
      redirect("/pages/login");
    }
  }
  return session;
};

// export const login = async (
//   prevState: { error: undefined | string },
//   formData: FormData
// ) => {
//   const formEmail = formData.get("email") as string;
//   const formPassword = formData.get("password") as string;
//   if (!formEmail || !formPassword) {
//     return { error: "Email and password are required" };
//   }

//   const response = await axios.post("http://localhost:5000/account/login", {
//     email: formEmail,
//     password: formPassword,
//   });
//   if (response.status !== 200) {
//     return { error: "Invalid email or password" };
//   }
//   const userData = response.data.LoginInfo;
//   if (!userData || userData.email !== formEmail) {
//     return { error: "Invalid email or password" };
//   }
//   const decoded = jwt.decode(userData.token) as { exp: number };
//   const expdate = new Date(decoded.exp * 1000);

//   const session = await getSession();
//   session.userId = userData.ID;
//   session.email = userData.email;
//   session.password = userData.token;
//   session.username = userData.username;
//   session.avatar = userData.avatar;
//   session.isLoggedIn = true;
//   session.expdate = expdate;

//   await session.save();

//   redirect("/");
// };
export const login = async (
  prevState: { error: undefined | string },
  formData: FormData
) => {
  const formEmail = formData.get("email") as string;
  const formPassword = formData.get("password") as string;
  if (!formEmail || !formPassword) {
    return { error: "Email and password are required" };
  }

  try {
    const response = await axios.post("http://localhost:5000/account/login", {
      email: formEmail,
      password: formPassword,
    });

    if (response.status !== 200) {
      return { error: "Invalid email or password" };
    }

    const userData = response.data.LoginInfo;
    if (!userData || userData.email !== formEmail) {
      return { error: "Invalid email or password" };
    }

    const decoded = jwt.decode(userData.token) as { exp: number };
    const expdate = new Date(decoded.exp * 1000);

    const session = await getSession();
    session.userId = userData.ID;
    session.email = userData.email;
    session.password = userData.token;
    session.username = userData.username;
    session.avatar = userData.avatar;
    session.isLoggedIn = true;
    session.expdate = expdate;

    await session.save();

    redirect("/");
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return { error: error.response?.data?.message || "Login failed. Please try again." };
    } else {
      return { error: "An unexpected error occurred. Please try again." };
    }
  }
};

export const logout = async () => {
  const session = await getSession();
  session.destroy();

  redirect("/");
};
