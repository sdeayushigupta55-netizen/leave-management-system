import React, { createContext, useContext, useState, useEffect } from "react";
import { API_BASE_URL } from "../config";

import type{ PopulationDetailsType } from "../type/beatbook";


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

  const fetchPopulationDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE_URL}/population-details`);
      if (!res.ok) throw new Error("Failed to fetch population details");
      const data = await res.json();
      setPopulationDetails(Array.isArray(data) ? data : []);
    } catch (err: any) {
      setError(err.message || "Failed to fetch population details");
    } finally {
      setLoading(false);
    }
  };

  const addPopulationDetails = async (data: PopulationDetailsType) => {
    setLoading(true);
    setError(null);
    try {
        console.log("Sending population details:", data);
      const res = await fetch(`${API_BASE_URL}/population-details`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to add population details");
      const saved = await res.json();
      setPopulationDetails((prev) => [...prev, saved]);
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
  }, []);

  return (
    <PopulationDetailsContext.Provider
      value={{ populationDetails, loading, error, fetchPopulationDetails, addPopulationDetails, updatePopulationDetails, deletePopulationDetails }}
    >
      {children}
    </PopulationDetailsContext.Provider>
  );
};
