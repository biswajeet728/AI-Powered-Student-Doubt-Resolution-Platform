"use client";

import { createContext, useContext, useState, useCallback } from "react";

interface UserData {
  id: string;
  name: string;
  email: string;
  role: string;
  image: string | null;
}

interface UserContextType {
  user: UserData;
  updateName: (name: string) => void;
}

const UserContext = createContext<UserContextType | null>(null);

export function UserProvider({
  initialUser,
  children,
}: {
  initialUser: UserData;
  children: React.ReactNode;
}) {
  const [user, setUser] = useState(initialUser);

  const updateName = useCallback((name: string) => {
    setUser((prev) => ({ ...prev, name }));
  }, []);

  return (
    <UserContext.Provider value={{ user, updateName }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within UserProvider");
  }
  return context;
}
