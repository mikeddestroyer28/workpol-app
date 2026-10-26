import { ScrollView, View, Text, Switch, Pressable } from "react-native";
import { router } from "expo-router";
import { useApp } from "../../src/context/AppContext";
import Button from "../../src/components/Button";
import JobCard from "../../src/components/JobCard";
import Chip from "../../src/components/Chip";

export default function Profile() {
  const { colors, user, signOut, resolvedMode, toggleDark, language, setLanguage, savedIds, appliedIds, allJobs, alerts } = useApp();
  const saved = allJobs.filter((j) => savedIds.includes(j.id));
  const Item = ({ label, onPress, value }) => (
    <Pressable onPress={onPress} style={{ flexDirection: "row", justifyContent: "space-between", paddingVertical: 14, borderBottomWidth: 0.5, borderColor: colors.border }}>
      <Text style={{ color: colors.text1, fontSize: 15 }}>{label}</Text>
      <Text style={{ color: colors.text3 }}>{value ?? "›"}</Text>
    </Pressable>
  );
  return (
    <ScrollView style={{ backgroundColor: colors.bg }} contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
      <View style={{ backgroundColor: colors.bg2, borderRadius: 16, padding: 18, borderWidth: 1, borderColor: colors.border }}>
        <Text style={{ color: colors.text1, fontSize: 20, fontWeight: "800" }}>{user ? user.name : "Guest"}</Text>
        <Text style={{ color: colors.text3, marginBottom: 12 }}>{user ? `${user.email} · ${user.role}` : "Sign in to sync your applications"}</Text>
        {user ? <Button title="Sign out" variant="ghost" onPress={signOut} /> : <Button title="Sign in / Sign up" onPress={() => router.push("/auth")} />}
        <View style={{ flexDirection: "row", marginTop: 16 }}>
          {[[savedIds.length, "Saved"], [appliedIds.length, "Applied"], [alerts.length, "Alerts"]].map(([n, l]) => (
            <View key={l} style={{ flex: 1, alignItems: "center" }}>
              <Text style={{ color: colors.red, fontSize: 22, fontWeight: "800" }}>{n}</Text>
              <Text style={{ color: colors.text3, fontSize: 11 }}>{l}</Text>
            </View>
          ))}
        </View>
      </View>

      <Text style={{ color: colors.text3, marginTop: 20, fontSize: 11, letterSpacing: 1 }}>LANGUAGE</Text>
      <View style={{ flexDirection: "row", marginTop: 8 }}>
        {["EN", "PL", "UA"].map((l) => <Chip key={l} label={l} active={language === l} onPress={() => setLanguage(l)} />)}
      </View>

      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 12 }}>
        <Text style={{ color: colors.text1, fontSize: 15 }}>🌙 Dark mode</Text>
        <Switch value={resolvedMode === "dark"} onValueChange={toggleDark} trackColor={{ true: colors.red }} />
      </View>

      <Item label="🔔 Job alerts" onPress={() => router.push("/alerts")} />
      <Item label="📊 Agency dashboard" onPress={() => router.push("/dashboard")} />
      <Item label="➕ Post a job" onPress={() => router.push("/post")} />
      <Item label="💳 Pricing" onPress={() => router.push("/pricing")} />

      {saved.length > 0 && (
        <>
          <Text style={{ color: colors.text1, fontSize: 18, fontWeight: "700", marginTop: 24, marginBottom: 12 }}>Saved jobs</Text>
          {saved.map((j) => <JobCard key={j.id} job={j} />)}
        </>
      )}
    </ScrollView>
  );
}
