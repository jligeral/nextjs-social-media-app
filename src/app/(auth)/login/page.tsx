import { Metadata } from "next";
import loginImage from "@/assets/login-image.jpg";
import Image from "next/image";
import Link from "next/link";
import LoginForm from "@/app/(auth)/login/LoginForm";
import GoogleSignInButton from "@/app/(auth)/login/google/GoogleSignInButton";

export const metadata: Metadata = {
  title: "Login"
};

export default function Page() {
  return (
    <main className="flex h-screen items-center justify-center p-5">
      <div className="flex h-full max-h-[40rem] w-full max-w-[64rem] rounded-2xl overflow-hidden bg-card shadow-2xl">
        <div className="md:w-1/2 w-full space-y-10 overflow-y-auto p-10">
          <h1 className="text-center text-3xl font-bold">Login to gotcha</h1>
          <div className="space-y-5">
            <GoogleSignInButton/>
            <div className={`flex items-center gap-3`}>
              <div className={`h-px flex-1 bg-muted`} />
              <span>OR</span>
              <div className={`h-px flex-1 bg-muted`} />
            </div>
            <LoginForm/>
            <Link href="/signup" className="block text-center hover:underline">
              Don&apos;t have an account? Sign Up
            </Link>
          </div>
        </div>
        <Image
          src={loginImage}
          alt=""
          className="w-1/2 hidden md:block object-cover"
        />
      </div>
    </main>
  );
}
