"use client";
import { Lock, Mail } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import { ClipLoader } from "react-spinners";
import Toast from "../components/toast/Toast";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

function Login() {
  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const router = useRouter();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    fetch("https://friendlink-api.onrender.comi.onrender.com/user/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        email: emailOrUsername,
        username: "@" + emailOrUsername,
        password: password,
      }),
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          return res.json().then((errData) => {
            throw errData;
          });
        }
      })
      .then((data) => {
        setToastMessage(data.data.message);
        setShowToast(true);
        setIsSuccess(true);
        localStorage.setItem("token", data.data.token);
        document.cookie = `token=${data.data.token}; path=/; max-age=${
          7 * 24 * 60 * 60
        };`;
        setTimeout(() => {
          router.push("/");
        }, 1000);
      })
      .catch((err) => {
        setToastMessage(err.message);
        setIsSuccess(false);
        setShowToast(true);
      })
      .finally(() => {
        setLoading(false);
        setTimeout(() => {
          setShowToast(false);
        }, 3000);
      });
  }
  return (
    <React.Fragment>
      <article className="py-10 px-3">
        <div className="flex justify-center items-center h-screen">
          <section
            className="w-112 bg-[var(--bg-auth)] min-h-120 rounded-lg border-1 border-[rgba(255,255,255,0.1019)]"
            style={{ boxShadow: "0px 0px 11px var(--shadow-auth)" }}
          >
            <header className="flex justify-center items-center flex-col">
              <div className="size-16 rounded-full text-center flex items-center justify-center bg-gradient-to-b from-indigo-700 to-cyan-700 mt-6">
                <h1 className="text-3xl text-white font-black">FL</h1>
              </div>
              <br />
              <h1 className="text-2xl font-black text-[#0d00ff]">
                Join Friendlink
              </h1>
              <p className="text-gray-400">Log in to FriendLink</p>
            </header>
            <form className="w-full p-7 space-y-2" onSubmit={handleSubmit}>
              <h1 className="font-black">Email or Username</h1>
              <label className="realative flex items-center pb-5">
                <Mail className="absolute ml-2 size-4" />
                <input
                  type="text"
                  className="border-1 border-gray-600 bg-[rgba(255,255,255,0.09)] w-[100%] rounded py-1.5 pl-8"
                  placeholder="Enter your email or username"
                  value={emailOrUsername}
                  onChange={(e) => setEmailOrUsername(e.target.value)}
                  required
                />
              </label>
              <h1 className="font-black">Password</h1>
              <label className="realative flex flex-col pb-5">
                <Lock className="absolute ml-2 mt-3 size-4" />
                <input
                  type="password"
                  className="border-1 border-gray-600 bg-[rgba(255,255,255,0.09)] w-[100%] rounded py-1.5 pl-8"
                  placeholder="Create a strong password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <p className="text-start w-full mt-3 text-sm text-gray-400">
                  Must contain at least 8 characters
                </p>
              </label>
              <div className="flex w-full justify-center flex-col text-center">
                <button type="submit">
                  {loading ? (
                    <div className="bg-[#4353b3] m-3 w-[88%] p-2 space-x-3 flex justify-center items-center gap-3 rounded-lg text-white cursor-pointer">
                      <ClipLoader
                        color="#ffffff"
                        loading={true}
                        size={15}
                        aria-label="Loading Spinner"
                        data-testid="loader"
                      />
                      Login
                    </div>
                  ) : (
                    <div className="bg-[#5267E1] m-3 w-[88%] p-2 space-x-3 flex justify-center items-center gap-3 rounded-lg text-white cursor-pointer hover:bg-[#4353b3] transition-all duration-300">
                      Login
                    </div>
                  )}
                </button>

                <p className="pb-4 text-sm">
                  Don’t have an account?
                  <Link href={"/register"} className="text-sky-700 pl-1">
                    Don’t have an account?
                  </Link>
                </p>
              </div>
            </form>
          </section>
        </div>
      </article>

      <div className="fixed bottom-4 right-4">
        <AnimatePresence>
          {showToast && (
            <motion.div
              initial={{ x: 300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 300, opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              {isSuccess ? (
                <Toast
                  bg="#2ED13E"
                  text="#ffffff"
                  message={toastMessage}
                  correct={true}
                  onClose={() => setShowToast(false)}
                />
              ) : (
                <Toast
                  bg="#BF0D22"
                  text="#ffffff"
                  message={toastMessage}
                  error={true}
                  onClose={() => setShowToast(false)}
                />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </React.Fragment>
  );
}

export default Login;
//2ED13E
//BF0D22
