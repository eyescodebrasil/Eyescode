import {
  View,
  Text,
  Image,
  ScrollView,
  Pressable,
  StyleSheet,
} from "react-native";

import { colors } from "../../theme/colors";

import {
  Ionicons,
} from "@expo/vector-icons";


const posts = [
  {
    id: "1",
    nome: "ViniciusAdmin",
    nivel: 19,
    texto: "testando testando",
    avatar: null,
    imagem: null,
    likes: 0,
    comentarios: 0,
  },
  {
    id: "2",
    nome: "ViniciusAdmin",
    nivel: 19,
    texto: "Testeeee",
    avatar: null,
    imagem: null,
    likes: 1,
    comentarios: 0,
  },
];

export default function CommunityPosts() {
  return (
    <View style={styles.section}>

   <View style={styles.sectionHeader}>

  <View style={styles.titleRow}>

    <View style={styles.iconBox}>
      <Ionicons
        name="people-outline"
        size={20}
        color="#38bdf8"
      />
    </View>

    <Text style={styles.sectionTitle}>
      Comunidade
    </Text>

  </View>


  <Pressable
    style={({ pressed }) => [
      styles.seeAllButton,
      pressed && styles.pressed,
    ]}
  >
    <Text style={styles.seeAll}>
      Ver tudo
    </Text>

    <Ionicons
      name="chevron-forward"
      size={18}
      color="#38bdf8"
    />
  </Pressable>

</View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.postsContent}
      >
        {posts.map((post) => (
          <View
            key={post.id}
            style={styles.card}
          >

            <View style={styles.userRow}>

     <View style={styles.avatar}>
  {post.avatar ? (
    <Image
      source={{ uri: post.avatar }}
      style={styles.avatarImage}
    />
  ) : (
    <Text style={styles.avatarLetter}>
      {post.nome.charAt(0)}
    </Text>
  )}
</View>


<View style={styles.userInfo}>

  <Text
    style={styles.username}
    numberOfLines={1}
  >
    {post.nome}
  </Text>

  <View style={styles.levelRow}>
    <Ionicons
      name="star"
      size={12}
      color="#facc15"
    />

    <Text style={styles.level}>
      Nível {post.nivel}
    </Text>
  </View>

</View>


<Pressable
  style={({ pressed }) => [
    styles.moreButton,
    pressed && styles.actionPressed,
  ]}
>
  <Ionicons
    name="ellipsis-horizontal"
    size={20}
    color={colors.textMuted}
  />
</Pressable>

            </View>

            <Text
              style={styles.postText}
              numberOfLines={3}
            >
              {post.texto}
            </Text>

            {post.imagem ? (
              <Image
                source={{ uri: post.imagem }}
                style={styles.postImage}
              />
            ) : (
              <View style={styles.imagePlaceholder}>
                <Text style={styles.placeholderText}>
                  Imagem do post
                </Text>
              </View>
            )}

          <View style={styles.actions}>
  <Pressable
    style={({ pressed }) => [
      styles.actionButton,
      pressed && styles.actionPressed,
    ]}
  >
    <Ionicons
      name={
        post.likes > 0
          ? "heart"
          : "heart-outline"
      }
      size={20}
      color={
        post.likes > 0
          ? colors.primary
          : colors.textMuted
      }
    />

    <Text
      style={[
        styles.actionText,
        post.likes > 0 &&
          styles.actionTextActive,
      ]}
    >
      {post.likes}
    </Text>
  </Pressable>

  <Pressable
    style={({ pressed }) => [
      styles.actionButton,
      pressed && styles.actionPressed,
    ]}
  >
    <Ionicons
      name="chatbubble-outline"
      size={19}
      color={colors.textMuted}
    />

    <Text style={styles.actionText}>
      {post.comentarios}
    </Text>
  </Pressable>
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

  sectionHeader: {
    paddingHorizontal: 14,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",

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

seeAllButton: {
  flexDirection: "row",
  alignItems: "center",

  gap: 3,

  minHeight: 36,
},

pressed: {
  opacity: 0.6,
},

  sectionTitle: {
  color: "#ffffff",
  fontSize: 23,
  fontWeight: "800",
},

  seeAll: {
  color: "#38bdf8",
  fontSize: 14,
  fontWeight: "700",
},

  postsContent: {
    paddingHorizontal: 14,
    gap: 12,
  },

  card: {
  width: 270,
  minHeight: 310,

  padding: 14,

  backgroundColor: "#101827",

  borderWidth: 1,
  borderColor: "#263246",

  borderRadius: 22,

  shadowColor: "#000000",
  shadowOffset: {
    width: 0,
    height: 8,
  },
  shadowOpacity: 0.16,
  shadowRadius: 16,

  elevation: 3,
},

  userRow: {
  flexDirection: "row",
  alignItems: "center",
},

avatar: {
  width: 46,
  height: 46,

  borderRadius: 23,

  alignItems: "center",
  justifyContent: "center",

  backgroundColor: "#172235",

  borderWidth: 2,
  borderColor: colors.primary,

  overflow: "hidden",

  shadowColor: colors.primary,
  shadowOpacity: 0.14,
  shadowRadius: 6,
},

avatarImage: {
  width: "100%",
  height: "100%",
},

avatarLetter: {
  color: "#ffffff",
  fontSize: 18,
  fontWeight: "800",
},

userInfo: {
  flex: 1,
  marginLeft: 10,
},

username: {
  color: "#ffffff",
  fontSize: 16,
  fontWeight: "800",
},

levelRow: {
  flexDirection: "row",
  alignItems: "center",
  gap: 4,
  marginTop: 3,
},

level: {
  color: colors.textMuted,
  fontSize: 12,
  fontWeight: "600",
},


  postText: {
  color: colors.text,

  fontSize: 15,
  lineHeight: 21,

  marginTop: 16,
  marginBottom: 12,
},

  imagePlaceholder: {
  height: 150,

  alignItems: "center",
  justifyContent: "center",

  backgroundColor: "#0a101b",

  borderWidth: 1,
  borderColor: "rgba(148, 163, 184, 0.06)",

  borderRadius: 16,
},

  placeholderText: {
    color: "#64748b",
    fontSize: 13,
  },

  postImage: {
    width: "100%",
    height: 150,

    borderRadius: 14,

    resizeMode: "cover",
  },

  actions: {
  flexDirection: "row",
  alignItems: "center",

  gap: 18,

  marginTop: 14,
},

actionButton: {
  flexDirection: "row",
  alignItems: "center",

  gap: 6,

  minHeight: 32,
},

actionPressed: {
  opacity: 0.6,

  transform: [
    {
      scale: 0.95,
    },
  ],
},

actionText: {
  color: colors.textMuted,
  fontSize: 14,
  fontWeight: "600",
},

  actionTextActive: {
    color: colors.primary,
  },

  moreButton: {
    width: 32,
    height: 32,

    alignItems: "center",
    justifyContent: "center",

    borderRadius: 10,
  },

});