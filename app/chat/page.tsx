import React from 'react'
import Chat from './Chat'
import { cookies } from 'next/headers'

async function page() {
  const cookeisStorage = await cookies()
  const token = cookeisStorage.get("token")?.value
  
  const resFreinds = await fetch("http://localhost:3000/friend/myFriends", {
    method: "GET",
    cache: "no-store",
    headers: {
      Authorization: "Bearer " + token
    }
  })
  const firendsData = await resFreinds.json()
  return <Chat firendsData={firendsData}/>
}

export default page