import {
  View,
  Text,
  Pressable,
  StyleSheet,
} from "react-native";

import {
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";

import { colors } from "../../theme/colors";


const actions = [
  {
    id: "friends",
    label: "Amigos",
    library: "ionicons",
    icon: "people-outline",
  },
  {
    id: "store",
    label: "Store",
    library: "ionicons",
    icon: "storefront-outline",
  },
  {
    id: "competition",
    label: "Competição",
    library: "material",
    icon: "trophy-outline",
  },
];


export default function HomeQuickActions() {
  return (
    <View style={styles.container}>
      {actions.map((action) => (
        <Pressable
          key={action.id}
          style={({ pressed }) => [
            styles.action,
            pressed && styles.actionPressed,
          ]}
        >
          <View style={styles.iconContainer}>
            {action.library === "ionicons" ? (
              <Ionicons
                name={action.icon}
                size={20}
                color={colors.primary}
              />
            ) : (
              <MaterialCommunityIcons
                name={action.icon}
                size={20}
                color={colors.primary}
              />
            )}
          </View>

          <Text
            style={styles.label}
            numberOfLines={1}
          >
            {action.label}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 10,

    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 16,
  },

  action: {
    flex: 1,
    height: 52,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",

    gap: 8,

    backgroundColor: colors.surface,

    borderWidth: 1,
    borderColor: colors.border,

    borderRadius: 16,
  },

  actionPressed: {
    opacity: 0.72,
    transform: [
      {
        scale: 0.97,
      },
    ],
  },

  iconContainer: {
    width: 26,
    height: 26,

    alignItems: "center",
    justifyContent: "center",

    backgroundColor:
      "rgba(56, 189, 248, 0.09)",

    borderRadius: 8,
  },

  label: {
    color: colors.text,

    fontSize: 14,
    fontWeight: "700",
  },
});