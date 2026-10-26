import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useApp } from "../../src/context/AppContext";
const ICONS = { index: "home", jobs: "briefcase", match: "sparkles", swipe: "layers", profile: "person" };
export default function TabsLayout() {
  const { colors } = useApp();
  return (
    <Tabs screenOptions={({ route }) => ({
      headerStyle: { backgroundColor: colors.bg2 }, headerTintColor: colors.text1,
      tabBarStyle: { backgroundColor: colors.bg2, borderTopColor: colors.border },
      tabBarActiveTintColor: colors.red, tabBarInactiveTintColor: colors.text3,
      tabBarIcon: ({ color, size }) => <Ionicons name={ICONS[route.name]} size={size} color={color} />,
    })}>
      <Tabs.Screen name="index" options={{ title: "Home", headerTitle: "WorkPol" }} />
      <Tabs.Screen name="jobs" options={{ title: "Jobs", headerTitle: "All Jobs" }} />
      <Tabs.Screen name="match" options={{ title: "AI Match", headerTitle: "AI Match" }} />
      <Tabs.Screen name="swipe" options={{ title: "Swipe", headerTitle: "Swipe to Apply" }} />
      <Tabs.Screen name="profile" options={{ title: "Profile", headerTitle: "Profile" }} />
    </Tabs>
  );
}
