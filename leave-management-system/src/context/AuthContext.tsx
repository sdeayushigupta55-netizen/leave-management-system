import { createContext,useState, useEffect } from "react";
import type { ReactNode } from "react";
import type { AuthUser } from "../type/user";


interface AuthContextType {
  user: AuthUser | null;
  login: (user: AuthUser) => void;
  logout: () => void;
  updateProfile: (updated: Partial<AuthUser>) => void;

  changePassword: (currentPassword: string, newPassword: string) => boolean;
}
interface AuthProviderProps {
  children: ReactNode;
  updateUser: (id: string, updated: Partial<AuthUser>) => void;
}
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children, updateUser }: AuthProviderProps) => {
  const [user, setUser] = useState<AuthUser | null>(null);


  useEffect(() => {
    const stored = localStorage.getItem("auth_user");
    if (stored) setUser(JSON.parse(stored));
  }, []);

  const login = (user: AuthUser) => {
    localStorage.setItem("auth_user", JSON.stringify(user));
    setUser(user);
  };

  const logout = () => {
    localStorage.removeItem("auth_user");
    setUser(null);
  };

  const updateProfile = (updated: Partial<AuthUser>) => {
    if (!user) return;
    const newUser = { ...user, ...updated };
    localStorage.setItem("auth_user", JSON.stringify(newUser));
    setUser(newUser);
  };


  const changePassword = (currentPassword: string, newPassword: string): boolean => {
    if (!user) return false;
    if (user.password !== currentPassword) return false;

    const updatedUser = { ...user, password: newPassword };
    localStorage.setItem("auth_user", JSON.stringify(updatedUser));
    setUser(updatedUser);
    updateUser(user.id, { password: newPassword }); // <-- use here
    return true;
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateProfile, changePassword }}>
      {children}
    </AuthContext.Provider>
  );
};
import { useContext } from "react";

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};