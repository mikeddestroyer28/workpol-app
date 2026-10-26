import { useState } from "react";
import { ScrollView, View, Text, TextInput, Alert } from "react-native";
import { router } from "expo-router";
import { useApp } from "../src/context/AppContext";
import Button from "../src/components/Button";
import Chip from "../src/components/Chip";

export default function Auth() {
  const { colors, signIn } = useApp();
  const [mode, setMode] = useState("signin");
  const [role, setRole] = useState("worker");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const field = (label, val, set, props = {}) => (
    <View style={{ marginTop: 14 }}>
      <Text style={{ color: colors.text3, fontSize: 11, marginBottom: 6, letterSpacing: 1 }}>{label}</Text>
      <TextInput value={val} onChangeText={set} autoCapitalize="none" placeholderTextColor={colors.text3}
        style={{ backgroundColor: colors.bg3, color: colors.text1, borderRadius: 10, padding: 12, borderWidth: 1, borderColor: colors.border }} {...props} />
    </View>
  );

  const submit = () => {
    if (!email.includes("@") || password.length < 6 || (mode === "signup" && !name.trim())) {
      Alert.alert("Check your details", "Enter a valid email, a 6+ character password" + (mode === "signup" ? " and your name." : ".")); return;
    }
    // Demo only — no backend yet. Swap this for Supabase/Firebase auth later.
    signIn({ name: name.trim() || email.split("@")[0], email: email.trim(), role });
    router.back();
  };

  return (
    <ScrollView style={{ backgroundColor: colors.bg }} contentContainerStyle={{ padding: 16 }} keyboardShouldPersistTaps="handled">
      <View style={{ flexDirection: "row", marginBottom: 6 }}>
        <Chip label="Sign in" active={mode === "signin"} onPress={() => setMode("signin")} />
        <Chip label="Create account" active={mode === "signup"} onPress={() => setMode("signup")} />
      </View>
      {mode === "signup" && field("FULL NAME", name, setName, { autoCapitalize: "words" })}
      {field("EMAIL", email, setEmail, { keyboardType: "email-address" })}
      {field("PASSWORD", password, setPassword, { secureTextEntry: true })}
      {mode === "signup" && (
        <View style={{ flexDirection: "row", marginTop: 16 }}>
          <Chip label="I'm a worker" active={role === "worker"} onPress={() => setRole("worker")} />
          <Chip label="I'm an agency" active={role === "agency"} onPress={() => setRole("agency")} />
        </View>
      )}
      <Button title={mode === "signin" ? "Sign in" : "Create account"} size="lg" onPress={submit} style={{ marginTop: 22 }} />
      <Text style={{ color: colors.text3, fontSize: 12, marginTop: 14, textAlign: "center" }}>Demo auth — accounts are stored on this device only.</Text>
    </ScrollView>
  );
}
