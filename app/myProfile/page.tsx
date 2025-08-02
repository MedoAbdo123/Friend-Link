import { jwtDecode } from "jwt-decode";
import { cookies } from "next/headers";
import React from "react";
import MyProfile from "./MyProfile";
import { MyPayload } from "../exports/exports";

async function Page() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const decode = token ? jwtDecode<MyPayload>(token) : null;

  if (!decode || !decode.username) {
    console.error("Invalid token or username not found");
    return <div>Error: Invalid token or username not found.</div>;
  }

  const res = await fetch(
    `https://friendlink-api.onrender.com/post/${decode?.username}`,
    {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  let data = null;
  const text = await res.text();
  if (res.ok) {
    if (text) {
      try {
        data = JSON.parse(text);
      } catch (e) {
        console.log("Failed to parse JSON:", e);
        data = { error: "Invalid JSON response from server" };
      }
    } else {
      console.log("Empty response body from server");
      data = { error: "Empty response body from server" };
    }
  } else {
    console.log("Failed to fetch profile data:", res.status, res.statusText);
    data = { error: "Failed to fetch profile data" };
  }

  return <MyProfile data={data} />;
}

export default Page;
