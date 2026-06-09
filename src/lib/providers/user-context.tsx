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
  chatWithAiSheet: boolean;
  chatDoubtId: string | null;
  openChatSheet: (doubtId: string) => void;
  closeChatSheet: () => void;
}

export const UserContext = createContext<UserContextType | null>(null);

export function UserProvider({
  initialUser,
  children,
}: {
  initialUser: UserData;
  children: React.ReactNode;
}) {
  const [user, setUser] = useState(initialUser);
  const [chatWithAiSheet, setChatWithAiSheet] = useState(false);
  const [chatDoubtId, setChatDoubtId] = useState<string | null>(null);

  const updateName = useCallback((name: string) => {
    setUser((prev) => ({ ...prev, name }));
  }, []);

  const openChatSheet = useCallback((doubtId: string) => {
    setChatDoubtId(doubtId);
    setChatWithAiSheet(true);
  }, []);

  const closeChatSheet = useCallback(() => {
    setChatWithAiSheet(false);
    setChatDoubtId(null);
  }, []);

  return (
    <UserContext.Provider
      value={{
        user,
        updateName,
        chatWithAiSheet,
        chatDoubtId,
        openChatSheet,
        closeChatSheet,
      }}
    >
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
