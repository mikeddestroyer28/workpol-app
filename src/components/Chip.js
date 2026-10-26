import React from "react";
import { Pressable, Text } from "react-native";
import { useApp } from "../context/AppContext";
export default function Chip({ label, active, onPress }) {
  const { colors } = useApp();
  return (
    <Pressable onPress={onPress} style={{ paddingHorizontal: 12, paddingVertical: 7, borderRadius: 20, borderWidth: 1, marginRight: 8, marginBottom: 8, backgroundColor: active ? colors.red : colors.bg3, borderColor: active ? colors.red : colors.border }}>
      <Text style={{ color: active ? "#fff" : colors.text2, fontSize: 12, fontWeight: "600" }}>{label}</Text>
    </Pressable>
  );
}
