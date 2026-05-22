"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { signIn, signUp } from "@/lib/auth-client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  HiOutlineEnvelope,
  HiOutlineLockClosed,
  HiOutlineUser,
  HiOutlineAcademicCap,
  HiOutlineArrowRight,
} from "react-icons/hi2";

type AuthMode = "sign-in" | "sign-up";

interface AuthFormsProps {
  mode: AuthMode;
}

export default function AuthForms({ mode }: AuthFormsProps) {
  const isSignUp = mode === "sign-up";
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"STUDENT" | "TEACHER">("STUDENT");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignUp) {
        if (!name || !email || !password) {
          toast.error("Please fill in all fields");
          setLoading(false);
          return;
        }

        const { error } = await signUp.email(
          {
            name,
            email,
            password,
          },
          {
            body: {
              role,
            },
          },
        );

        if (error) {
          toast.error(error.message || "Something went wrong");
        } else {
          toast.success("Account created!");
          router.push("/dashboard");
        }
      } else {
        if (!email || !password) {
          toast.error("Please fill in all fields");
          setLoading(false);
          return;
        }

        const { error } = await signIn.email({
          email,
          password,
        });

        if (error) {
          toast.error(error.message || "Invalid credentials");
        } else {
          toast.success("Welcome back!");
          router.push("/dashboard");
        }
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const clearForm = () => {
    setName("");
    setEmail("");
    setPassword("");
    setRole("STUDENT");
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <Card className="w-full max-w-md border-white/10 bg-[#2a2826]/90 shadow-2xl backdrop-blur-md">
        <CardHeader className="space-y-1 text-center">
          <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-amber-500/15">
            <HiOutlineAcademicCap className="h-6 w-6 text-amber-400" />
          </div>
          <CardTitle className="font-mono text-2xl font-bold tracking-tight text-white">
            {isSignUp ? "Create an account" : "Welcome back"}
          </CardTitle>
          <p className="font-mono text-sm text-white/50">
            {isSignUp
              ? "Sign up to start asking doubts"
              : "Sign in to continue learning"}
          </p>
        </CardHeader>

        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Name - sign-up only */}
            {isSignUp && (
              <div className="space-y-2">
                <Label
                  htmlFor="name"
                  className="font-mono text-sm text-white/70"
                >
                  Name
                </Label>
                <div className="relative">
                  <HiOutlineUser className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="font-mono border-white/10 bg-white/5 pl-10 text-white placeholder:text-white/25 focus-visible:border-amber-500/50 focus-visible:ring-amber-500/20 py-5"
                  />
                </div>
              </div>
            )}

            {/* Email */}
            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="font-mono text-sm text-white/70"
              >
                Email
              </Label>
              <div className="relative">
                <HiOutlineEnvelope className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="font-mono border-white/10 bg-white/5 pl-10 text-white placeholder:text-white/25 focus-visible:border-amber-500/50 focus-visible:ring-amber-500/20 py-5"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label
                htmlFor="password"
                className="font-mono text-sm text-white/70"
              >
                Password
              </Label>
              <div className="relative">
                <HiOutlineLockClosed className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="font-mono border-white/10 bg-white/5 pl-10 text-white placeholder:text-white/25 focus-visible:border-amber-500/50 focus-visible:ring-amber-500/20 py-5"
                />
              </div>
            </div>

            {/* Role - sign-up only */}
            {isSignUp && (
              <div className="space-y-2">
                <Label className="font-mono text-sm text-white/70">
                  I am a
                </Label>
                <div className="flex gap-3">
                  <label
                    className={`flex-1 cursor-pointer rounded-lg border px-4 py-3 text-center font-mono text-sm transition-all ${
                      role === "STUDENT"
                        ? "border-amber-500 bg-amber-500/15 text-amber-400"
                        : "border-white/10 bg-white/5 text-white/50 hover:border-white/20"
                    }`}
                  >
                    <input
                      type="radio"
                      name="role"
                      value="STUDENT"
                      checked={role === "STUDENT"}
                      onChange={() => setRole("STUDENT")}
                      className="hidden"
                    />
                    Student
                  </label>
                  <label
                    className={`flex-1 cursor-pointer rounded-lg border px-4 py-3 text-center font-mono text-sm transition-all ${
                      role === "TEACHER"
                        ? "border-amber-500 bg-amber-500/15 text-amber-400"
                        : "border-white/10 bg-white/5 text-white/50 hover:border-white/20"
                    }`}
                  >
                    <input
                      type="radio"
                      name="role"
                      value="TEACHER"
                      checked={role === "TEACHER"}
                      onChange={() => setRole("TEACHER")}
                      className="hidden"
                    />
                    Teacher
                  </label>
                </div>
              </div>
            )}

            {/* Submit */}
            <Button
              type="submit"
              disabled={loading}
              className="font-mono w-full bg-amber-500 text-black hover:bg-amber-400 cursor-pointer py-5"
              size="lg"
            >
              {loading ? "Please wait..." : isSignUp ? "Sign Up" : "Sign In"}
              {!loading && <HiOutlineArrowRight className="ml-2 h-4 w-4" />}
            </Button>
          </form>

          {/* Toggle link */}
          <p className="mt-6 text-center font-mono text-sm text-white/40">
            {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
            <Link
              href={isSignUp ? "/sign-in" : "/sign-up"}
              className="font-medium text-amber-400 underline underline-offset-4 hover:text-amber-300"
            >
              {isSignUp ? "Sign in" : "Sign up"}
            </Link>
          </p>

          {/* show testing credentials for STUDENT and TEACHER role */}
          <div className="mt-8 rounded-md bg-white/5 p-4 text-sm text-white/50">
            <p className="font-mono mb-2 text-xs uppercase text-amber-400">
              Testing Credentials
            </p>
            <div className="space-y-4">
              <div>
                <p className="font-mono font-medium text-white">Student</p>
                <p className="font-mono text-xs text-white/50">
                  Email: student@gmail.com
                </p>
                <p className="font-mono text-xs text-white/50">
                  Password: student123456
                </p>
              </div>
              <div>
                <p className="font-mono font-medium text-white">Teacher</p>
                <p className="font-mono text-xs text-white/50">
                  Email: teacher@gmail.com
                </p>
                <p className="font-mono text-xs text-white/50">
                  Password: teacher123456
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
