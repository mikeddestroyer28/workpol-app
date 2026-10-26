import { useState } from "react";
import { ScrollView, View, Text, TextInput, Switch, Alert } from "react-native";
import { router } from "expo-router";
import { useApp } from "../src/context/AppContext";
import { REGIONS, INDUSTRIES } from "../src/data/jobs";
import Button from "../src/components/Button";
import Chip from "../src/components/Chip";

export default function PostJob() {
  const { colors, addPostedJob, user } = useApp();
  const [f, setF] = useState({ title: "", agency: user?.name || "", city: "", schedule: "", payU26: "", pay26: "", description: "", docs: "Passport, Work permit (Zezwolenie)" });
  const [region, setRegion] = useState("Mazowieckie");
  const [industry, setIndustry] = useState("Warehouse");
  const [contract, setContract] = useState("Umowa zlecenie");
  const [accommodation, setAccommodation] = useState(false);
  const set = (k) => (v) => setF((p) => ({ ...p, [k]: v }));

  const input = (label, k, props = {}) => (
    <View style={{ marginTop: 14 }}>
      <Text style={{ color: colors.text3, fontSize: 11, marginBottom: 6, letterSpacing: 1 }}>{label}</Text>
      <TextInput value={f[k]} onChangeText={set(k)} placeholderTextColor={colors.text3}
        style={{ backgroundColor: colors.bg3, color: colors.text1, borderRadius: 10, padding: 12, borderWidth: 1, borderColor: colors.border }} {...props} />
    </View>
  );

  const submit = () => {
    if (!f.title.trim() || !f.agency.trim() || !f.city.trim() || !f.payU26 || !f.pay26) {
      Alert.alert("Missing info", "Title, agency, city and both pay rates are required."); return;
    }
    const icon = INDUSTRIES.find((i) => i.name === industry)?.icon || "💼";
    addPostedJob({
      title: f.title.trim(), agency: f.agency.trim(), agencyVerified: false, industry, industryIcon: icon, region, city: f.city.trim(),
      schedule: f.schedule || "To be confirmed", start: "Immediate", startTimestamp: new Date().toISOString().slice(0, 10),
      payU26: Number(f.payU26), pay26: Number(f.pay26), contract, accommodation, accommodationNote: accommodation ? "Details on request" : null,
      gender: "Any gender", docs: f.docs.split(",").map((d) => d.trim()).filter(Boolean), description: f.description || "No description provided.",
      highlights: [], urgent: false, featured: false,
    });
    Alert.alert("Job posted", "Your listing is now live.", [{ text: "OK", onPress: () => router.replace("/jobs") }]);
  };

  return (
    <ScrollView style={{ backgroundColor: colors.bg }} contentContainerStyle={{ padding: 16, paddingBottom: 50 }} keyboardShouldPersistTaps="handled">
      {input("JOB TITLE *", "title", { placeholder: "e.g. Warehouse Picker" })}
      {input("AGENCY NAME *", "agency")}
      {input("CITY *", "city")}
      {input("SCHEDULE", "schedule", { placeholder: "Mon–Fri, 08:00–16:00" })}
      <View style={{ flexDirection: "row", gap: 10 }}>
        <View style={{ flex: 1 }}>{input("PAY UNDER 26 (zł/h) *", "payU26", { keyboardType: "numeric" })}</View>
        <View style={{ flex: 1 }}>{input("PAY 26+ (zł/h) *", "pay26", { keyboardType: "numeric" })}</View>
      </View>
      <Text style={{ color: colors.text3, fontSize: 11, marginTop: 16, marginBottom: 8, letterSpacing: 1 }}>INDUSTRY</Text>
      <View style={{ flexDirection: "row", flexWrap: "wrap" }}>{INDUSTRIES.map((i) => <Chip key={i.name} label={`${i.icon} ${i.name}`} active={industry === i.name} onPress={() => setIndustry(i.name)} />)}</View>
      <Text style={{ color: colors.text3, fontSize: 11, marginVertical: 8, letterSpacing: 1 }}>REGION</Text>
      <View style={{ flexDirection: "row", flexWrap: "wrap" }}>{REGIONS.map((r) => <Chip key={r} label={r} active={region === r} onPress={() => setRegion(r)} />)}</View>
      <Text style={{ color: colors.text3, fontSize: 11, marginVertical: 8, letterSpacing: 1 }}>CONTRACT</Text>
      <View style={{ flexDirection: "row" }}>{["Umowa zlecenie", "Umowa o pracę"].map((c) => <Chip key={c} label={c} active={contract === c} onPress={() => setContract(c)} />)}</View>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 8 }}>
        <Text style={{ color: colors.text1 }}>🏠 Accommodation provided</Text>
        <Switch value={accommodation} onValueChange={setAccommodation} trackColor={{ true: colors.red }} />
      </View>
      {input("DOCUMENTS (comma separated)", "docs")}
      {input("DESCRIPTION", "description", { multiline: true, style: { minHeight: 90, textAlignVertical: "top", backgroundColor: colors.bg3, color: colors.text1, borderRadius: 10, padding: 12, borderWidth: 1, borderColor: colors.border } })}
      <Button title="Publish listing" size="lg" onPress={submit} style={{ marginTop: 22 }} />
    </ScrollView>
  );
}
