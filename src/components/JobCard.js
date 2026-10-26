import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { router } from "expo-router";
import { useApp } from "../context/AppContext";
import Tag from "./Tag";
import Button from "./Button";
import { estMonthlyNet, formatZl } from "../utils/pay";

export default function JobCard({ job }) {
  const { colors } = useApp();
  const go = () => router.push(`/job/${job.id}`);
  return (
    <Pressable onPress={go} style={[s.card, { backgroundColor: colors.bg2, borderColor: job.featured ? colors.gold : colors.border }]}>
      <View style={{ flexDirection: "row", marginBottom: 10 }}>
        <View style={{ flex: 1 }}>
          <Text style={{ color: colors.text1, fontSize: 16, fontWeight: "700", marginBottom: 4 }}>{job.title}</Text>
          <Text style={{ color: colors.text3, fontSize: 12 }}>
            {job.industryIcon}  {job.agency}{job.agencyVerified ? "  ✓ Verified" : ""}
          </Text>
        </View>
        {job.urgent && <Text style={{ color: colors.red, fontSize: 11, fontWeight: "700" }}>🔥 Urgent</Text>}
      </View>
      <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
        <Tag label={`📍 ${job.city}, ${job.region}`} variant="blue" />
        <Tag label={job.schedule} />
        <Tag label={`Start: ${job.start}`} variant="gold" />
        {job.featured && <Tag label="⭐ Featured" variant="violet" />}
        <Tag label={job.accommodation ? "🏠 Accommodation ✓" : "🏠 None"} variant={job.accommodation ? "green" : "default"} />
      </View>
      <View style={[s.pay, { borderColor: colors.border }]}>
        <Block label="Under 26" val={`${job.payU26} zł/h`} note="Tax-free (PIT-0)" c={colors.red} colors={colors} />
        <Block label="26 and over" val={`${job.pay26} zł/h`} note="Standard rate" c={colors.text1} colors={colors} />
        <Block label="Est. monthly" val={formatZl(estMonthlyNet(job.payU26))} note="40h/wk take-home" c={colors.red} colors={colors} />
      </View>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
        <Text style={{ color: colors.text3, fontSize: 11 }}>Posted {job.posted} · {job.views.toLocaleString()} views</Text>
        <Button title="View & Apply →" size="sm" onPress={go} />
      </View>
    </Pressable>
  );
}
function Block({ label, val, note, c, colors }) {
  return (
    <View style={{ flex: 1, alignItems: "center" }}>
      <Text style={{ color: colors.text3, fontSize: 10, textTransform: "uppercase" }}>{label}</Text>
      <Text style={{ color: c, fontSize: 15, fontWeight: "700", marginVertical: 2 }}>{val}</Text>
      <Text style={{ color: colors.text3, fontSize: 9 }}>{note}</Text>
    </View>
  );
}
const s = StyleSheet.create({
  card: { borderRadius: 16, borderWidth: 1, padding: 16, marginBottom: 14 },
  pay: { flexDirection: "row", borderTopWidth: StyleSheet.hairlineWidth, borderBottomWidth: StyleSheet.hairlineWidth, paddingVertical: 10, marginVertical: 8 },
});
