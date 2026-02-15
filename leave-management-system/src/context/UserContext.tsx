import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import type { User } from "../type/user";

interface UserContextType {
  users: User[];
  loginWithPno: (pno: string, contact: string) => User;
  updateUser: (id: string, updated: Partial<User>) => void;
  addUser: (payload: any) => void;
  toggleUser: (id: string) => void;
  resetUsers: () => void;
}

const UserContext = createContext<UserContextType | null>(null);

export const useUsers = () => {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUsers must be used inside UserProvider");
  return ctx;
};

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [users, setUsers] = useState<User[]>([]);

  // Fetch users from backend on mount
  useEffect(() => {
    fetch("/api/users")
      .then((res) => res.json())
      .then((data) => setUsers(Array.isArray(data) ? data : []))
      .catch(() => setUsers([]));
  }, []);

 const addUser = (payload: any) => {
  const { password, ...safePayload } = payload;
  const newUser = {
    isActive: true,
    createdAt: new Date().toISOString(),
    ...safePayload,
  };
  fetch("/api/users", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newUser),
  })
    .then((res) => res.json())
    .then((savedUser) => setUsers((prev) => [savedUser, ...prev]));
};

 const updateUser = (id: string, updated: Partial<User>) => {
  fetch(`/api/users/${id}`, { // id should be _id from MongoDB
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updated),
  })
    .then((res) => {
      if (!res.ok) {
        return res.json().then(err => { throw new Error(err.error || "Update failed"); });
      }
      return res.json();
    })
    .then((updatedUser) =>
      setUsers((prev) => prev.map((u) => (u._id === id ? updatedUser : u))) // compare with _id
    )
    .catch((err) => {
      console.error("Failed to update user:", err);
    });
};

  const toggleUser = (id: string) => {
  const user = users.find((u) => u._id === id);
  if (!user) return;
  updateUser(id, { isActive: !user.isActive });
};

  const loginWithPno = (pno: string, contact: string) => {
    console.log("Trying login with:", pno, contact);
console.log("Users loaded:", users);
    const user = users.find(
      (u) => u.pno === pno && u.contact === contact && u.isActive
      
    );
    console.log("Matched user:", user);
    if (!user) {
      throw new Error("Invalid PNO or contact number");
    }
    return user;
  };

  const resetUsers = () => {
    // Optionally, you can implement a backend endpoint to reset users
    setUsers([]);
  };

  return (
    <UserContext.Provider
      value={{ users, loginWithPno, updateUser, toggleUser, addUser, resetUsers }}
    >
      {children}
    </UserContext.Provider>
  );
};