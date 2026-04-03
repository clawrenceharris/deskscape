"use client"
import {
  Brain,
  CheckCircle,
  MessageSquare,
  Sparkles,
  Users,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui";

export default function LandingPage() {
  const router = useRouter();
  
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-gradient-to-br from-cyan-300/50 to-purple-400/30">
      
      <div>
        <div className="sticky top-20 bg-primary z-10 h-screen px-4 py-8 md:px-20 md:py-12">
        <div className="sticky rounded-2xl top-8 z-20 flex items-center justify-between gap-3 p-4 bg-white/30 backdrop-blur-sm w-full max-w-[60%] mx-auto">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src={"/logo.png"}
            width={90}
            height={90}
            priority
            alt="Chatterbrain Logo"
            className="h-auto w-12"
          />
        </Link>
        <div className="flex gap-2 items-center">
          <Button variant="outline" onClick={() => router.push("/auth/login")}>
            Log In
          </Button>
          <Button onClick={() => router.push("/auth/sign-up")} className="btn btn-special">
            Get Started
          </Button>
        </div>
      </div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8">
            <div>
             
              <h1 className="mt-6 text-3xl font-semibold lowercase sm:text-4xl">
                <strong>Your Virtual Desk </strong> right at your fingertips,
               
              </h1>
            </div>
            

           
          </div>
        </div>

        
      </div>
      <footer className="relative bg-black/10 z-10 mx-auto my-5 mt-6 max-w-5xl rounded-3xl px-4 py-8 text-white shadow-md backdrop-blur-xl">
        <div className="mx-auto flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-2">
            <Link href={"/"}>
              <Image
                src={"/logo.png"}
                width={90}
                height={90}
                priority
                alt="Chatterbrain Logo"
                className="h-auto w-16"
              />
            </Link>

           
          </div>

          <div className="text-sm text-white/70">
            © {new Date().getFullYear()} Chatterbrain. All rights reserved.
          </div>
        </div>
      </footer>
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute bottom-24 right-[-200px] h-[600px] w-[600px] rounded-full bg-[#30ffbd] blur-[100px] animate-pulse" />
        <div className="absolute right-[10%] top-1/3 z-[2] h-[400px] w-[400px] rounded-full bg-[rgba(141,84,226,0.5)] blur-[100px] animate-pulse" />
        <div className="absolute right-0 top-0 z-[2] h-[500px] w-[400px] rounded-full bg-[#8d54e2] blur-[100px] animate-pulse" />
        <div className="absolute bottom-0 left-0 z-[1] h-[1000px] w-[1000px] rounded-full bg-[rgba(84,203,226,0.65)] blur-[100px] animate-pulse" />

      </div>
    </div>
  );
};

