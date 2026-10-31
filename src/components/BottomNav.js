import {
  View,
  Text,
  Pressable,
  StyleSheet,
} from "react-native";

import { colors } from "../theme/colors";

const items = [
  {
    key: "home",
    label: "Home",
    icon: "⌂",
  },
  {
    key: "feed",
    label: "Feed",
    icon: "▦",
  },
  {
    key: "lives",
    label: "Lives",
    icon: "▶",
  },
  {
    key: "communities",
    label: "Comunidades",
    icon: "◉",
  },
  {
    key: "profile",
    label: "Perfil",
    icon: "●",
  },
];

export default function BottomNav({
  activeScreen,
  onNavigate,
}) {
  return (
    <View style={styles.container}>
      {items.map((item) => {
        const active =
          activeScreen === item.key;

        return (
          <Pressable
            key={item.key}
            style={({ pressed }) => [
              styles.item,
              pressed && styles.pressed,
            ]}
            onPress={() =>
              onNavigate(item.key)
            }
          >
            <Text
              style={[
                styles.icon,
                active && styles.active,
              ]}
            >
              {item.icon}
            </Text>

            <Text
              style={[
                styles.label,
                active && styles.active,
              ]}
              numberOfLines={1}
            >
              {item.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",

    backgroundColor: colors.surface,

    borderTopWidth: 1,
    borderTopColor: colors.border,

    paddingTop: 8,
    minHeight: 64,
  },

  item: {
    flex: 1,

    alignItems: "center",
    justifyContent: "center",

    paddingVertical: 4,
  },

  pressed: {
    opacity: 0.65,
  },

  icon: {
    color: colors.textMuted,
    fontSize: 22,
    lineHeight: 25,
  },

  label: {
    color: colors.textMuted,

    marginTop: 2,

    fontSize: 10,
    fontWeight: "600",
  },

  active: {
    color: colors.primary,
  },
});