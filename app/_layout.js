import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Stack } from "expo-router";
import { AppProvider, useApp } from "../src/context/AppContext";

function RootStack() {
  const { colors, resolvedMode } = useApp();
  return (
    <>
      <StatusBar style={resolvedMode === "light" ? "dark" : "light"} />
      <Stack screenOptions={{ headerStyle: { backgroundColor: colors.bg2 }, headerTintColor: colors.text1, contentStyle: { backgroundColor: colors.bg } }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="job/[id]" options={{ title: "Job details" }} />
        <Stack.Screen name="post" options={{ title: "Post a Job", presentation: "modal" }} />
        <Stack.Screen name="dashboard" options={{ title: "Agency Dashboard" }} />
        <Stack.Screen name="alerts" options={{ title: "Job Alerts" }} />
        <Stack.Screen name="pricing" options={{ title: "Pricing" }} />
        <Stack.Screen name="auth" options={{ title: "Sign in", presentation: "modal" }} />
      </Stack>
    </>
  );
}
export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AppProvider><RootStack /></AppProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
