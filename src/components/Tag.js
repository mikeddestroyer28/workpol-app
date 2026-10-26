import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useApp } from "../context/AppContext";
const MAP = { blue: "electric", gold: "gold", green: "green", violet: "violet", red: "red" };
export default function Tag({ label, variant = "default" }) {
  const { colors } = useApp();
  const k = MAP[variant];
  const bg = k ? colors[k + "Soft"] || colors.redGlow : colors.bg3;
  return (
    <View style={[s.tag, { backgroundColor: bg, borderColor: colors.border }]}>
      <Text style={{ color: k ? colors[k] : colors.text2, fontSize: 11, fontWeight: "600" }} numberOfLines={1}>{label}</Text>
    </View>
  );
}
const s = StyleSheet.create({ tag: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8, borderWidth: StyleSheet.hairlineWidth, marginRight: 6, marginBottom: 6 } });
