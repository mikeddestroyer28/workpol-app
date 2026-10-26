import { useState, useMemo } from "react";
import { View, Text, TextInput, FlatList, Modal, ScrollView, Switch } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useApp } from "../../src/context/AppContext";
import { REGIONS, INDUSTRIES } from "../../src/data/jobs";
import JobCard from "../../src/components/JobCard";
import Chip from "../../src/components/Chip";
import Button from "../../src/components/Button";

export default function Jobs() {
  const { colors, allJobs } = useApp();
  const params = useLocalSearchParams();
  const [query, setQuery] = useState(typeof params.q === "string" ? params.q : "");
  const [regions, setRegions] = useState([]);
  const [industries, setIndustries] = useState([]);
  const [accom, setAccom] = useState(false);
  const [minPay, setMinPay] = useState(18);
  const [open, setOpen] = useState(false);

  const toggle = (arr, set, v) => set(arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);

  const jobs = useMemo(() => allJobs.filter((j) => {
    if (query) {
      const q = query.toLowerCase();
      if (![j.title, j.industry, j.city, j.agency].some((f) => f.toLowerCase().includes(q))) return false;
    }
    if (regions.length && !regions.includes(j.region)) return false;
    if (industries.length && !industries.includes(j.industry)) return false;
    if (j.payU26 < minPay) return false;
    if (accom && !j.accommodation) return false;
    return true;
  }), [allJobs, query, regions, industries, accom, minPay]);

  const activeCount = regions.length + industries.length + (accom ? 1 : 0) + (minPay > 18 ? 1 : 0);
  const reset = () => { setRegions([]); setIndustries([]); setAccom(false); setMinPay(18); setQuery(""); };

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <View style={{ flexDirection: "row", padding: 12, gap: 8 }}>
        <TextInput value={query} onChangeText={setQuery} placeholder="Search title, city, agency..." placeholderTextColor={colors.text3}
          style={{ flex: 1, backgroundColor: colors.bg3, color: colors.text1, borderRadius: 10, paddingHorizontal: 14, borderWidth: 1, borderColor: colors.border }} />
        <Button title={`Filters${activeCount ? ` (${activeCount})` : ""}`} variant="secondary" onPress={() => setOpen(true)} />
      </View>
      <Text style={{ color: colors.text3, paddingHorizontal: 16, marginBottom: 6 }}><Text style={{ fontWeight: "700", color: colors.text1 }}>{jobs.length}</Text> jobs found</Text>
      <FlatList
        data={jobs} keyExtractor={(j) => String(j.id)} renderItem={({ item }) => <JobCard job={item} />}
        contentContainerStyle={{ padding: 16, paddingTop: 6 }}
        ListEmptyComponent={<View style={{ alignItems: "center", padding: 40 }}><Text style={{ color: colors.text3, marginBottom: 12 }}>No jobs match your filters.</Text><Button title="Clear filters" variant="ghost" onPress={reset} /></View>}
      />
      <Modal visible={open} animationType="slide" onRequestClose={() => setOpen(false)}>
        <View style={{ flex: 1, backgroundColor: colors.bg, paddingTop: 50 }}>
          <ScrollView contentContainerStyle={{ padding: 16 }}>
            <Text style={{ color: colors.text1, fontSize: 22, fontWeight: "800", marginBottom: 16 }}>Filters</Text>
            <Text style={{ color: colors.text3, marginBottom: 8 }}>REGION</Text>
            <View style={{ flexDirection: "row", flexWrap: "wrap" }}>{REGIONS.map((r) => <Chip key={r} label={r} active={regions.includes(r)} onPress={() => toggle(regions, setRegions, r)} />)}</View>
            <Text style={{ color: colors.text3, marginVertical: 8 }}>INDUSTRY</Text>
            <View style={{ flexDirection: "row", flexWrap: "wrap" }}>{INDUSTRIES.map((i) => <Chip key={i.name} label={`${i.icon} ${i.name}`} active={industries.includes(i.name)} onPress={() => toggle(industries, setIndustries, i.name)} />)}</View>
            <Text style={{ color: colors.text3, marginVertical: 8 }}>MIN PAY (U26): {minPay} zł/h</Text>
            <View style={{ flexDirection: "row", flexWrap: "wrap" }}>{[18, 22, 25, 28, 30].map((p) => <Chip key={p} label={`${p}+ zł`} active={minPay === p} onPress={() => setMinPay(p)} />)}</View>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 12 }}>
              <Text style={{ color: colors.text1 }}>🏠 Accommodation included only</Text>
              <Switch value={accom} onValueChange={setAccom} trackColor={{ true: colors.red }} />
            </View>
          </ScrollView>
          <View style={{ flexDirection: "row", gap: 10, padding: 16, paddingBottom: 30 }}>
            <Button title="Reset" variant="ghost" style={{ flex: 1 }} onPress={reset} />
            <Button title={`Show ${jobs.length} jobs`} style={{ flex: 2 }} onPress={() => setOpen(false)} />
          </View>
        </View>
      </Modal>
    </View>
  );
}
