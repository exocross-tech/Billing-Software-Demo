"use client";

import { useState, useEffect } from "react";

export function useLocalStorage<T>(
  key: string,
  defaultValue: T
): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [value, setValue] = useState<T>(defaultValue);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const item = localStorage.getItem(key);
      if (item !== null) {
        setValue(JSON.parse(item));
      }
    } catch (err) {
      console.error(`Error reading localStorage key "${key}":`, err);
    }
    setLoaded(true);
  }, [key]);

  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (err) {
      console.error(`Error writing localStorage key "${key}":`, err);
    }
  }, [key, value, loaded]);

  return [value, setValue];
}
