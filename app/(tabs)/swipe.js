import { useState } from "react";
import { View, Text, Dimensions } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, { useSharedValue, useAnimatedStyle, withTiming, runOnJS, interpolate } from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import { useApp } from "../../src/context/AppContext";
import Tag from "../../src/components/Tag";
import Button from "../../src/components/Button";

const W = Dimensions.get("window").width;
const THRESH = 90;

function SwipeCard({ job, onSwipe }) {
  const { colors } = useApp();
  const x = useSharedValue(0);

  const pan = Gesture.Pan()
    .onUpdate((e) => { x.value = e.translationX; })
    .onEnd(() => {
      if (x.value > THRESH) { x.value = withTiming(W * 1.4, { duration: 220 }, () => runOnJS(onSwipe)("right")); }
      else if (x.value < -THRESH) { x.value = withTiming(-W * 1.4, { duration: 220 }, () => runOnJS(onSwipe)("left")); }
      else { x.value = withTiming(0); }
    });

  const card = useAnimatedStyle(() => ({ transform: [{ translateX: x.value }, { rotate: `${x.value * 0.0007}rad` }] }));
  const applyOp = useAnimatedStyle(() => ({ opacity: interpolate(x.value, [30, 110], [0, 1], "clamp") }));
  const passOp = useAnimatedStyle(() => ({ opacity: interpolate(x.value, [-110, -30], [1, 0], "clamp") }));

  return (
    <GestureDetector gesture={pan}>
      <Animated.View style={[{ position: "absolute", left: 0, right: 0, backgroundColor: colors.bg2, borderRadius: 22, borderWidth: 1, borderColor: colors.borderBright, padding: 20, minHeight: 440 }, card]}>
        <Animated.Text style={[{ position: "absolute", top: 18, left: 18, color: colors.red, borderColor: colors.red, borderWidth: 2, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4, fontWeight: "900", zIndex: 5 }, passOp]}>PASS</Animated.Text>
        <Animated.Text style={[{ position: "absolute", top: 18, right: 18, color: colors.green, borderColor: colors.green, borderWidth: 2, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4, fontWeight: "900", zIndex: 5 }, applyOp]}>APPLY</Animated.Text>

        <Text style={{ color: colors.text3, fontSize: 12, marginTop: 34 }}>● {job.agency}  ·  {job.posted}</Text>
        <Text style={{ color: colors.text1, fontSize: 26, fontWeight: "800", marginTop: 8 }}>{job.title}</Text>
        <Text style={{ color: colors.text2, marginVertical: 8 }}>📍 {job.city}, {job.region}</Text>
        <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
          <Tag label={job.schedule} />
          <Tag label={`Start: ${job.start}`} variant="gold" />
          {job.urgent && <Tag label="🔥 Urgent" variant="red" />}
        </View>
        <View style={{ flexDirection: "row", marginVertical: 16 }}>
          <View style={{ flex: 1 }}><Text style={{ color: colors.text3, fontSize: 11 }}>UNDER 26</Text><Text style={{ color: colors.red, fontSize: 28, fontWeight: "800" }}>{job.payU26}<Text style={{ fontSize: 13, color: colors.text3 }}> zł/h</Text></Text></View>
          <View style={{ flex: 1 }}><Text style={{ color: colors.text3, fontSize: 11 }}>26 AND OVER</Text><Text style={{ color: colors.text1, fontSize: 28, fontWeight: "800" }}>{job.pay26}<Text style={{ fontSize: 13, color: colors.text3 }}> zł/h</Text></Text></View>
        </View>
        <View style={{ flexDirection: "row", flexWrap: "wrap" }}>{job.docs.map((d) => <Tag key={d} label={d} />)}</View>
        <Text style={{ color: job.accommodation ? colors.green : colors.text3, marginTop: 10, fontWeight: "600" }}>
          {job.accommodation ? "🏠 Accommodation included" : "🏠 No accommodation provided"}
        </Text>
        <Text onPress={() => router.push(`/job/${job.id}`)} style={{ color: colors.red, marginTop: 14, fontWeight: "600" }}>Full details →</Text>
      </Animated.View>
    </GestureDetector>
  );
}

export default function Swipe() {
  const { colors, allJobs, markApplied, toggleSaved } = useApp();
  const deck = allJobs.slice(0, 6);
  const [idx, setIdx] = useState(0);
  const [applied, setApplied] = useState(0);
  const [run, setRun] = useState(0);

  const handle = (dir) => {
    const job = deck[idx];
    if (dir === "right") { markApplied(job.id); setApplied((a) => a + 1); Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {}); }
    else Haptics.selectionAsync().catch(() => {});
    setIdx((i) => i + 1);
  };
  const restart = () => { setIdx(0); setApplied(0); setRun((r) => r + 1); };

  if (idx >= deck.length) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.bg, alignItems: "center", justifyContent: "center", padding: 24 }}>
        <Text style={{ fontSize: 56 }}>🎯</Text>
        <Text style={{ color: colors.text1, fontSize: 24, fontWeight: "800", marginTop: 8 }}>All caught up!</Text>
        <Text style={{ color: colors.text2, marginVertical: 8 }}>You applied to {applied} job{applied === 1 ? "" : "s"}.</Text>
        <Button title="Start over" onPress={restart} style={{ marginTop: 10 }} />
      </View>
    );
  }

  const next = deck[idx + 1];
  return (
    <View style={{ flex: 1, backgroundColor: colors.bg, padding: 16 }}>
      <Text style={{ color: colors.text3, textAlign: "center", marginBottom: 12 }}>{idx + 1} of {deck.length}  ·  swipe right to apply, left to pass</Text>
      <View style={{ flex: 1 }}>
        {next && <View style={{ position: "absolute", left: 10, right: 10, top: 12, minHeight: 440, backgroundColor: colors.bg3, borderRadius: 22, borderWidth: 1, borderColor: colors.border }} />}
        <SwipeCard key={`${run}-${deck[idx].id}`} job={deck[idx]} onSwipe={handle} />
      </View>
      <View style={{ flexDirection: "row", gap: 10, paddingBottom: 8 }}>
        <Button title="✕ Pass" variant="ghost" style={{ flex: 1 }} onPress={() => handle("left")} />
        <Button title="★ Save" variant="secondary" style={{ flex: 1 }} onPress={() => { toggleSaved(deck[idx].id); handle("up"); }} />
        <Button title="✓ Apply" style={{ flex: 1 }} onPress={() => handle("right")} />
      </View>
    </View>
  );
}
