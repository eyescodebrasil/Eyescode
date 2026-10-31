import {
  View,
  Text,
  Pressable,
  StyleSheet,
} from "react-native";

import {
  Ionicons,
} from "@expo/vector-icons";

import { colors } from "../../theme/colors";


export default function FeaturedLives() {
  return (
    <View style={styles.wrapper}>

      <View style={styles.card}>

        <View style={styles.liveIcon}>
          <Ionicons
            name="radio-outline"
            size={28}
            color={colors.primary}
          />
        </View>


        <Text style={styles.title}>
          Nenhuma live acontecendo agora
        </Text>


        <Text style={styles.description}>
          A comunidade está offline no momento.
          {"\n"}
          Explore outras lives ou volte daqui a pouco.
        </Text>


        <Pressable
          style={({ pressed }) => [
            styles.button,
            pressed && styles.buttonPressed,
          ]}
        >
          <Ionicons
            name="play"
            size={17}
            color="#ffffff"
          />

          <Text style={styles.buttonText}>
            Explorar lives
          </Text>
        </Pressable>

      </View>

    </View>
  );
}


const styles = StyleSheet.create({

  wrapper: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },


  card: {
    minHeight: 230,

    paddingHorizontal: 24,
    paddingVertical: 28,

    alignItems: "center",
    justifyContent: "center",

    backgroundColor: "#070d21",

    borderWidth: 1,
    borderColor: "#1d355d",

    borderRadius: 24,

    shadowColor: colors.primary,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.09,
    shadowRadius: 18,

    elevation: 3,
  },


  liveIcon: {
    width: 58,
    height: 44,

    alignItems: "center",
    justifyContent: "center",

    marginBottom: 18,

    backgroundColor:
      "rgba(56, 189, 248, 0.08)",

    borderWidth: 1,
    borderColor:
      "rgba(56, 189, 248, 0.45)",

    borderRadius: 22,
  },


  title: {
    color: colors.text,

    fontSize: 20,
    lineHeight: 26,
    fontWeight: "800",

    textAlign: "center",

    marginBottom: 10,
  },


  description: {
    color: colors.textMuted,

    fontSize: 14,
    lineHeight: 21,

    textAlign: "center",

    marginBottom: 22,
  },


  button: {
    minWidth: 164,
    height: 46,

    paddingHorizontal: 20,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",

    gap: 8,

    backgroundColor: "#2563eb",

    borderRadius: 23,

    shadowColor: "#2563eb",
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.25,
    shadowRadius: 10,

    elevation: 4,
  },


  buttonPressed: {
    opacity: 0.8,

    transform: [
      {
        scale: 0.97,
      },
    ],
  },


  buttonText: {
    color: "#ffffff",

    fontSize: 15,
    fontWeight: "800",
  },

});