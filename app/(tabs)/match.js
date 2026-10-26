import { useState } from "react";
import { ScrollView, View, Text, ActivityIndicator } from "react-native";
import { router } from "expo-router";
import { useApp } from "../../src/context/AppContext";
import { REGIONS, INDUSTRIES } from "../../src/data/jobs";
import Chip from "../../src/components/Chip";
import Button from "../../src/components/Button";
import Tag from "../../src/components/Tag";
import { estMonthlyNet, formatZl } from "../../src/utils/pay";

export default function Match() {
  const { colors, allJobs, toggleSaved, savedIds } = useApp();
  const [age, setAge] = useState("Under 26");
  const [region, setRegion] = useState("Any region");
  const [industry, setIndustry] = useState("Any industry");
  const [minPay, setMinPay] = useState(22);
  const [accom, setAccom] = useState("Either");
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const run = () => {
    setLoading(true); setResults(null);
    setTimeout(() => {
      const isU26 = age === "Under 26";
      const scored = allJobs.map((job) => {
        let score = 40; const reasons = [];
        if (job.payU26 >= minPay) { score += 15; reasons.push("Pay matches"); }
        if (region === "Any region" || job.region === region) { score += 20; reasons.push("Your region"); }
        if (industry === "Any industry" || job.industry === industry) { score += 15; reasons.push("Industry fit"); }
        if (accom === "Required" && job.accommodation) { score += 20; reasons.push("Accommodation ✓"); }
        if (accom === "Own place" && !job.accommodation) score += 5;
        if (isU26) { score += 10; reasons.push("Tax-free U26"); }
        if (job.featured) { score += 5; reasons.push("Featured"); }
        score = Math.min(99, score);
        const monthly = estMonthlyNet(job.payU26, isU26);
        const explain = `${score >= 80 ? "Strong match" : "Partial match"} for your profile. ` +
          (isU26 ? `As a student under 26 you earn ${job.payU26} zł/h tax-free — ${job.payU26 - job.pay26} zł/h more than the standard rate. ` : "") +
          `Estimated monthly take-home: ~${formatZl(monthly)}.`;
        return { job, score, reasons, explain };
      }).sort((a, b) => b.score - a.score);
      setResults(scored); setLoading(false);
    }, 1000);
  };

  const L = ({ t }) => <Text style={{ color: colors.text3, fontSize: 11, marginTop: 14, marginBottom: 8, letterSpacing: 1 }}>{t}</Text>;
  const row = (opts, val, set) => <View style={{ flexDirection: "row", flexWrap: "wrap" }}>{opts.map((o) => <Chip key={o} label={o} active={val === o} onPress={() => set(o)} />)}</View>;

  return (
    <ScrollView style={{ backgroundColor: colors.bg }} contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
      <Text style={{ color: colors.text1, fontSize: 24, fontWeight: "800" }}>✨ AI Match</Text>
      <Text style={{ color: colors.text2, marginTop: 4 }}>Tell us what you need — we rank every job for you.</Text>
      <L t="YOUR AGE" />{row(["Under 26", "26 and over"], age, setAge)}
      <L t="REGION" />{row(["Any region", ...REGIONS.slice(0, 8)], region, setRegion)}
      <L t="INDUSTRY" />{row(["Any industry", ...INDUSTRIES.map((i) => i.name)], industry, setIndustry)}
      <L t={`MIN HOURLY PAY: ${minPay} zł`} />{row(["20", "22", "25", "28", "30"].map(String), String(minPay), (v) => setMinPay(Number(v)))}
      <L t="ACCOMMODATION" />{row(["Required", "Own place", "Either"], accom, setAccom)}
      <Button title="Find my matches ✨" size="lg" onPress={run} style={{ marginTop: 18 }} loading={loading} />

      {loading && <ActivityIndicator color={colors.red} style={{ marginTop: 24 }} />}
      {results && results.map(({ job, score, reasons, explain }) => (
        <View key={job.id} style={{ backgroundColor: colors.bg2, borderRadius: 16, borderWidth: 1, borderColor: colors.border, padding: 16, marginTop: 14 }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <View style={{ flex: 1 }}>
              <Text style={{ color: colors.text1, fontSize: 16, fontWeight: "700" }}>{job.title}</Text>
              <Text style={{ color: colors.text3, fontSize: 12 }}>{job.agency} · {job.city}</Text>
            </View>
            <Text style={{ color: colors.green, fontWeight: "800", fontSize: 18 }}>{score}%</Text>
          </View>
          <View style={{ height: 6, backgroundColor: colors.bg4, borderRadius: 3, marginVertical: 10 }}>
            <View style={{ height: 6, width: `${score}%`, backgroundColor: colors.green, borderRadius: 3 }} />
          </View>
          <View style={{ flexDirection: "row", flexWrap: "wrap" }}>{reasons.map((r) => <Tag key={r} label={`✓ ${r}`} variant="green" />)}</View>
          <Text style={{ color: colors.text2, fontSize: 13, lineHeight: 19, marginVertical: 8 }}>{explain}</Text>
          <View style={{ flexDirection: "row", gap: 8 }}>
            <Button title="View & Apply →" size="sm" style={{ flex: 1 }} onPress={() => router.push(`/job/${job.id}`)} />
            <Button title={savedIds.includes(job.id) ? "★ Saved" : "☆ Save"} size="sm" variant="ghost" onPress={() => toggleSaved(job.id)} />
          </View>
        </View>
      ))}
    </ScrollView>
  );
}
