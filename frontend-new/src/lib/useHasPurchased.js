import { useEffect, useState } from "react";

/** Returns true once a successful payment has completed on this device/browser. */
export default function useHasPurchased() {
  const [purchased, setPurchased] = useState(false);
  useEffect(() => {
    try { setPurchased(localStorage.getItem("rse_has_purchased") === "1"); } catch {}
  }, []);
  return purchased;
}
