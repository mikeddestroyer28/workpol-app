import React from "react";
import { Pressable, Text, ActivityIndicator } from "react-native";
import { useApp } from "../context/AppContext";
export default function Button({ title, onPress, variant = "primary", size = "md", style, disabled, loading }) {
  const { colors } = useApp();
  const bg = variant === "primary" ? colors.red : variant === "secondary" ? colors.bg3 : "transparent";
  const border = variant === "ghost" ? colors.borderBright : variant === "secondary" ? colors.border : "transparent";
  const color = variant === "primary" ? "#fff" : colors.text1;
  const pv = size === "lg" ? 15 : size === "sm" ? 8 : 12;
  const ph = size === "lg" ? 26 : size === "sm" ? 14 : 20;
  return (
    <Pressable onPress={onPress} disabled={disabled || loading}
      style={({ pressed }) => [{ backgroundColor: bg, borderColor: border, borderWidth: variant === "primary" ? 0 : 1, paddingVertical: pv, paddingHorizontal: ph, borderRadius: 10, alignItems: "center", justifyContent: "center", opacity: disabled ? 0.5 : pressed ? 0.8 : 1 }, style]}>
      {loading ? <ActivityIndicator color={color} size="small" /> : <Text style={{ color, fontWeight: "600", fontSize: size === "lg" ? 15 : size === "sm" ? 12 : 14 }} numberOfLines={1}>{title}</Text>}
    </Pressable>
  );
}
