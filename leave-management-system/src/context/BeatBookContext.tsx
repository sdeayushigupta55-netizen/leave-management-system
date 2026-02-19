import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import type { ReactNode } from "react";
import { API_BASE_URL } from "../config";
import type { BeatBook } from "../type/beatbook";

interface BeatBookContextType {

  beatBooks: BeatBook[];
  loading: boolean;
  error: string | null;
  fetchBeatBooks: () => void;
  fetchBeatBookByUser: (userId: string) => Promise<BeatBook | null>;
  addBeatBook: (data: BeatBook) => Promise<BeatBook | null>;
  updateBeatBook: (id: string, data: BeatBook) => Promise<BeatBook | null>;
  deleteBeatBook: (id: string) => Promise<void>;
}

const BeatBookContext = createContext<BeatBookContextType | undefined>(undefined);

export const useBeatBook = () => {
  const context = useContext(BeatBookContext);
  if (!context) throw new Error("useBeatBook must be used within a BeatBookProvider");
  return context;
};

export const BeatBookProvider = ({ children }: { children: ReactNode }) => {
  const [beatBooks, setBeatBooks] = useState<BeatBook[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchBeatBooks = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE_URL}/beat-books`);
      if (!res.ok) throw new Error("Failed to fetch beat books");
      const data = await res.json();
      setBeatBooks(Array.isArray(data) ? data : []);
    } catch (err: any) {
      setError(err.message || "Failed to fetch beat books");
    } finally {
      setLoading(false);
    }
  };
   useEffect(() => {
    if (user && user._id) {
      fetchBeatBooks();
    } else {
      setBeatBooks([]); // clear on logout
    }
  }, [user]);
const fetchBeatBookByUser = async (userId: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE_URL}/beat-books?userId=${userId}`);
      if (!res.ok) throw new Error("Failed to fetch beat book for user");
      const data = await res.json();
      return Array.isArray(data) && data.length > 0 ? data[0] : null;
    } catch (err: any) {
      setError(err.message || "Failed to fetch beat book for user");
      return null;
    } finally {
      setLoading(false);
    }
  };
  const addBeatBook = async (data: BeatBook) => {
    setLoading(true);
    setError(null);
    try {
      if (!user || !user._id) throw new Error("User not found");
      const res = await fetch(`${API_BASE_URL}/beat-books`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, userId: user._id }),
      });
      if (!res.ok) throw new Error("Failed to add beat book");
      const saved = await res.json();
      setBeatBooks((prev) => [...prev, saved]);
      return saved;
    } catch (err: any) {
      setError(err.message || "Failed to add beat book");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateBeatBook = async (id: string, data: BeatBook): Promise<BeatBook | null> => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE_URL}/beat-books/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to update beat book");
      const updated = await res.json();
      setBeatBooks((prev) => prev.map((b) => (b._id === id ? updated : b)));
      return updated;
    } catch (err: any) {
      setError(err.message || "Failed to update beat book");
      return null;
    } finally {
      setLoading(false);
    }
  };


  const deleteBeatBook = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE_URL}/beat-books/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete beat book");
      setBeatBooks((prev) => prev.filter((b) => b._id !== id));
    } catch (err: any) {
      setError(err.message || "Failed to delete beat book");
    } finally {
      setLoading(false);
    }
  };

  return (
    <BeatBookContext.Provider
      value={{ beatBooks,loading, error, fetchBeatBooks, fetchBeatBookByUser, addBeatBook, updateBeatBook, deleteBeatBook }}
    >
      {children}
    </BeatBookContext.Provider>
  );
};
