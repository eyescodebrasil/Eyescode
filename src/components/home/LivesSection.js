import {
  View,
  Text,
  Pressable,
  StyleSheet,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

import { colors } from "../../theme/colors";


export default function LivesSection() {
  return (
    <View style={styles.section}>

      <View style={styles.header}>

        <View style={styles.titleRow}>

          <View style={styles.iconBox}>
            <Ionicons
              name="radio-outline"
              size={20}
              color={colors.primary}
            />
          </View>

          <Text style={styles.title}>
            Lives
          </Text>

        </View>


        <Pressable
          style={({ pressed }) => [
            styles.seeAllButton,
            pressed && styles.pressed,
          ]}
        >
          <Text style={styles.seeAllText}>
            Ver tudo
          </Text>

          <Ionicons
            name="chevron-forward"
            size={18}
            color={colors.primary}
          />
        </Pressable>

      </View>


      <View style={styles.emptyState}>

        <Ionicons
          name="videocam-outline"
          size={20}
          color={colors.textMuted}
        />

        <Text style={styles.emptyText}>
          Nenhuma live acontecendo agora.
        </Text>

      </View>

    </View>
  );
}


const styles = StyleSheet.create({

  section: {
    paddingHorizontal: 16,
    paddingTop: 28,
  },


  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",

    marginBottom: 14,
  },


  titleRow: {
    flexDirection: "row",
    alignItems: "center",

    gap: 10,
  },


  iconBox: {
    width: 34,
    height: 34,

    alignItems: "center",
    justifyContent: "center",

    backgroundColor:
      "rgba(56, 189, 248, 0.08)",

    borderRadius: 10,
  },


  title: {
    color: colors.text,

    fontSize: 23,
    fontWeight: "800",
  },


  seeAllButton: {
    flexDirection: "row",
    alignItems: "center",

    gap: 3,

    minHeight: 36,
  },


  seeAllText: {
    color: colors.primary,

    fontSize: 14,
    fontWeight: "700",
  },


  emptyState: {
    minHeight: 54,

    flexDirection: "row",
    alignItems: "center",

    gap: 9,

    paddingHorizontal: 14,

    backgroundColor:
      "rgba(255, 255, 255, 0.018)",

    borderWidth: 1,
    borderColor:
      "rgba(148, 163, 184, 0.08)",

    borderRadius: 14,
  },


  emptyText: {
    color: colors.textMuted,

    fontSize: 14,
  },


  pressed: {
    opacity: 0.6,
  },

});