import React, { createContext, useCallback, useContext, useState } from "react";

const DataContext = createContext();

export function DataProvider({ children }) {
  const [items, setItems] = useState([]);
  const [meta, setMeta] = useState({ totalItems: 0, totalPages: 0 });

  const fetchItems = useCallback(
    async (signal, { page = 1, limit = 12, q = "", categories = [] } = {}) => {
      try {
        const query = new URLSearchParams({
          page,
          limit,
          q,
          categories: categories.join(","),
        }).toString();
        const res = await fetch(`http://localhost:3001/api/items?${query}`, {
          signal,
        });
        if (!res.ok) throw new Error("Failed to fetch items");
        const json = await res.json();
        setItems(json.items || []);
        setMeta(json.meta || { totalItems: 0, totalPages: 0 });
      } catch (error) {
        console.error("Error fetching items:", error);
        setItems([]);
        setMeta({ totalItems: 0, totalPages: 0 });
      }
    },
    []
  );

  return (
    <DataContext.Provider value={{ items, meta, fetchItems }}>
      {children}
    </DataContext.Provider>
  );
}

export const useData = () => useContext(DataContext);
