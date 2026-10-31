import {
  Modal,
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";

import {
  useEffect,
  useState,
} from "react";

import {
  Ionicons
} from "@expo/vector-icons";

import {
  supabase
} from "../../lib/supabase";


export default function EditProfileModal({
  visible,
  perfil,
  onClose,
  onSaved,
}) {

  const [nome, setNome] =
    useState("");

  const [gamertag, setGamertag] =
    useState("");

  const [bio, setBio] =
    useState("");

const [instagram, setInstagram] =
  useState("");

const [discord, setDiscord] =
  useState("");

const [twitch, setTwitch] =
  useState("");

const [github, setGithub] =
  useState("");

const [x, setX] =
  useState("");

  const [salvando, setSalvando] =
    useState(false);


  useEffect(() => {

    if (!perfil) {
      return;
    }

    setNome(
      perfil.nome || ""
    );

    setGamertag(
      perfil.gamertag || ""
    );

    setBio(
      perfil.bio || ""
    );

setInstagram(
  perfil.redes?.instagram || ""
);

setDiscord(
  perfil.redes?.discord || ""
);

setTwitch(
  perfil.redes?.twitch || ""
);

setGithub(
  perfil.redes?.github || ""
);

setX(
  perfil.redes?.x || ""
);

  }, [
    perfil,
    visible
  ]);


  async function salvarPerfil() {

    const nomeLimpo =
      nome.trim();

    const gamertagLimpo =
      gamertag.trim();

    const bioLimpa =
      bio.trim();


    if (!gamertagLimpo) {

      Alert.alert(
        "Gamertag obrigatório",
        "Escolha um gamertag para o seu perfil."
      );

      return;

    }


    try {

      setSalvando(true);


      const {
        data: { user },
        error: authError,
      } =
        await supabase.auth.getUser();


      if (
        authError ||
        !user
      ) {

        Alert.alert(
          "Erro",
          "Não foi possível identificar sua conta."
        );

        return;

      }


      const {
        data,
        error,
      } =
        await supabase
          .from("users")
  .update({

  nome:
    nomeLimpo || null,

  gamertag:
    gamertagLimpo,

  bio:
    bioLimpa || null,

  redes: {

    ...(perfil.redes || {}),

    instagram:
      instagram.trim(),

    discord:
      discord.trim(),

    twitch:
      twitch.trim(),

    github:
      github.trim(),

    x:
      x.trim(),

  },

})
          .eq(
            "id",
            user.id
          )
          .select(`
            id,
            gamertag,
            nome,
            avatar,
            redes,
            banner,
            bio,
            xp,
            nivel
          `)
          .single();


      if (error) {

        console.error(
          "Erro ao atualizar perfil:",
          error
        );

        Alert.alert(
          "Erro ao salvar",
          error.message
        );

        return;

      }


      onSaved?.(
        data
      );

      onClose?.();


    }
    catch (error) {

      console.error(
        "Erro inesperado:",
        error
      );

      Alert.alert(
        "Erro",
        "Não foi possível salvar o perfil."
      );

    }
    finally {

      setSalvando(false);

    }

  }


  return (

    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >

      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={
          Platform.OS === "ios"
            ? "padding"
            : undefined
        }
      >

        <Pressable
          style={styles.backdrop}
          onPress={onClose}
        />


        <View style={styles.sheet}>

          <View style={styles.handle} />


          <View style={styles.header}>

            <View>

              <Text style={styles.title}>
                Editar perfil
              </Text>

              <Text style={styles.subtitle}>
                Atualize suas informações
              </Text>

            </View>


            <Pressable
              style={styles.closeButton}
              onPress={onClose}
            >

              <Ionicons
                name="close"
                size={24}
                color="#ffffff"
              />

            </Pressable>

          </View>


          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >

            <Text style={styles.label}>
              Nome
            </Text>

            <TextInput
              style={styles.input}
              value={nome}
              onChangeText={setNome}
              placeholder="Seu nome"
              placeholderTextColor="#64748b"
              maxLength={60}
            />


            <Text style={styles.label}>
              Gamertag
            </Text>

            <TextInput
              style={styles.input}
              value={gamertag}
              onChangeText={setGamertag}
              placeholder="Seu gamertag"
              placeholderTextColor="#64748b"
              autoCapitalize="none"
              maxLength={30}
            />


            <Text style={styles.label}>
              Bio
            </Text>

            <TextInput
              style={[
                styles.input,
                styles.bioInput,
              ]}
              value={bio}
              onChangeText={setBio}
              placeholder="Conte um pouco sobre você..."
              placeholderTextColor="#64748b"
              multiline
              textAlignVertical="top"
              maxLength={200}
            />


  <Text style={styles.counter}>
  {bio.length}/200
</Text>


<Text style={styles.sectionTitle}>
  Redes sociais
</Text>

<Text style={styles.sectionDescription}>
  Adicione seus perfis para exibir links públicos no seu perfil.
</Text>


<Text style={styles.label}>
  Instagram
</Text>

<TextInput
  style={styles.input}
  value={instagram}
  onChangeText={setInstagram}
  placeholder="@usuario ou link"
  placeholderTextColor="#64748b"
  autoCapitalize="none"
/>


<Text style={styles.label}>
  Discord
</Text>

<TextInput
  style={styles.input}
  value={discord}
  onChangeText={setDiscord}
  placeholder="Usuário ou link"
  placeholderTextColor="#64748b"
  autoCapitalize="none"
/>


<Text style={styles.label}>
  Twitch
</Text>

<TextInput
  style={styles.input}
  value={twitch}
  onChangeText={setTwitch}
  placeholder="twitch.tv/usuario"
  placeholderTextColor="#64748b"
  autoCapitalize="none"
/>


<Text style={styles.label}>
  GitHub
</Text>

<TextInput
  style={styles.input}
  value={github}
  onChangeText={setGithub}
  placeholder="github.com/usuario"
  placeholderTextColor="#64748b"
  autoCapitalize="none"
/>


<Text style={styles.label}>
  X
</Text>

<TextInput
  style={styles.input}
  value={x}
  onChangeText={setX}
  placeholder="@usuario"
  placeholderTextColor="#64748b"
  autoCapitalize="none"
/>


<Pressable
  style={[
    styles.saveButton,
    salvando &&
    styles.saveButtonDisabled,
  ]}
  onPress={salvarPerfil}
  disabled={salvando}
>

  {
    salvando ? (

      <ActivityIndicator
        color="#ffffff"
      />

    ) : (

      <>
        <Ionicons
          name="checkmark-circle-outline"
          size={21}
          color="#ffffff"
        />

        <Text style={styles.saveText}>
          Salvar alterações
        </Text>
      </>

    )
  }

</Pressable>

          </ScrollView>

        </View>

      </KeyboardAvoidingView>

    </Modal>

  );

}


const styles =
  StyleSheet.create({

    overlay: {
      flex: 1,
      justifyContent: "flex-end",
    },

    backdrop: {
      ...StyleSheet.absoluteFillObject,

      backgroundColor:
        "rgba(0,0,0,0.65)",
    },

    sheet: {
      maxHeight: "82%",

      paddingHorizontal: 22,
      paddingBottom: 30,

      backgroundColor: "#0d1522",

      borderTopLeftRadius: 28,
      borderTopRightRadius: 28,

      borderWidth: 1,
      borderColor: "#1e293b",
    },

    handle: {
      width: 46,
      height: 5,

      alignSelf: "center",

      marginTop: 10,
      marginBottom: 18,

      borderRadius: 999,

      backgroundColor: "#334155",
    },

    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",

      marginBottom: 24,
    },

    title: {
      color: "#ffffff",

      fontSize: 25,
      fontWeight: "900",
    },

    subtitle: {
      color: "#64748b",

      marginTop: 3,

      fontSize: 13,
    },

    closeButton: {
      width: 42,
      height: 42,

      alignItems: "center",
      justifyContent: "center",

      borderRadius: 14,

      backgroundColor: "#101827",
    },

    label: {
      color: "#cbd5e1",

      fontSize: 13,
      fontWeight: "700",

      marginBottom: 8,
      marginTop: 14,
    },

    input: {
      minHeight: 52,

      paddingHorizontal: 15,

      color: "#ffffff",

      fontSize: 15,

      backgroundColor: "#101827",

      borderWidth: 1,
      borderColor: "#1e293b",

      borderRadius: 14,
    },

    bioInput: {
      minHeight: 120,

      paddingTop: 14,
      paddingBottom: 14,
    },

    counter: {
      color: "#64748b",

      fontSize: 12,
      textAlign: "right",

      marginTop: 6,
    },

    saveButton: {
      height: 54,

      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",

      gap: 8,

      marginTop: 24,

      backgroundColor: "#2563eb",

      borderRadius: 16,
    },

    sectionTitle: {
  color: "#ffffff",
  fontSize: 19,
  fontWeight: "900",
  marginTop: 28,
},

sectionDescription: {
  color: "#64748b",
  fontSize: 13,
  lineHeight: 18,
  marginTop: 5,
  marginBottom: 8,
}, saveButtonDisabled: {
      opacity: 0.6,
    },

    saveText: {
      color: "#ffffff",

      fontSize: 15,
      fontWeight: "900",
    },

  });