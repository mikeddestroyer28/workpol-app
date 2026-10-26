import { useState } from "react";
import { ScrollView, View, Text, TextInput } from "react-native";
import { useApp } from "../src/context/AppContext";
import { REGIONS, INDUSTRIES } from "../src/data/jobs";
import Button from "../src/components/Button";
import Chip from "../src/components/Chip";

export default function Alerts() {
  const { colors, alerts, addAlert, removeAlert } = useApp();
  const [keyword, setKeyword] = useState("");
  const [region, setRegion] = useState("Any region");
  const [industry, setIndustry] = useState("Any industry");

  const create = () => { addAlert({ keyword: keyword.trim(), region, industry }); setKeyword(""); };

  return (
    <ScrollView style={{ backgroundColor: colors.bg }} contentContainerStyle={{ padding: 16, paddingBottom: 40 }} keyboardShouldPersistTaps="handled">
      <Text style={{ color: colors.text1, fontSize: 20, fontWeight: "800", marginBottom: 10 }}>New alert</Text>
      <TextInput value={keyword} onChangeText={setKeyword} placeholder="Keyword (optional)" placeholderTextColor={colors.text3}
        style={{ backgroundColor: colors.bg3, color: colors.text1, borderRadius: 10, padding: 12, borderWidth: 1, borderColor: colors.border }} />
      <Text style={{ color: colors.text3, fontSize: 11, marginVertical: 10, letterSpacing: 1 }}>REGION</Text>
      <View style={{ flexDirection: "row", flexWrap: "wrap" }}>{["Any region", ...REGIONS.slice(0, 8)].map((r) => <Chip key={r} label={r} active={region === r} onPress={() => setRegion(r)} />)}</View>
      <Text style={{ color: colors.text3, fontSize: 11, marginVertical: 10, letterSpacing: 1 }}>INDUSTRY</Text>
      <View style={{ flexDirection: "row", flexWrap: "wrap" }}>{["Any industry", ...INDUSTRIES.map((i) => i.name)].map((i) => <Chip key={i} label={i} active={industry === i} onPress={() => setIndustry(i)} />)}</View>
      <Button title="Create alert" onPress={create} style={{ marginTop: 10 }} />

      <Text style={{ color: colors.text1, fontSize: 18, fontWeight: "700", marginTop: 28, marginBottom: 10 }}>Your alerts ({alerts.length})</Text>
      {alerts.length === 0 && <Text style={{ color: colors.text3 }}>No alerts yet.</Text>}
      {alerts.map((a) => (
        <View key={a.id} style={{ flexDirection: "row", alignItems: "center", backgroundColor: colors.bg2, borderRadius: 14, padding: 14, marginBottom: 10, borderWidth: 1, borderColor: colors.border }}>
          <View style={{ flex: 1 }}>
            <Text style={{ color: colors.text1, fontWeight: "700" }}>🔔 {a.keyword || "Any job"}</Text>
            <Text style={{ color: colors.text3, fontSize: 12 }}>{a.region} · {a.industry}</Text>
          </View>
          <Button title="Remove" size="sm" variant="ghost" onPress={() => removeAlert(a.id)} />
        </View>
      ))}
    </ScrollView>
  );
}
