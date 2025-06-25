import React from "react";
import RequestsClient from "./RequestsClient";
import { cookies } from "next/headers";

async function requestPage() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      throw new Error("No token found");
    }

    const res = await fetch("http://localhost:3000/friend", {
      method: "GET",
      cache: "no-store",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    return <RequestsClient data={data} />;
  } catch (error) {
    console.error(error);
    return <RequestsClient data={{ error: String(error) }} />;
  }
}

export default requestPage;
