import React, { createContext, useContext, useState, useEffect } from "react";
import { API_BASE_URL } from "../config";
import type { PopulationDetailsType } from "../type/beatbook";
import { useBeatBook } from "../context/BeatBookContext";
import { useAuth } from "./AuthContext";

interface PopulationDetailsContextType {
  populationDetails: PopulationDetailsType[];
  loading: boolean;
  error: string | null;
  fetchPopulationDetails: () => void;
  addPopulationDetails: (data: PopulationDetailsType) => Promise<any>;
  updatePopulationDetails: (id: string, data: PopulationDetailsType) => Promise<any>;
  deletePopulationDetails: (id: string) => Promise<void>;
}

const PopulationDetailsContext = createContext<PopulationDetailsContextType | undefined>(undefined);

export const usePopulationDetails = () => {
  const context = useContext(PopulationDetailsContext);
  if (!context) throw new Error("usePopulationDetails must be used within PopulationDetailsProvider");
  return context;
};

export const PopulationDetailsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [populationDetails, setPopulationDetails] = useState<PopulationDetailsType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { beatBooks } = useBeatBook();
  const { user } = useAuth();
  const userBeatBook = beatBooks.find(b => String(b.userId) === String(user?._id));

  const fetchPopulationDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      if (!userBeatBook) {
        setPopulationDetails([]);
        return;
      }
      const res = await fetch(`${API_BASE_URL}/population-details?beatId=${userBeatBook._id}`);
      if (!res.ok) throw new Error("Failed to fetch population details");
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        setPopulationDetails(data);
      } else {
        setPopulationDetails(
          userBeatBook.villages.map(village => ({
            beatId: userBeatBook._id!,
            villageName: village.name,
            totalPopulation: 0,
            religions: [],
          }))
        );
      }
    } catch (err: any) {
      setError(err.message || "Failed to fetch population details");
    } finally {
      setLoading(false);
    }
  };

  const addPopulationDetails = async (data: PopulationDetailsType) => {
    setLoading(true);
    setError(null);
    const { _id, ...rest } = data;
    try {
      const res = await fetch(`${API_BASE_URL}/population-details`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(rest),
      });
      if (!res.ok) throw new Error("Failed to add population details");
      const saved = await res.json();
      setPopulationDetails((prev) => {
        // Replace if same villageName and beatId exists without _id, else add
        const idx = prev.findIndex(
          v => !v._id && v.villageName === saved.villageName && v.beatId === saved.beatId
        );
        if (idx !== -1) {
          const updated = [...prev];
          updated[idx] = saved;
          return updated;
        }
        return [...prev, saved];
      });
      return saved;
    } catch (err: any) {
      setError(err.message || "Failed to add population details");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updatePopulationDetails = async (id: string, data: PopulationDetailsType) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE_URL}/population-details/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to update population details");
      const updated = await res.json();
      setPopulationDetails((prev) => prev.map((p) => (p._id === id ? updated : p)));
      return updated;
    } catch (err: any) {
      setError(err.message || "Failed to update population details");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deletePopulationDetails = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE_URL}/population-details/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete population details");
      setPopulationDetails((prev) => prev.filter((p) => p._id !== id));
    } catch (err: any) {
      setError(err.message || "Failed to delete population details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPopulationDetails();
    // eslint-disable-next-line
  }, [userBeatBook]);

  return (
    <PopulationDetailsContext.Provider
      value={{
        populationDetails,
        loading,
        error,
        fetchPopulationDetails,
        addPopulationDetails,
        updatePopulationDetails,
        deletePopulationDetails,
      }}
    >
      {children}
    </PopulationDetailsContext.Provider>
  );
};