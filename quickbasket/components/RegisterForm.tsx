"use client";

import React, { FormEvent, useState } from "react";
import {
  ArrowLeft,
  Mail,
  Lock,
  User,
  EyeOff,
  EyeIcon,
  Loader2,
} from "lucide-react";
import { motion } from "motion/react";
import axios from "axios"
import { signIn, useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";

type RegisterFormProps = {
  prevStep?: (s: number) => void;
  initialIsLogin?: boolean;
};

const RegisterForm = ({ prevStep = (s: number) => {}, initialIsLogin = true }: RegisterFormProps) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(initialIsLogin);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const session = useSession();
  const router = useRouter();
  const pathname = usePathname();

  const handleToggleSignIn = () => {
    if (pathname && pathname.startsWith("/register")) {
      router.push("/login");
      return;
    }
    setIsLogin(true);
  };

  const handleToggleSignUp = () => {
    if (pathname && pathname.startsWith("/login")) {
      router.push("/register");
      return;
    }
    setIsLogin(false);
  };
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try{
      const result = await axios.post("/api/auth/register",{
        name,email,password
      })
      router.push("/login");
      console.log(result.data);

    }catch (err: any) {
  console.log("Error:", err.response?.data);
  console.log("Status:", err.response?.status);
} finally {
  setLoading(false);
}
  }

const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);
  try {
    const res: any = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (!res) {
      // signIn may throw; handle as failure
      console.error("Sign-in returned no response");
      return;
    }

    if (res.error) {
      console.error("Sign-in error:", res.error);
      // optionally show UI feedback here
    } else {
      // successful sign-in
      router.push("/");
    }

    console.log(session.data);
  } catch (err: any) {
    console.error("Sign-in exception:", err);
  } finally {
    setLoading(false);
  }
};

  return (
    <>
     <div className="absolute left-6 top-2">
       <button onClick={()=>prevStep(1)} className="flex items-center gap-2 text-gray-600 mb-6 hover:text-black transition pt-5">
          <ArrowLeft size={18} />
          Back to home
        </button>
    </div>
    <div className="min-h-screen flex items-center justify-center p-10">
      <div className="w-120 max-w-xl">

        {/* Back */}
       

        {/* Card */}
        <div className="bg-white rounded-[36px] p-8 shadow-sm border border-gray-100">

          {/* Logo */}
          <div className="flex items-center gap-3 mb-8">
            <img
              src="/favicon.ico"
              alt="QuickBasket"
              className="w-8 h-6"
            />

            <h1 className="text-xl font-extrabold text-[#102417]">
              QuickBasket
            </h1>
          </div>

          {/* Heading */}
          <motion.h2 initial={{opacity:0,y:-10}} animate={{opacity:1,y:0}} transition={{duration:0.6}} className="text-3xl font-extrabold text-[#102417] mb-3">
           {isLogin ? "Welcome back!" : "Create account"}
          </motion.h2>

          <p className="text-gray-500 text-sm mb-8">
            {isLogin ? "Sign in to continue shopping fresh." : "Get groceries delivered in 30 minutes."}
          </p>

          {/* Toggle */}
          <div className="bg-[#ECE8DB] rounded-full p-1 flex mb-5">
            <button
              onClick={handleToggleSignIn}
              className={`flex-1 py-1 rounded-full text-md font-semibold transition ${
                isLogin
                  ? "bg-white shadow-sm"
                  : "text-gray-600"
              }`}
            >
              Sign in
            </button>

            <button
              onClick={handleToggleSignUp}
              className={`flex-1 py-1  text-md  rounded-full font-semibold transition ${
                !isLogin
                  ? "bg-white shadow-sm"
                  : "text-gray-600"
              }`}
            >
              Sign up
            </button>
          </div>

          {/* Form */}
          <div className="space-y-5">

            {!isLogin && (
              <div className="relative">
                <User
                  size={18}
                  className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-500"
                />

                <input
                  type="text"
                  placeholder="Full Name"
                  className="w-full h-10 focus:ring-1 focus:ring-green-400/30 text-sm pl-14 rounded-full border border-gray-200 bg-[#FAF8F3] outline-none"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            )}

            <div className="relative">
              <Mail
                size={18}
                className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-500"
              />

              <input
                type="email"
                placeholder="Email address"
                className="w-full h-10 text-sm  focus:ring-1 focus:ring-green-400/30 pl-14 rounded-full border border-gray-200 bg-[#FAF8F3] outline-none"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="relative">
              <Lock
                size={18}
                className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-500"
              />

              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="w-full  h-10  focus:ring-1 focus:ring-green-400/30 text-sm pl-14 rounded-full border border-gray-200 bg-[#FAF8F3] outline-none"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {showPassword ? <EyeIcon size={18} className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer" onClick={()=>setShowPassword(false)}/> : <EyeOff size={18} className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer" onClick={()=>setShowPassword(true)}/>}
            </div>

           

            {/* Main Button */}
           {
 
  (() => {
    const formValidation = isLogin
      ? email !== "" && password !== ""
      : name !== "" && email !== "" && password !== "";

    return (
      <button
        onClick={isLogin ? handleLogin : handleRegister}
        disabled={!formValidation || loading}
        className={`w-full h-12 rounded-full font-bold text-md transition-all duration-200 flex items-center justify-center gap-2
          ${
            formValidation
              ? "bg-gradient-to-r from-green-700 to-lime-500 text-white hover:scale-[1.02]"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
      >
        {loading ? (
          <>
            <Loader2 className="animate-spin" size={18} />
            {isLogin ? "Signing in..." : "Creating Account..."}
          </>
        ) : (
          isLogin ? "Sign in" : "Create Account"
        )}
      </button>
    );
  })()

}

            {/* Divider */}
            <div className="flex items-center gap-4 py-2">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="text-gray-400 text-xs">OR</span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>

            {/* Google Button */}
            <button onClick={()=>signIn("google",{callbackUrl:"/"})} className="w-full h-10 border border-gray-200 rounded-xl flex items-center justify-center gap-3 hover:bg-gray-50 transition">
              <img
                src="https://www.google.com/favicon.ico"
                alt="Google"
                className="w-5 h-5"
              />

              <span className="text-sm">
                Continue with Google
              </span>
            </button>

            {/* Terms */}
            <p className="text-center text-gray-500 text-xs pt-2">
              By continuing you agree to our Terms &
              Privacy Policy.
            </p>

          </div>
        </div>
      </div>
    </div>
    </>
   
   
  );
};


export default RegisterForm;