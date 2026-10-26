import { ScrollView, View, Text, Alert } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import * as Haptics from "expo-haptics";
import { useApp } from "../../src/context/AppContext";
import Tag from "../../src/components/Tag";
import Button from "../../src/components/Button";
import { estMonthlyNet, formatZl } from "../../src/utils/pay";

export default function JobDetail() {
  const { id } = useLocalSearchParams();
  const { colors, allJobs, savedIds, toggleSaved, appliedIds, markApplied } = useApp();
  const job = allJobs.find((j) => String(j.id) === String(id));
  if (!job) return <View style={{ flex: 1, backgroundColor: colors.bg, padding: 20 }}><Text style={{ color: colors.text1 }}>Job not found.</Text></View>;

  const saved = savedIds.includes(job.id);
  const applied = appliedIds.includes(job.id);
  const apply = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    markApplied(job.id);
    Alert.alert("Applied!", "The agency will be in touch.");
  };
  const Row = ({ k, v }) => (
    <View style={{ flexDirection: "row", paddingVertical: 8, borderBottomWidth: 0.5, borderColor: colors.border }}>
      <Text style={{ color: colors.text3, width: 110 }}>{k}</Text>
      <Text style={{ color: colors.text1, flex: 1 }}>{v}</Text>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 120 }}>
        <Text style={{ color: colors.text1, fontSize: 24, fontWeight: "800" }}>{job.title}</Text>
        <Text style={{ color: colors.text3, marginVertical: 6 }}>{job.industryIcon}  {job.agency}{job.agencyVerified ? "  ✓ Verified" : "  (unverified)"}</Text>
        <View style={{ flexDirection: "row", flexWrap: "wrap", marginTop: 6 }}>
          <Tag label={`📍 ${job.city}, ${job.region}`} variant="blue" />
          {job.urgent && <Tag label="🔥 Urgent" variant="red" />}
          {job.featured && <Tag label="⭐ Featured" variant="violet" />}
          <Tag label={job.accommodation ? "🏠 Accommodation ✓" : "🏠 No accommodation"} variant={job.accommodation ? "green" : "default"} />
        </View>

        <View style={{ flexDirection: "row", backgroundColor: colors.bg2, borderRadius: 14, padding: 14, marginVertical: 14, borderWidth: 1, borderColor: colors.border }}>
          {[["Under 26", `${job.payU26} zł/h`, colors.red], ["26+", `${job.pay26} zł/h`, colors.text1], ["Est. monthly", formatZl(estMonthlyNet(job.payU26)), colors.red]].map(([l, v, c]) => (
            <View key={l} style={{ flex: 1, alignItems: "center" }}>
              <Text style={{ color: colors.text3, fontSize: 11 }}>{l}</Text>
              <Text style={{ color: c, fontSize: 18, fontWeight: "800" }}>{v}</Text>
            </View>
          ))}
        </View>

        <Text style={{ color: colors.text2, lineHeight: 22, marginBottom: 14 }}>{job.description}</Text>

        <Row k="Schedule" v={job.schedule} />
        <Row k="Start" v={job.start} />
        <Row k="Contract" v={job.contract} />
        <Row k="Gender" v={job.gender} />
        {job.accommodationNote ? <Row k="Accommodation" v={job.accommodationNote} /> : null}
        <Row k="Applicants" v={`${job.applicants} · ${job.views.toLocaleString()} views`} />

        <Text style={{ color: colors.text1, fontWeight: "700", fontSize: 16, marginTop: 18, marginBottom: 8 }}>Documents needed</Text>
        <View style={{ flexDirection: "row", flexWrap: "wrap" }}>{job.docs.map((d) => <Tag key={d} label={d} />)}</View>

        <Text style={{ color: colors.text1, fontWeight: "700", fontSize: 16, marginTop: 14, marginBottom: 8 }}>Highlights</Text>
        {job.highlights.map((h) => <Text key={h} style={{ color: colors.green, marginBottom: 4 }}>✓ {h}</Text>)}
      </ScrollView>

      <View style={{ position: "absolute", bottom: 0, left: 0, right: 0, flexDirection: "row", gap: 10, padding: 16, paddingBottom: 28, backgroundColor: colors.bg2, borderTopWidth: 1, borderColor: colors.border }}>
        <Button title={saved ? "★ Saved" : "☆ Save"} variant="secondary" onPress={() => toggleSaved(job.id)} style={{ flex: 1 }} />
        <Button title={applied ? "Applied ✓" : "Apply now →"} onPress={apply} disabled={applied} style={{ flex: 2 }} />
      </View>
    </View>
  );
}
