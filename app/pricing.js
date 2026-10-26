import { useState } from "react";
import { ScrollView, View, Text, Alert } from "react-native";
import { useApp } from "../src/context/AppContext";
import { PLANS } from "../src/data/jobs";
import Button from "../src/components/Button";
import Chip from "../src/components/Chip";

export default function Pricing() {
  const { colors } = useApp();
  const [billing, setBilling] = useState("monthly");
  return (
    <ScrollView style={{ backgroundColor: colors.bg }} contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
      <Text style={{ color: colors.text1, fontSize: 24, fontWeight: "800" }}>Simple pricing for agencies</Text>
      <Text style={{ color: colors.text2, marginVertical: 8 }}>Always free for workers.</Text>
      <View style={{ flexDirection: "row", marginBottom: 10 }}>
        <Chip label="Monthly" active={billing === "monthly"} onPress={() => setBilling("monthly")} />
        <Chip label="Annual (save 20%)" active={billing === "annual"} onPress={() => setBilling("annual")} />
      </View>
      {PLANS.map((p) => {
        const price = p.price[billing];
        return (
          <View key={p.name} style={{ backgroundColor: colors.bg2, borderRadius: 18, padding: 18, marginBottom: 14, borderWidth: 1.5, borderColor: p.featured ? colors.red : colors.border }}>
            <Text style={{ color: p.featured ? colors.red : colors.text3, fontSize: 11, fontWeight: "700", letterSpacing: 1 }}>{p.badge.toUpperCase()}</Text>
            <Text style={{ color: colors.text1, fontSize: 22, fontWeight: "800", marginTop: 4 }}>{p.name}</Text>
            <Text style={{ color: colors.text2, marginVertical: 6 }}>{p.desc}</Text>
            <Text style={{ color: colors.text1, fontSize: 32, fontWeight: "800" }}>
              {price === null ? "Custom" : `${price} zł`}<Text style={{ fontSize: 13, color: colors.text3 }}>{price ? " /mo" : ""}</Text>
            </Text>
            <View style={{ marginVertical: 12 }}>
              {p.features.map((f) => (
                <Text key={f.text} style={{ color: f.included ? colors.text1 : colors.text4, marginBottom: 5 }}>{f.included ? "✓" : "✕"}  {f.text}</Text>
              ))}
            </View>
            <Button title={p.cta} variant={p.ctaStyle === "primary" ? "primary" : "secondary"} onPress={() => Alert.alert(p.name, "Billing isn't connected yet — this is a demo.")} />
          </View>
        );
      })}
    </ScrollView>
  );
}
