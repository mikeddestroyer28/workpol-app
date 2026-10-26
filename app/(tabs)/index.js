import { useState } from "react";
import { ScrollView, View, Text, TextInput, StyleSheet } from "react-native";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { useApp } from "../../src/context/AppContext";
import Button from "../../src/components/Button";
import JobCard from "../../src/components/JobCard";

export default function Home() {
  const { colors, allJobs } = useApp();
  const [q, setQ] = useState("");
  const search = () => router.push({ pathname: "/jobs", params: { q } });
  return (
    <ScrollView style={{ backgroundColor: colors.bg }} contentContainerStyle={{ paddingBottom: 40 }}>
      <LinearGradient colors={["#2a0a0d", colors.bg]} style={{ padding: 20, paddingTop: 28, marginBottom: 20 }}>
        <Text style={{ color: colors.text2, fontSize: 12, marginBottom: 14 }}>● Poland's agency job marketplace</Text>
        <Text style={[s.h1, { color: colors.text1 }]}>Real Jobs.</Text>
        <Text style={[s.h1, { color: colors.text1 }]}>Full <Text style={{ color: colors.red }}>Transparency.</Text></Text>
        <Text style={{ color: colors.text2, fontSize: 14, lineHeight: 21, marginVertical: 16 }}>
          No more hunting Facebook groups or WhatsApp chains. Verified agency jobs across Poland — pay rates, documents and accommodation clearly listed.
        </Text>
        <View style={[s.search, { backgroundColor: colors.bg3, borderColor: colors.borderBright }]}>
          <TextInput value={q} onChangeText={setQ} onSubmitEditing={search} placeholder="Job title or keyword..." placeholderTextColor={colors.text3} returnKeyType="search" style={{ flex: 1, color: colors.text1, fontSize: 15, paddingVertical: 12 }} />
          <Button title="Search" size="sm" onPress={search} />
        </View>
        <View style={{ flexDirection: "row", gap: 10, marginBottom: 22 }}>
          <Button title="Browse all jobs →" style={{ flex: 1 }} onPress={() => router.push("/jobs")} />
          <Button title="✨ AI Match" variant="ghost" style={{ flex: 1 }} onPress={() => router.push("/match")} />
        </View>
        <View style={{ flexDirection: "row" }}>
          {[["340+", "Active listings"], ["48", "Verified agencies"], ["0 zł", "Always free"]].map(([n, l]) => (
            <View key={l} style={{ flex: 1 }}>
              <Text style={{ color: colors.text1, fontSize: 22, fontWeight: "800" }}>{n}</Text>
              <Text style={{ color: colors.text3, fontSize: 11 }}>{l}</Text>
            </View>
          ))}
        </View>
      </LinearGradient>
      <View style={{ paddingHorizontal: 16 }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 12 }}>
          <Text style={{ color: colors.text1, fontSize: 20, fontWeight: "700" }}>Latest jobs</Text>
          <Text style={{ color: colors.red, fontWeight: "600" }} onPress={() => router.push("/jobs")}>See all →</Text>
        </View>
        {allJobs.slice(0, 3).map((j) => <JobCard key={j.id} job={j} />)}
        <View style={{ backgroundColor: colors.bg2, borderColor: colors.border, borderWidth: 1, borderRadius: 16, padding: 18 }}>
          <Text style={{ color: colors.text1, fontSize: 18, fontWeight: "700", marginBottom: 6 }}>Are you an agency?</Text>
          <Text style={{ color: colors.text2, marginBottom: 14 }}>Post verified listings and reach workers directly.</Text>
          <View style={{ flexDirection: "row", gap: 10 }}>
            <Button title="Post a Job" style={{ flex: 1 }} onPress={() => router.push("/post")} />
            <Button title="Pricing" variant="secondary" style={{ flex: 1 }} onPress={() => router.push("/pricing")} />
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
const s = StyleSheet.create({
  h1: { fontSize: 38, fontWeight: "800", lineHeight: 44 },
  search: { flexDirection: "row", alignItems: "center", borderWidth: 1, borderRadius: 12, paddingLeft: 14, paddingRight: 6, marginBottom: 14 },
});
