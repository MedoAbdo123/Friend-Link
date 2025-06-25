"use client";
import { UserPlus, Users } from "lucide-react";
import React, { useState } from "react";
function RequestsClient({ data }: any) {
  const [active, setActive] = useState<"requests" | "friends">("requests");
  console.log(data);

  // useEffect(() => {
  //   async function getData() {
  //     const token =
  //       "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4NTYxZTdmMTA2ODk3M2JhNTAxZDMyYiIsIm5hbWUiOiJNZWRvIEFiZG8iLCJ1c2VybmFtZSI6IkBNZWRvQWJkbyIsImVtYWlsIjoiTWVkb0FiZG9AZ21haWwuY29tIiwiYXZhdGFyIjoiZGF0YTppbWFnZS9qcGVnO2Jhc2U2NCwvOWovNEFBUVNrWkpSZ0FCQVFBQUFRQUJBQUQvMndDRUFBa0dCeEVRRHc4UUVCQVFEZzhQRHcwUERRMFFEUThORHcwUEZoRVdGaFVSRXhNWUhTZ2dHQm9sR3hNVElURWhKU2szTGk0dUZ4OHpPRE1zTnlndExpc0JDZ29LRFEwTkRnME5EeXNaRlJrckt5c3JLeXNyS3lzckt5c3JLeXNyS3lzckt5c3JLeXNyS3lzckt5c3JLeXNyS3lzckt5c3JLeXNyS3lzckt5c3JLLy9BQUJFSUFPRUE0UU1CSWdBQ0VRRURFUUgveEFBYkFBRUFBZ01CQVFBQUFBQUFBQUFBQUFBQUF3UUJBZ1VHQi8vRUFEQVFBUUFDQUFNRkJnWUNBd0VBQUFBQUFBQUJBZ01FRVNFeFFWRnhCUkpoZ1pIQklqSlNvYkhSb3ZBVFF1RnkvOFFBRlFFQkFRQUFBQUFBQUFBQUFBQUFBQUFBQUFIL3hBQVVFUUVBQUFBQUFBQUFBQUFBQUFBQUFBQUEvOW9BREFNQkFBSVJBeEVBUHdEN2lBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFOWnhJNXRmOEFOSFA3U0NRUi93Q2FQN0VzeGlSekJ1TVJMSUFBQUFBQUFBQUFBQUFBQUFBQUFNV3RwdkJscGZFaVAwaHZpek83WkNNRXRzYWVpT1pZRUFBQUFHWWx2WEZtUEZHQXMxeFlud1NLVGVtSk1lTWNsRm9hMHRFN213QUFBQUFBQUFBQUFBQU1XblRhREY3YUsxclRPOHZiV1dxQUFBQUFBQUVBQUFBQU0xblRjczRkOWV2RlZack9tMEZ3YTB0ckRaUUFBQUFBQUFBQUFWc2ErczZjSVRZdHRJVlFBRUFBQnBqWTBValdmS09NbU5pUldzelBEaHpuazVPSmlUYWRaMy9nRTJMbkxUdStHUERmNm9KblhmdDY3V0JVSWxQaFp1OWVQZWpsTzM3b0FIV3dNeEY5MnllTUpYRnJhWW5XTmt4dWwxY3RqZCt1dkdOa3g0b3FVQUFBRytIZlNmRGl0S1N4Z1cyYWN2d29sQUFBQUFBQUFBa0ZmSHR0NkltWmxoQUFBQUJ6KzBjVFcwVjRSdG5yS29selUvSGIvd0JUSG9pVkFBQUFCWXlPSnBlSTRXMlQ3SzdOWjBtSjVURWc3UXl3aWdBRGZDdHBNZWpRQmRHS1RyRU1xQUFBQUFBRFhFblpMWkhqL0xQbCtRVmdFQUFBQUhKemRkTDI2Nit1MUV2ZG80ZTYzbFBzb3FnQUFBQTJ3NjYyaU9jeEgzYXJYWitGcmJ2Y0sva0hTWUJGQUFBQVdjQ2RpUkZsOTA5ZlpLb0FBQUFBQUk4ZjVaOHZ5a2FZc2JKQlZBUUFBQUFZdFdKaVluYkU3M0x6R0JOSjV4d2wxV0xWaVkwbU5ZbmdEaWk5aTVENlowOEovYUMyVXZIK3V2U1lsVVFDYU1yZjZmdkVKOExJZlZQbEg3QlZ3Y0tienBIblBDSFd3c09LeEVSdysvaXpTa1ZqU0kwaGxGQUFBQUFBV012dW5yN0pVZUJHeElvQUFBQUFBTVRESUNuTENUR3JwUFhhalFBQUFRNWpNeFRadm5sSHVDWW1YTHhNMWUzSFNPVWJFRXlvN1hlam5IcWQ2T2NlcmlnTzEzbzV4Nm5lam5IcTRvRHR4STRpWER6TjY3cDE4SjJ3RHJDdmw4M0Z0ay9EUDJub3NJQUFBTnNPdXN3Q3pTTkloc0NnQUFBQUFBQUNQR3JySFJXWFZYRnBwUGhPNEdnTVh0cEV6TzZJMVFRWnpNZDJOSSthZnRITnpKYlh2TnBtWjN5MVZBQUFBQUFBQUJmeVdaMStHMi8vQUZubjRLQkU2YnQvQUhiR21CaWQ2c1Q2OVc2S0xHQlhqelEwcnJPaTNFS0FBQUFBQUFBQUFEVzlkWTBiQUtkbzAyS3ZhRnRLYWM1aVBmMmRQRXByMTRTNVhha2FSV1BHUWM4QVFBQUFBQUFBQUFCZjdOdHN0SEtZbisraTdFT2YyWjgxdW51N0dGaDZkZndLemgwMGp4NHR3QUFBQUFBQUFBQUFBQVE1bkwxeEkwdDVUeGhNQTgvbXNuYkQzN2E4TFJ1OCtTdTlSTUtHWTdNcmJiWDRKNWI2K25BSEdGakd5V0pUZlhXT2RmaWhYRUFBQUFBVFlPVXZmZFdkT2M3SUJDbXkrV3RpVDhNYk9OcDNRNk9YN0xpTnQ1NzAvVEd5di9YUXJXSWpTSTBpTjBSc2dWQmxNcFhEalp0dE8rM1A5TEFBQUFBQUFBQUFBQUFBQUFBQUFBSThUQXJiNXF4UGpNUnI2cEFGTy9abUhQQ1k2V24zUnoyVFQ2cmZ4L1RvQU9kSFpOUHF0L0g5Sks5bVljZlZQVzM2WFFFV0hscVYzVmlQSFRXZlZLQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQVAvOWs9IiwiaWF0IjoxNzUwODI2NDA3fQ.QfQf5mn0UW38bsIzzmC1VO-PZrRgFBbnaXiLh_tJbJA";
  //     const res = await fetch("http://localhost:3000/friend", {
  //       method: "GET",
  //       cache: "no-store",
  //       headers: {
  //         Accept: "application/json",
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${token}`,
  //       },
  //     });
  //     const data = await res.json();
  //     console.log(data);
  //     return data;
  //   }
  //   getData()
  // }, []);

  return (
    <article className="flex items-center mt-5 flex-col w-full h-screen">
      <section className="w-[95%] sm:w-145 bg-gray-300 h-10 p-4 rounded flex justify-center items-center space-x-2 mt-5">
        <button
          onClick={() => setActive("requests")}
          className={`cursor-pointer transition-all duration-300 min-h-8 flex-grow rounded min-w-[51%] flex justify-center pl-3 space-x-2 text-xs sm:text-sm items-center
            ${
              active === "requests"
                ? "bg-white text-black"
                : "bg-whit text-gray-600"
            }`}
        >
          <UserPlus size={17.5} />
          <p>Friend Requests</p>
          <span
            className={`${
              active == "requests"
                ? "rounded-full text-black size-5 bg-gray-200 text-xs"
                : ""
            }`}
          >
            3
          </span>
        </button>
        <button
          onClick={() => setActive("friends")}
          className={`cursor-pointer transition-all duration-300 min-h-8 flex-grow rounded min-w-[51%] flex justify-center pl-3 space-x-2 text-xs sm:text-sm items-center
            ${
              active === "friends"
                ? "bg-white text-black"
                : "bg-whit text-gray-600"
            }`}
        >
          <Users size={17.5} />
          <p>Friend Requests</p>
        </button>
      </section>
      <br />
      {active == "requests" && (
        <div className="px-3 w-full flex mt-2 justify-center items-center">
          <section className="border-[1px] border-gray-900 shadow-gray-800 shadow flex flex-col w-full sm:w-145 p-3 mt-1 rounded">
            <header className="flex space-x-2 items-center">
              <UserPlus size={22} />
              <h1 className="text-2xl font-bold block">Friend Requests</h1>
            </header>

            <main className="mt-6 flex flex-col space-y-5">
              <div className="border-[1px] border-gray-900 shadow-gray-800 shadow space-x-3 p-3 rounded flex items-center w-full flex-wrap">
                <img
                  src="http://localhost:3000/uploads/ac586ff4-66cc-4d2f-9dd9-cd0233a57c85.jpg"
                  alt="Ahmad"
                  className="size-10 rounded-full"
                />
                <div className="flex flex-col">
                  <p>Ahmad Abdo</p>
                  <p className="text-xs text-start text-gray-600">@AhmadAbdo</p>
                </div>
                <div className="flex flex-grow items-center justify-end space-x-4">
                  <button className="bg-green-600 p-2 min-w-20 rounded transition-all duration-300 cursor-pointer hover:bg-green-700">
                    <span className="flex gap-1 items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 22 22"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="size-4 flex-shrink-0"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m4.5 12.75 6 6 9-13.5"
                        />
                      </svg>
                      <p className="leading-none">Accept</p>
                    </span>
                  </button>
                  <button className="sm:border-[1px] sm:border-gray-900 sm:bg-transparent bg-red-500 shadow-gray-800 p-2 min-w-20 rounded  transition-all duration-300 cursor-pointer hover:bg-red-500 hover:border-red-500">
                    <span className="flex gap-1 items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="size-4"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M6 18 18 6M6 6l12 12"
                        />
                      </svg>
                      <p className="leading-none">Decline</p>
                    </span>
                  </button>
                </div>
              </div>
            </main>
          </section>
        </div>
      )}
      {active == "friends" && (
        <div className="px-3 w-full flex mt-2 justify-center items-center">
          <section className="border-[1px] border-gray-900 shadow-gray-800 shadow flex flex-col w-full sm:w-145 p-3 mt-1 rounded">
            <header className="flex space-x-2 items-center">
              <Users size={22} />
              <h1 className="text-2xl font-bold block">Discover People</h1>
            </header>

            <form className="mt-5 w-full">
              <label className="relative flex justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-4 absolute left-2 top-2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                  />
                </svg>
                <input
                  type="text"
                  className="border w-full rounded border-gray-800 p-1 px-8"
                  placeholder="Search by name or username..."
                />
              </label>
            </form>

            <main className="mt-6 flex flex-col space-y-5">
              <div className="border-[1px] border-gray-900  hover:bg-gray-900 transition-all duration-300 shadow space-x-3 p-3 rounded flex items-center w-full flex-wrap">
                <img
                  src="http://localhost:3000/uploads/ac586ff4-66cc-4d2f-9dd9-cd0233a57c85.jpg"
                  alt="Ahmad"
                  className="size-10 rounded-full"
                />
                <div className="flex flex-col">
                  <p>Ahmad Abdo</p>
                  <p className="text-xs text-start text-gray-600">@AhmadAbdo</p>
                </div>
                <div className="flex flex-grow items-center justify-end space-x-4">
                  <button className="p-2 min-w-20 rounded transition-all duration-300 cursor-pointer border border-gray-800">
                    <span className="flex gap-1 items-center">
                      <UserPlus size={15} />
                      <p className="leading-none text-sm font-bold">
                        Add Friend
                      </p>
                    </span>
                  </button>
                </div>
              </div>
            </main>
          </section>
        </div>
      )}
    </article>
  );
}

export default RequestsClient;
