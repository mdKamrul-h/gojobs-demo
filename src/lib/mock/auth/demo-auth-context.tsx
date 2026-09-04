"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { User, UserRole } from "@/lib/types";
import { users, getUserById } from "@/lib/mock/fixtures/users";

const STORAGE_KEY = "gojobs_demo_auth";

export interface DemoAuthState {
  role: UserRole;
  user: User | null;
  isAuthenticated: boolean;
}

interface DemoAuthContextValue extends DemoAuthState {
  setRole: (role: UserRole) => void;
  login: (userId: string) => void;
  loginWithEmail: (email: string) => void;
  signup: (data: {
    email: string;
    name: string;
    role: "candidate" | "recruiter";
  }) => User;
  logout: () => void;
}

const defaultState: DemoAuthState = {
  role: "public",
  user: null,
  isAuthenticated: false,
};

const DemoAuthContext = createContext<DemoAuthContextValue | null>(null);

function getDefaultUserForRole(role: UserRole): User | null {
  switch (role) {
    case "candidate":
      return users.find((u) => u.role === "candidate") ?? null;
    case "recruiter":
      return users.find((u) => u.role === "recruiter") ?? null;
    case "admin":
      return users.find((u) => u.role === "admin") ?? null;
    default:
      return null;
  }
}

function loadStoredState(): DemoAuthState {
  if (typeof window === "undefined") return defaultState;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored) as DemoAuthState;
      if (parsed.user?.id) {
        const freshUser = getUserById(parsed.user.id);
        return { ...parsed, user: freshUser ?? parsed.user };
      }
      return parsed;
    }
  } catch {
    // ignore
  }
  return defaultState;
}

function saveState(state: DemoAuthState): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore
  }
}

export function DemoAuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<DemoAuthState>(defaultState);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setState(loadStoredState());
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) saveState(state);
  }, [state, mounted]);

  const setRole = useCallback((role: UserRole) => {
    if (role === "public") {
      setState({ role: "public", user: null, isAuthenticated: false });
    } else {
      const user = getDefaultUserForRole(role);
      setState({ role, user, isAuthenticated: true });
    }
  }, []);

  const login = useCallback((userId: string) => {
    const user = getUserById(userId);
    if (user) {
      setState({ role: user.role, user, isAuthenticated: true });
    }
  }, []);

  const loginWithEmail = useCallback((email: string) => {
    const normalized = email.trim().toLowerCase();
    const existing = users.find((u) => u.email.toLowerCase() === normalized);
    if (existing) {
      setState({ role: existing.role, user: existing, isAuthenticated: true });
      return;
    }
    const guestUser: User = {
      id: `user-guest-${Date.now()}`,
      email: normalized,
      name: normalized.split("@")[0] ?? "Guest User",
      role: "candidate",
    };
    setState({ role: "candidate", user: guestUser, isAuthenticated: true });
  }, []);

  const signup = useCallback(
    (data: { email: string; name: string; role: "candidate" | "recruiter" }) => {
      const normalized = data.email.trim().toLowerCase();
      const existing = users.find((u) => u.email.toLowerCase() === normalized);
      if (existing) {
        setState({ role: existing.role, user: existing, isAuthenticated: true });
        return existing;
      }
      const newUser: User = {
        id: `user-${Date.now()}`,
        email: normalized,
        name: data.name.trim(),
        role: data.role,
      };
      users.push(newUser);
      setState({ role: data.role, user: newUser, isAuthenticated: true });
      return newUser;
    },
    []
  );

  const logout = useCallback(() => {
    setState(defaultState);
    if (typeof window !== "undefined") {
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch {
        // ignore
      }
    }
  }, []);

  return (
    <DemoAuthContext.Provider
      value={{ ...state, setRole, login, loginWithEmail, signup, logout }}
    >
      {children}
    </DemoAuthContext.Provider>
  );
}

export function useDemoAuth(): DemoAuthContextValue {
  const ctx = useContext(DemoAuthContext);
  if (!ctx) {
    throw new Error("useDemoAuth must be used within DemoAuthProvider");
  }
  return ctx;
}

export { users as demoUsers };
