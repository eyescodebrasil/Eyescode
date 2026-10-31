import {
  View,
  Text,
  Image,
  ScrollView,
  Pressable,
  StyleSheet,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

import { colors } from "../../theme/colors";

const communities = [
  {
    id: "1",
    name: "Produtos E...",
    initial: "P",
    avatar: null,
  },
  {
    id: "2",
    name: "Noticias",
    initial: "N",
    avatar: null,
  },
  {
    id: "3",
    name: "Eyescode",
    initial: "E",
    avatar: null,
  },
];

export default function CommunitiesSection() {
  return (
    <View style={styles.section}>

      <View style={styles.header}>
        <View style={styles.titleRow}>

          <View style={styles.iconBox}>
            <Ionicons
              name="game-controller-outline"
              size={20}
              color={colors.primary}
            />
          </View>

          <Text style={styles.title}>
            Comunidades
          </Text>

        </View>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {communities.map((community) => (
          <Pressable
            key={community.id}
            style={({ pressed }) => [
              styles.item,
              pressed && styles.pressed,
            ]}
          >
 <View style={styles.avatarOuter}>
  <View style={styles.avatar}>
    {community.avatar ? (
      <Image
        source={{ uri: community.avatar }}
        style={styles.avatarImage}
      />
    ) : (
      <Text style={styles.initial}>
        {community.initial}
      </Text>
    )}
  </View>
</View>

            <Text
              style={styles.name}
              numberOfLines={1}
            >
              {community.name}
            </Text>
          </Pressable>
        ))}

        <Pressable
          style={({ pressed }) => [
            styles.item,
            pressed && styles.pressed,
          ]}
        >
          <View style={styles.searchCircle}>
        <Ionicons
  name="search-outline"
  size={26}
  color={colors.primary}
/>
          </View>

          <Text style={styles.searchLabel}>
            Buscar
          </Text>
        </Pressable>
      </ScrollView>

    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    paddingTop: 28,
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

  content: {
    paddingHorizontal: 14,
    gap: 18,
  },

  item: {
    width: 82,
    alignItems: "center",
  },

  avatarOuter: {
  width: 68,
  height: 68,

  borderRadius: 34,

  alignItems: "center",
  justifyContent: "center",

  backgroundColor:
    "rgba(56, 189, 248, 0.08)",

  borderWidth: 1,
  borderColor:
    "rgba(56, 189, 248, 0.18)",
},

avatarImage: {
  width: "100%",
  height: "100%",
  resizeMode: "cover",
},

avatar: {
  width: 60,
  height: 60,

  borderRadius: 30,

  alignItems: "center",
  justifyContent: "center",

  backgroundColor: colors.surface,

  borderWidth: 2,
  borderColor: colors.primary,
overflow: "hidden",
  shadowColor: colors.primary,
  shadowOpacity: 0.16,
  shadowRadius: 8,
},

initial: {
  color: colors.text,
  fontSize: 22,
  fontWeight: "900",
},
  

  name: {
  width: 82,

  marginTop: 8,

  color: colors.textMuted,

  fontSize: 12,
  fontWeight: "700",

  textAlign: "center",
},

  searchCircle: {
  width: 68,
  height: 68,

  borderRadius: 34,

  alignItems: "center",
  justifyContent: "center",

  borderWidth: 1,
  borderStyle: "dashed",
  borderColor: colors.primary,

  backgroundColor:
    "rgba(56, 189, 248, 0.03)",
},


  searchLabel: {
  marginTop: 8,

  color: colors.textMuted,

  fontSize: 12,
  fontWeight: "700",
},

  pressed: {
  opacity: 0.7,

  transform: [
    {
      scale: 0.94,
    },
  ],
},
});