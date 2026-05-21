"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { updateProfileName, changePassword } from "@/lib/actions/profile";
import { useUser } from "@/lib/providers/user-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  HiOutlineUser,
  HiOutlineEnvelope,
  HiOutlineLockClosed,
  HiOutlinePencilSquare,
  HiOutlineCheckCircle,
} from "react-icons/hi2";

interface ProfileViewProps {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    image: string | null;
  };
  stats: {
    total: number;
    open: number;
    resolved: number;
  };
}

export default function ProfileView({ user, stats }: ProfileViewProps) {
  const router = useRouter();
  const { updateName } = useUser();

  // Name editing
  const [name, setName] = useState(user.name);
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameLoading, setNameLoading] = useState(false);

  // Sync name state when user prop changes (after router.refresh)
  useEffect(() => {
    if (!isEditingName) {
      setName(user.name);
    }
  }, [user.name, isEditingName]);

  // Password change
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);

  const handleNameSave = async () => {
    if (!name.trim()) {
      toast.error("Name cannot be empty");
      return;
    }
    setNameLoading(true);
    const result = await updateProfileName(name);
    if (result.success) {
      toast.success("Name updated!");
      setIsEditingName(false);
      updateName(name);
      router.refresh();
    } else {
      toast.error(result.error || "Failed to update name");
    }
    setNameLoading(false);
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }
    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    setPasswordLoading(true);
    const result = await changePassword(currentPassword, newPassword);
    if (result.success) {
      toast.success("Password changed!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } else {
      toast.error(result.error || "Failed to change password");
    }
    setPasswordLoading(false);
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="font-mono text-2xl font-bold text-white mb-6">Profile</h1>

      {/* Stats Bar */}
      <Card className="border-white/10 bg-[#2a2826]/80 backdrop-blur-sm mb-6">
        <CardContent className="p-5">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="font-mono text-2xl font-bold text-amber-400">
                {stats.total}
              </p>
              <p className="font-mono text-xs text-white/40">
                Total Doubts
              </p>
            </div>
            <div>
              <p className="font-mono text-2xl font-bold text-blue-400">
                {stats.open}
              </p>
              <p className="font-mono text-xs text-white/40">Open</p>
            </div>
            <div>
              <p className="font-mono text-2xl font-bold text-green-400">
                {stats.resolved}
              </p>
              <p className="font-mono text-xs text-white/40">Resolved</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Side by side cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profile Info Card */}
        <Card className="border-white/10 bg-[#2a2826]/80 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center gap-2">
              <HiOutlineUser className="h-5 w-5 text-amber-400" />
              <CardTitle className="font-mono text-lg text-white">
                Profile Info
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-5">
            {/* Avatar */}
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-amber-500 text-2xl font-bold text-black">
                {user.image ? (
                  <img
                    src={user.image}
                    alt={user.name}
                    className="h-16 w-16 rounded-full object-cover"
                  />
                ) : (
                  user.name.charAt(0).toUpperCase()
                )}
              </div>
              <div>
                <p className="font-mono text-sm text-white">{user.name}</p>
                <span
                  className={`inline-block mt-1 rounded-full px-2.5 py-0.5 font-mono text-xs font-medium ${
                    user.role === "TEACHER"
                      ? "bg-purple-500/15 text-purple-400 border border-purple-500/20"
                      : "bg-blue-500/15 text-blue-400 border border-blue-500/20"
                  }`}
                >
                  {user.role}
                </span>
              </div>
            </div>

            {/* Name */}
            <div className="space-y-2">
              <Label className="font-mono text-sm text-white/70">Name</Label>
              <div className="flex gap-2">
                {isEditingName ? (
                  <>
                    <Input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="font-mono border-white/10 bg-white/5 text-white placeholder:text-white/25 focus-visible:border-amber-500/50 focus-visible:ring-amber-500/20"
                      autoFocus
                    />
                    <Button
                      onClick={handleNameSave}
                      disabled={nameLoading}
                      size="sm"
                      className="font-mono bg-amber-500 text-black hover:bg-amber-400 shrink-0 cursor-pointer"
                    >
                      {nameLoading ? "Saving..." : "Save"}
                    </Button>
                    <Button
                      onClick={() => {
                        setName(user.name);
                        setIsEditingName(false);
                      }}
                      variant="outline"
                      size="sm"
                      className="font-mono border-white/10 bg-white/5 text-white hover:bg-white/10 shrink-0 cursor-pointer"
                    >
                      Cancel
                    </Button>
                  </>
                ) : (
                  <>
                    <Input
                      value={name}
                      readOnly
                      className="font-mono border-white/10 bg-white/5 text-white/70 cursor-default"
                    />
                    <Button
                      onClick={() => setIsEditingName(true)}
                      variant="outline"
                      size="sm"
                      className="font-mono border-white/10 bg-white/5 text-white hover:bg-white/10 shrink-0 cursor-pointer"
                    >
                      <HiOutlinePencilSquare className="h-4 w-4" />
                    </Button>
                  </>
                )}
              </div>
            </div>

            {/* Email (read-only) */}
            <div className="space-y-2">
              <Label className="font-mono text-sm text-white/70">Email</Label>
              <div className="relative">
                <HiOutlineEnvelope className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
                <Input
                  value={user.email}
                  readOnly
                  className="font-mono border-white/10 bg-white/5 text-white/50 pl-10 cursor-default"
                />
              </div>
              <p className="font-mono text-xs text-white/30">
                Email cannot be changed
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Change Password Card */}
        <Card className="border-white/10 bg-[#2a2826]/80 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center gap-2">
              <HiOutlineLockClosed className="h-5 w-5 text-amber-400" />
              <CardTitle className="font-mono text-lg text-white">
                Change Password
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePasswordChange} className="space-y-4">
              {/* Current Password */}
              <div className="space-y-2">
                <Label htmlFor="current-password" className="font-mono text-sm text-white/70">
                  Current Password
                </Label>
                <div className="relative">
                  <HiOutlineLockClosed className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
                  <Input
                    id="current-password"
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter current password"
                    className="font-mono border-white/10 bg-white/5 text-white placeholder:text-white/25 pl-10 focus-visible:border-amber-500/50 focus-visible:ring-amber-500/20"
                  />
                </div>
              </div>

              {/* New Password */}
              <div className="space-y-2">
                <Label htmlFor="new-password" className="font-mono text-sm text-white/70">
                  New Password
                </Label>
                <div className="relative">
                  <HiOutlineLockClosed className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
                  <Input
                    id="new-password"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="At least 8 characters"
                    className="font-mono border-white/10 bg-white/5 text-white placeholder:text-white/25 pl-10 focus-visible:border-amber-500/50 focus-visible:ring-amber-500/20"
                  />
                </div>
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <Label htmlFor="confirm-password" className="font-mono text-sm text-white/70">
                  Confirm New Password
                </Label>
                <div className="relative">
                  <HiOutlineCheckCircle className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
                  <Input
                    id="confirm-password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    className="font-mono border-white/10 bg-white/5 text-white placeholder:text-white/25 pl-10 focus-visible:border-amber-500/50 focus-visible:ring-amber-500/20"
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={passwordLoading || !currentPassword || !newPassword || !confirmPassword}
                className="font-mono bg-amber-500 text-black hover:bg-amber-400 cursor-pointer"
              >
                {passwordLoading ? "Changing..." : "Change Password"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
