import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import type { User, CreatePoliceUserPayload, CreateAdminUserPayload } from "../type/user";

interface UserContextType {
    users: User[];
    addUser: (payload: CreateAdminUserPayload | CreatePoliceUserPayload) => void;
    updateUser: (id: string, updated: Partial<User>) => void;
    toggleUser: (id: string) => void;
    resetPassword: (userId: string, newPassword: string) => void;
}

const UserContext = createContext<UserContextType | null>(null);

export const useUsers = () => {
    const ctx = useContext(UserContext);
    if (!ctx) throw new Error("useUsers must be used inside UserProvider");
    return ctx;
};

export const UserProvider = ({ children }: { children: ReactNode }) => {
    const [users, setUsers] = useState<User[]>([
  {
    id: "1",
    name: "CONSTABLE",
    email: "CONSTABLE@police.gov",
    contact: "987654321",
    role: "POLICE",
    rank: "CONSTABLE",
    policeStation: "HQ",
    isActive: true,
    createdAt: new Date().toISOString(),
    password: "Police@123", // 🔴 demo only
    
  },
  {
    id: "2",
    name: "ADMIN",
    email: "ADMIN@police.gov",
     contact: "987645321",
    role: "ADMIN",
    policeStation: "HQ",
    isActive: true,
    createdAt: new Date().toISOString(),
    password: "Police@123", // 🔴 demo only
  },
  {
    id: "3",
    name: "HEAD_CONSTABLE",
    email: "HEAD_CONSTABLE@police.gov",
     contact: "987645321",
    role: "POLICE",
    rank: "HEAD_CONSTABLE",
    policeStation: "HQ",
    isActive: true,
    createdAt: new Date().toISOString(),
    password: "Police@123", // 🔴 demo only
  },
  {
    id: "4",
    name: "SI",
    email: "SI@police.gov",
     contact: "987645321",
    role: "POLICE",
    rank: "SI",
    policeStation: "HQ",
    isActive: true,
    createdAt: new Date().toISOString(),
    password: "Police@123", // 🔴 demo only
  },
  {
    id: "5",
    name: "INSPECTOR",
    email: "INSPECTOR@police.gov",
     contact: "987645321",
    role: "POLICE",
    rank: "INSPECTOR",
    policeStation: "HQ",
    isActive: true,
    createdAt: new Date().toISOString(),
    password: "Police@123", // 🔴 demo only
  },
  {
    id: "6",
    name: "SHO",
    email: "SHO@police.gov",
     contact: "987645321",
    role: "POLICE",
    rank: "SHO",
    policeStation: "HQ",
    isActive: true,
    createdAt: new Date().toISOString(),
    password: "Police@123", // 🔴 demo only
  }
]);

    const addUser = (
        payload: CreateAdminUserPayload | CreatePoliceUserPayload
    ) => {
        const { password, ...safePayload } = payload;

        setUsers(prev => [
            {
                id: crypto.randomUUID(),
                isActive: true,
                createdAt: new Date().toISOString(),
                ...safePayload,
            },
            ...prev,
        ]);
    };
   
    const updateUser=(id:string,updated:Partial<User>)=> {
        setUsers(prev=>
            prev.map(u=>
                u.id===id ? {...u,...updated} : u
            )
        );
    }

    const toggleUser = (id: string) => {
        setUsers(prev =>
            prev.map(u =>
                u.id === id ? { ...u, isActive: !u.isActive } : u
            )
        );
    };

    const resetPassword = (userId: string, newPassword: string) => {
        console.log("Password reset for", userId, newPassword);
        // backend later
    };

    return (
        <UserContext.Provider value={{ users, addUser, updateUser, toggleUser, resetPassword }}>
            {children}
        </UserContext.Provider>
    );
};
