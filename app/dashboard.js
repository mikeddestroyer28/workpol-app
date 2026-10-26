import { ScrollView, View, Text } from "react-native";
import { router } from "expo-router";
import { useApp } from "../src/context/AppContext";
import Button from "../src/components/Button";

export default function Dashboard() {
  const { colors, postedJobs, allJobs } = useApp();
  const mine = postedJobs.length ? postedJobs : allJobs.slice(0, 3);
  const totalViews = mine.reduce((a, j) => a + j.views, 0);
  const totalApps = mine.reduce((a, j) => a + j.applicants, 0);
  const Stat = ({ n, l }) => (
    <View style={{ flex: 1, backgroundColor: colors.bg2, borderRadius: 14, padding: 14, borderWidth: 1, borderColor: colors.border }}>
      <Text style={{ color: colors.red, fontSize: 24, fontWeight: "800" }}>{n}</Text>
      <Text style={{ color: colors.text3, fontSize: 11 }}>{l}</Text>
    </View>
  );
  return (
    <ScrollView style={{ backgroundColor: colors.bg }} contentContainerStyle={{ padding: 16 }}>
      {!postedJobs.length && <Text style={{ color: colors.text3, marginBottom: 12 }}>Showing sample data — post a job to see your own listings here.</Text>}
      <View style={{ flexDirection: "row", gap: 10, marginBottom: 10 }}><Stat n={mine.length} l="Active listings" /><Stat n={totalViews.toLocaleString()} l="Total views" /></View>
      <View style={{ flexDirection: "row", gap: 10, marginBottom: 20 }}><Stat n={totalApps} l="Applicants" /><Stat n={totalViews ? `${((totalApps / totalViews) * 100).toFixed(1)}%` : "0%"} l="Apply rate" /></View>
      <Text style={{ color: colors.text1, fontSize: 18, fontWeight: "700", marginBottom: 10 }}>Your listings</Text>
      {mine.map((j) => (
        <View key={j.id} style={{ backgroundColor: colors.bg2, borderRadius: 14, padding: 14, marginBottom: 10, borderWidth: 1, borderColor: colors.border }}>
          <Text style={{ color: colors.text1, fontWeight: "700" }}>{j.title}</Text>
          <Text style={{ color: colors.text3, fontSize: 12, marginTop: 2 }}>{j.city} · {j.views.toLocaleString()} views · {j.applicants} applicants</Text>
        </View>
      ))}
      <Button title="+ Post a new job" onPress={() => router.push("/post")} style={{ marginTop: 10 }} />
    </ScrollView>
  );
}
