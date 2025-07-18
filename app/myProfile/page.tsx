import { jwtDecode } from "jwt-decode";
import { cookies } from "next/headers";
import React from "react";
import MyProfile from "./MyProfile";

async function Page() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token");
  const decode = token?.value
    ? (jwtDecode(token.value) as { username?: string })
    : null;

  if (!decode || !decode.username) {
    return <div>Invalid or missing token.</div>;
  }

  const res = await fetch(
    `https://friendlink-api.onrender.com/post/${decode.username}`,
    {
      method: "GET",
      headers: { Authorization: "Bearer " + token?.value },
    }
  );
  const data = await res.json();
  return <MyProfile data={data} />;
}

export default Page;
