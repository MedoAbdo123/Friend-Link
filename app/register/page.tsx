"use client";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Mail, Upload, User, UserCheck } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { ClipLoader } from "react-spinners";
import Toast from "../components/toast/Toast";
import { useRouter } from "next/navigation";

function Register() {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [avatar, setAvatar] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const router = useRouter();

  const formData = new FormData();
  formData.append("name", name);
  formData.append("username", username);
  formData.append("email", email);
  formData.append("password", password);
  if (avatar) {
    formData.append("avatar", avatar);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    fetch("http://localhost:3000/user/register", {
      method: "POST",
      body: formData,
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          throw new Error("Registration failed");
        }
      })
      .then((data) => {
        setToastMessage(data.data.message);
        setShowToast(true);
        setIsSuccess(true);
        localStorage.setItem("token", data.token);
        document.cookie = `token=${data.token}; path=/; max-age=${7 * 24 * 60 * 60};`;
        setTimeout(() => {
          router.push("/");
        }, 1000);
      })
      .catch((err) => {
        setIsSuccess(false);
        setToastMessage(err.message);
        setShowToast(true);
      })
      .finally(() => {
        setLoading(false);
        setTimeout(() => {
          setShowToast(false);
        }, 3000);
      });
  }

  useEffect(() => {
    if (avatar) {
      const previewUrl = URL.createObjectURL(avatar);
      setAvatarPreview(previewUrl);

      return () => URL.revokeObjectURL(previewUrl);
    } else {
      setAvatarPreview("");
    }
  }, [avatar]);
  return (
    <React.Fragment>
      <article className="py-32 px-3">
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
              <p className="text-gray-400">Create your FriendLink account</p>
            </header>
            <section className="p-6 flex items-center gap-4">
              {avatarPreview ? (
                <img src={avatarPreview} className="size-15 rounded-full" />
              ) : (
                <div className="size-15 flex justify-center items-center rounded-full bg-gray-700 text-white">
                  <User />
                </div>
              )}
              <label className="flex gap-2 items-center text-[#0d00ff] text-sm cursor-pointer">
                <input
                  type="file"
                  hidden
                  onChange={(e) => setAvatar(e.target.files?.[0] || null)}
                />
                <Upload className="size-4" />
                <div className="flex flex-col">
                  <p className="font-bold mt-4">Upload Photo</p>
                  <p className="text-gray-400 text-xs">PNG/JPG/JPEG</p>
                </div>
              </label>
            </section>
            <form className="w-full px-7 space-y-2" onSubmit={handleSubmit}>
              <h1 className="font-black">Full Name</h1>
              <label className="realative flex items-center pb-5">
                <User className="absolute ml-2 size-4" />
                <input
                  required
                  type="text"
                  className="border-1 border-gray-600 bg-[rgba(255,255,255,0.09)] w-[100%] rounded py-1.5 pl-8"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </label>
              <h1 className="font-black">Username</h1>
              <label className="realative flex items-center pb-5">
                <UserCheck className="absolute ml-2 size-4" />
                <input
                  type="text"
                  className="border-1 border-gray-600 bg-[rgba(255,255,255,0.09)] w-[100%] rounded py-1.5 pl-8"
                  placeholder="Username must be unique"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </label>
              <h1 className="font-black">Email</h1>
              <label className="realative flex items-center pb-5">
                <Mail className="absolute ml-2 size-4" />
                <input
                  type="email"
                  className="border-1 border-gray-600 bg-[rgba(255,255,255,0.09)] w-[100%] rounded py-1.5 pl-8"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
                      Register
                    </div>
                  ) : (
                    <div className="bg-[#5267E1] m-3 w-[88%] p-2 space-x-3 flex justify-center items-center gap-3 rounded-lg text-white cursor-pointer hover:bg-[#4353b3] transition-all duration-300">
                      Register
                    </div>
                  )}
                </button>

                <p className="pb-4 text-sm">
                  Already have an account?
                  <Link href={"/login"} className="text-sky-700 pl-1">
                    Login in here
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

export default Register;
//2ED13E
//BF0D22
