import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

import { colors } from "../../theme/colors";


const people = [
  {
    id: "1",
    name: "TesteAdmin",
    username: "@TesteAdmin",
    level: 1,
    avatar: "T",
    followed: false,
  },
  {
    id: "2",
    name: "SimplePlayer",
    username: "@SimplePlayer",
    level: 4,
    avatar: "S",
    followed: false,
  },
  {
    id: "3",
    name: "EyesPlayer",
    username: "@EyesPlayer",
    level: 8,
    avatar: "E",
    followed: true,
  },
];


export default function PeopleToFollow() {
  return (
    <View style={styles.section}>

      <View style={styles.titleRow}>

        <View style={styles.iconBox}>
          <Ionicons
            name="person-add-outline"
            size={20}
            color={colors.primary}
          />
        </View>

        <Text style={styles.title}>
          Pessoas para seguir
        </Text>

      </View>


      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.list}
      >

        {people.map((person) => (

  <View
  key={person.id}
  style={styles.card}
>

  <View style={styles.avatar}>
    <Text style={styles.avatarText}>
      {person.avatar}
    </Text>
  </View>


  <View style={styles.info}>

    <Text
      style={styles.name}
      numberOfLines={1}
    >
      {person.name}
    </Text>

    <Text
      style={styles.username}
      numberOfLines={1}
    >
      {person.username}
    </Text>

  </View>


  <Pressable
    style={({ pressed }) => [
      styles.followButton,

      person.followed &&
        styles.followButtonActive,

      pressed &&
        styles.followButtonPressed,
    ]}
  >

    <Ionicons
      name={
        person.followed
          ? "checkmark"
          : "person-add-outline"
      }
      size={15}
      color={
        person.followed
          ? colors.primary
          : "#ffffff"
      }
    />

    <Text
      style={[
        styles.followText,

        person.followed &&
          styles.followTextActive,
      ]}
    >
      {person.followed
        ? "Seguindo"
        : "Seguir"}
    </Text>

  </Pressable>

</View>

        ))}

      </ScrollView>

    </View>
  );
}


const styles = StyleSheet.create({

  section: {
    paddingTop: 30,
    paddingBottom: 30,
  },


  titleRow: {
    flexDirection: "row",
    alignItems: "center",

    paddingHorizontal: 14,
    marginBottom: 18,

    gap: 9,
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


  list: {
    paddingHorizontal: 14,
    gap: 12,
  },


  card: {
  width: 280,
  height: 82,

  flexDirection: "row",
  alignItems: "center",

  paddingHorizontal: 12,

  backgroundColor: colors.surface,

  borderWidth: 1,
  borderColor: colors.border,

  borderRadius: 18,
},


avatar: {
  width: 50,
  height: 50,

  borderRadius: 25,

  alignItems: "center",
  justifyContent: "center",

  backgroundColor: colors.background,

  borderWidth: 2,
  borderColor: colors.primary,
},


avatarText: {
  color: colors.text,

  fontSize: 19,
  fontWeight: "900",
},


info: {
  flex: 1,

  marginLeft: 10,
  marginRight: 8,
},


name: {
  color: colors.text,

  fontSize: 15,
  fontWeight: "800",
},


username: {
  color: colors.textMuted,

  fontSize: 12,
  marginTop: 2,
},


followButton: {
  minWidth: 76,
  height: 36,

  paddingHorizontal: 10,

  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",

  gap: 5,

  backgroundColor: colors.primary,

  borderRadius: 11,
},


followButtonActive: {
  backgroundColor:
    "rgba(56, 189, 248, 0.08)",

  borderWidth: 1,
  borderColor:
    "rgba(56, 189, 248, 0.25)",
},


followButtonPressed: {
  opacity: 0.7,

  transform: [
    {
      scale: 0.96,
    },
  ],
},


followText: {
  color: "#ffffff",

  fontSize: 12,
  fontWeight: "800",
},


followTextActive: {
  color: colors.primary,
},

});