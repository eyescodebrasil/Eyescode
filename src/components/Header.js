import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Image,
} from "react-native";


import {
  useEffect,
  useState,
} from "react";

import {
  supabase
} from "../lib/supabase";

import { Ionicons } from "@expo/vector-icons";

import { colors } from "../theme/colors";


export default function Header({
  onNavigate
}) {

  const [perfil, setPerfil] =

    useState(null);


  useEffect(() => {

    async function carregarPerfil() {

      // Usuário autenticado
      const {
        data: { user },
        error: authError,
      } =
        await supabase.auth.getUser();


      if (authError || !user) {

        console.error(
          "Erro ao carregar usuário:",
          authError
        );

        return;
      }


      // Perfil EyesCode
      const {
        data,
        error,
      } =
        await supabase
          .from("users")
          .select(
            "id, gamertag, nome, avatar, nivel"
          )
          .eq("id", user.id)
          .single();


      if (error) {

        console.error(
          "Erro ao carregar perfil:",
          error
        );

        return;
      }


      setPerfil(data);

    }


    carregarPerfil();

  }, []);


  return (

    <View style={styles.container}>

      <View style={styles.left}>

        <Pressable style={styles.iconButton}>
          <Ionicons
            name="menu-outline"
            size={30}
            color={colors.text}
          />
        </Pressable>


        <View style={styles.brand}>

 
 <Image
  source={require("../../assets/eyescode-logo.png")}
  style={styles.logo}
/>
      
    

          <Text style={styles.brandName}>
            EyesCode
          </Text>

        </View>

      </View>


      <View style={styles.actions}>

        <Pressable style={styles.iconButton}>
          <Ionicons
            name="search-outline"
            size={25}
            color={colors.text}
          />
        </Pressable>


        <Pressable style={styles.iconButton}>

          <Ionicons
            name="notifications-outline"
            size={25}
            color={colors.text}
          />

          <View style={styles.badge}>
            <Text style={styles.badgeText}>
              4
            </Text>
          </View>

        </Pressable>


        <Pressable style={styles.iconButton}>

          <Ionicons
            name="cart-outline"
            size={26}
            color={colors.text}
          />

          <View
            style={[
              styles.badge,
              styles.cartBadge,
            ]}
          >
            <Text style={styles.badgeText}>
              0
            </Text>
          </View>

        </Pressable>

<Pressable
  style={styles.profileButton}
  onPress={() => {
    onNavigate?.("profile");
  }}
>

  {perfil?.avatar ? (

    <Image
      source={{
        uri: perfil.avatar
      }}
      style={styles.avatar}
    />

  ) : (

    <View style={styles.avatarFallback}>

      <Ionicons
        name="person-outline"
        size={20}
        color={colors.text}
      />

    </View>

  )}

</Pressable>

      </View>

    </View>
  );
}


const styles = StyleSheet.create({

  container: {
    minHeight: 64,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",

    paddingHorizontal: 16,

    backgroundColor: colors.surface,

    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },


  left: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },


  brand: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },


logo: {
  width: 44,
  height: 44,
  resizeMode: "contain",
},


  brandName: {
    color: colors.text,
    fontSize: 22,
    fontWeight: "700",
  },


  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },


  iconButton: {
    minWidth: 36,
    minHeight: 36,

    alignItems: "center",
    justifyContent: "center",

    position: "relative",
  },


  badge: {
    position: "absolute",

    top: 0,
    right: 0,

    minWidth: 18,
    height: 18,

    paddingHorizontal: 4,

    alignItems: "center",
    justifyContent: "center",

    backgroundColor: "#ef4444",
    borderRadius: 9,
  },


  cartBadge: {
    backgroundColor: "#2563eb",
  },


  badgeText: {
    color: "#ffffff",
    fontSize: 10,
    fontWeight: "800",
  },

profileButton: {
  marginLeft: 4,
},

avatar: {
  width: 36,
  height: 36,

  borderRadius: 18,

  borderWidth: 2,
  borderColor: "#38bdf8",
},

avatarFallback: {
  width: 36,
  height: 36,

  borderRadius: 18,

  alignItems: "center",
  justifyContent: "center",

  backgroundColor: "#101827",

  borderWidth: 1,
  borderColor: colors.border,
},

});