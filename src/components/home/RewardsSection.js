import {
  View,
  Text,
  ScrollView,
  StyleSheet,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

import { colors } from "../../theme/colors";

const rewards = [
  {
    id: "1",
    day: "Dia 1",
    icon: "flash-outline",
    xp: "+200 XP",
    completed: true,
  },
  {
    id: "2",
    day: "Dia 2",
    icon: "star-outline",
    xp: "+800 XP",
    completed: true,
  },
  {
    id: "3",
    day: "Dia 3",
    icon: "flame-outline",
    xp: "+800 XP",
    completed: false,
  },
];

export default function RewardsSection() {
  return (
    <View style={styles.section}>

   <View style={styles.header}>
  <View style={styles.titleRow}>

    <View style={styles.iconBox}>
      <Ionicons
        name="gift-outline"
        size={20}
        color={colors.primary}
      />
    </View>

    <Text style={styles.title}>
      Recompensas
    </Text>

  </View>
</View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {rewards.map((reward) => (
   <View
  key={reward.id}
  style={[
    styles.card,
    reward.completed && styles.cardCompleted,
  ]}
>
  <View style={styles.cardTop}>
    <Text style={styles.day}>
      {reward.day}
    </Text>

    {reward.completed && (
      <View style={styles.completedBadge}>
        <Ionicons
          name="checkmark"
          size={12}
          color={colors.primary}
        />
      </View>
    )}
  </View>

  <View
    style={[
      styles.rewardIconBox,
      reward.completed &&
        styles.rewardIconBoxCompleted,
    ]}
  >
    <Ionicons
      name={reward.icon}
      size={30}
      color={
        reward.completed
          ? colors.primary
          : colors.text
      }
    />
  </View>

  <Text style={styles.xp}>
    {reward.xp}
  </Text>

  <View style={styles.statusRow}>
    <Ionicons
      name={
        reward.completed
          ? "checkmark-circle"
          : "lock-closed-outline"
      }
      size={14}
      color={
        reward.completed
          ? colors.primary
          : colors.textMuted
      }
    />

    <Text
      style={[
        styles.status,
        reward.completed &&
          styles.statusCompleted,
      ]}
    >
      {reward.completed
        ? "Coletado"
        : "Bloqueado"}
    </Text>
  </View>
</View>
))}
      </ScrollView>

    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    paddingTop: 30,
  },

  header: {
    paddingHorizontal: 14,
    marginBottom: 16,
  },

  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  title: {
  color: colors.text,
  fontSize: 23,
  fontWeight: "800",
},

  content: {
    paddingHorizontal: 14,
    gap: 12,
  },

  card: {
  width: 150,
  height: 210,

  padding: 14,

  justifyContent: "space-between",

  backgroundColor: colors.surface,

  borderWidth: 1,
  borderColor: colors.border,

  borderRadius: 20,
},

cardCompleted: {
  borderColor:
    "rgba(56, 189, 248, 0.24)",

  backgroundColor:
    "rgba(17, 24, 32, 0.96)",
},

cardTop: {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
},

day: {
  color: colors.textMuted,
  fontSize: 14,
  fontWeight: "700",
},

completedBadge: {
  width: 22,
  height: 22,

  borderRadius: 11,

  alignItems: "center",
  justifyContent: "center",

  backgroundColor:
    "rgba(56, 189, 248, 0.09)",
},

rewardIconBox: {
  width: 62,
  height: 62,

  alignSelf: "center",

  alignItems: "center",
  justifyContent: "center",

  borderRadius: 20,

  backgroundColor:
    "rgba(148, 163, 184, 0.05)",

  borderWidth: 1,
  borderColor:
    "rgba(148, 163, 184, 0.08)",
},

rewardIconBoxCompleted: {
  backgroundColor:
    "rgba(56, 189, 248, 0.08)",

  borderColor:
    "rgba(56, 189, 248, 0.20)",
},

xp: {
  color: colors.text,

  fontSize: 18,
  fontWeight: "800",

  textAlign: "center",
},

statusRow: {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",

  gap: 5,
},

status: {
  color: colors.textMuted,

  fontSize: 12,
  fontWeight: "700",
},

statusCompleted: {
  color: colors.primary,
},
});