import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from "react";
import { useColorScheme } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { DARK, LIGHT } from "../theme/colors";
import { JOBS as SEED } from "../data/jobs";

const KEY = "workpol:state:v1";
const Ctx = createContext(null);

export function AppProvider({ children }) {
  const system = useColorScheme();
  const [hydrated, setHydrated] = useState(false);
  const [themeMode, setThemeMode] = useState("dark");
  const [language, setLanguage] = useState("EN");
  const [savedIds, setSavedIds] = useState([]);
  const [appliedIds, setAppliedIds] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [postedJobs, setPostedJobs] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(KEY);
        if (raw) {
          const s = JSON.parse(raw);
          setThemeMode(s.themeMode ?? "dark"); setLanguage(s.language ?? "EN");
          setSavedIds(s.savedIds ?? []); setAppliedIds(s.appliedIds ?? []);
          setAlerts(s.alerts ?? []); setPostedJobs(s.postedJobs ?? []); setUser(s.user ?? null);
        }
      } catch (e) {}
      setHydrated(true);
    })();
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    AsyncStorage.setItem(KEY, JSON.stringify({ themeMode, language, savedIds, appliedIds, alerts, postedJobs, user })).catch(() => {});
  }, [hydrated, themeMode, language, savedIds, appliedIds, alerts, postedJobs, user]);

  const resolvedMode = themeMode === "system" ? system || "dark" : themeMode;
  const colors = resolvedMode === "light" ? LIGHT : DARK;
  const toggleDark = useCallback(() => setThemeMode((m) => (m === "dark" ? "light" : "dark")), []);
  const toggleSaved = useCallback((id) => setSavedIds((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id])), []);
  const markApplied = useCallback((id) => setAppliedIds((p) => (p.includes(id) ? p : [...p, id])), []);
  const addAlert = useCallback((a) => setAlerts((p) => [{ id: Date.now().toString(), ...a }, ...p]), []);
  const removeAlert = useCallback((id) => setAlerts((p) => p.filter((a) => a.id !== id)), []);
  const addPostedJob = useCallback((j) => setPostedJobs((p) => [{ ...j, id: Date.now(), posted: "Just now", postedTimestamp: Date.now(), views: 0, applicants: 0 }, ...p]), []);
  const allJobs = useMemo(() => [...postedJobs, ...SEED], [postedJobs]);

  const value = useMemo(() => ({
    hydrated, colors, themeMode, resolvedMode, setThemeMode, toggleDark, language, setLanguage,
    allJobs, savedIds, toggleSaved, appliedIds, markApplied, alerts, addAlert, removeAlert,
    postedJobs, addPostedJob, user, signIn: setUser, signOut: () => setUser(null),
  }), [hydrated, colors, themeMode, resolvedMode, toggleDark, language, allJobs, savedIds, toggleSaved, appliedIds, markApplied, alerts, addAlert, removeAlert, postedJobs, addPostedJob, user]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
export function useApp() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useApp must be used within AppProvider");
  return c;
}
