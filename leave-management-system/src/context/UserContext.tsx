import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import type { User} from "../type/user";

interface UserContextType {
    users: User[];
    loginWithUno: (uno: string, contact: string) => User;
    updateUser: (id: string, updated: Partial<User>) => void;
    addUser: (payload: any) => void; // You can replace 'any' with a more specific type if needed
    toggleUser: (id: string) => void;
    // resetPassword: (userId: string, newPassword: string) => void; // For future use
}

const   UserContext = createContext<UserContextType | null>(null);

export const useUsers = () => {
    const ctx = useContext(UserContext);
    if (!ctx) throw new Error("useUsers must be used inside UserProvider");
    return ctx;
};

const defaultUsers: User[] = [
   {
    id: "1",
    uno: "UNO6001",
    name: "Ruapli Singh",
    contact: "9876500008",
    role: "POLICE",
    rank: "CONSTABLE",
    circleOffice: "City Circle",
    policeStation: "Ramgarh",
    area: "CITY",
    gender: "FEMALE",
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    uno: "UNO5001",
    name: "Rahul Verma",
    contact: "9876500007",
    role: "POLICE",
    rank: "HEAD_CONSTABLE",
    circleOffice: "City Circle",
    policeStation: "Ramgarh",
    area: "CITY",
    gender: "MALE",
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: "3",
    uno: "UNO3001",
    name: "Sunil Kumar",
    contact: "9876500005",
    role: "POLICE",
    rank: "SI",
    circleOffice: "City Circle",
    policeStation: "Ramgarh",
    area: "CITY",
    gender: "MALE",
    isActive: true,
    createdAt: new Date().toISOString(),
  },

//   🔼 Upper hierarchy (needed later)
  {
    id: "10",
    uno: "UNO2001",
    name: "Rakesh Mishra",
    contact: "9876500004",
    role: "POLICE",
    rank: "SHO/SO",
    policeStation: "Ramgarh",
    circleOffice: "City Circle",
    area: "CITY",
    gender: "MALE",
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: "9",
    uno: "UNO4001",
    name: "Vikram Singh",
    contact: "9876500006",
    role: "POLICE",
    rank: "INSPECTOR",
    policeStation: "Ramgarh",
    circleOffice: "City Circle",
    area: "CITY",
    gender: "MALE",
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: "11",
    uno: "UNO0001",
    name: "Amit Sharma",
    contact: "9876500002",
    role: "POLICE",
    rank: "CO",
    circleOffice: "City Circle",
    area: "CITY",
    gender: "MALE",
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: "12",
    uno: "UNO1001",
    name: "Anil Kumar",
    contact: "9876500003",
    role: "POLICE",
    rank: "SP",
    area: "CITY",
    gender: "MALE",
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: "13",
    uno: "UNO9001",
    name: "Mohan Verma",
    contact: "9876500001",
    role: "POLICE",
    rank: "SSP",
    gender: "MALE",
    isActive: true,
    createdAt: new Date().toISOString(),
  }
];

// Safe localStorage helper for mobile compatibility
const safeLocalStorage = {
  getItem: (key: string): string | null => {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  },
  setItem: (key: string, value: string): void => {
    try {
      localStorage.setItem(key, value);
    } catch {
      console.warn("localStorage not available");
    }
  }
};

const getInitialUsers = (): User[] => {
  if (typeof window === 'undefined') return defaultUsers;
  const stored = safeLocalStorage.getItem("app_users");
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return defaultUsers;
    }
  }
  return defaultUsers;
};

export const UserProvider = ({ children }: { children: ReactNode }) => {
    const [users, setUsers] = useState<User[]>(getInitialUsers);

    // Persist users to localStorage whenever they change
    useEffect(() => {
      safeLocalStorage.setItem("app_users", JSON.stringify(users));
    }, [users]);
 // const addUser = (
    //     payload: CreateAdminUserPayload | CreatePoliceUserPayload
    // ) => {
    //     const { password, ...safePayload } = payload;

    //     setUsers(prev => [
    //         {
    //             id: crypto.randomUUID(),
    //             isActive: true,
    //             createdAt: new Date().toISOString(),
    //             ...safePayload,
    //         },
    //         ...prev,
    //     ]);
    // };
   
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

    // const resetPassword = (userId: string, newPassword: string) => {
    //     console.log("Password reset for", userId, newPassword);
    //     // backend later
    // };
const loginWithUno = (uno: string, contact: string) => {
  const user = users.find(
    u => u.uno === uno && u.contact === contact && u.isActive
  );

  if (!user) {
    throw new Error("Invalid UNO or contact number");
  }

  return user;
};

    return (
        <UserContext.Provider value={{ users, loginWithUno ,updateUser, toggleUser, addUser: () => {} }}>
            {children}
        </UserContext.Provider>
    );
};
