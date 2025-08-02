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

    const resUsers = await fetch("http://localhost:3000/user", {
      method: "GET",
      cache: "no-store",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const RequestsPending = await fetch(
      "http://localhost:3000/friend/pending",
      {
        method: "GET",
        cache: "no-store",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const users = await resUsers.json();

    const data = await res.json();
    const requestsPending = await RequestsPending.json();

    return (
      <RequestsClient data={data} users={users} pending={requestsPending} />
    );
  } catch (error) {
    console.error(error);
  }
}

export default requestPage;
