import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";

import {
  useState
} from "react";

import {
  supabase
} from "../lib/supabase";

import {
  colors
} from "../theme/colors";


export default function LoginScreen({
  onLogin
}) {

  const [email, setEmail] =
    useState("");

  const [senha, setSenha] =
    useState("");

  const [carregando, setCarregando] =
    useState(false);


  async function entrar() {

    if (!email || !senha) {

      Alert.alert(
        "Atenção",
        "Preencha email e senha."
      );

      return;
    }


    try {

      setCarregando(true);


      const {
        data,
        error
      } =
        await supabase.auth
          .signInWithPassword({
            email: email.trim(),
            password: senha,
          });


      if (error) {

        Alert.alert(
          "Erro ao entrar",
          error.message
        );

        return;
      }


      console.log(
        "Login realizado:",
        data.user?.id
      );


      if (onLogin) {
        onLogin(data.session);
      }


    } catch (erro) {

      console.error(erro);

      Alert.alert(
        "Erro",
        "Não foi possível entrar."
      );

    } finally {

      setCarregando(false);

    }

  }


  return (

    <View style={styles.container}>

      <Text style={styles.logo}>
        EyesCode
      </Text>


      <Text style={styles.title}>
        Entrar
      </Text>


      <Text style={styles.subtitle}>
        Acesse sua conta EyesCode
      </Text>


      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#64748b"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />


      <TextInput
        style={styles.input}
        placeholder="Senha"
        placeholderTextColor="#64748b"
        value={senha}
        onChangeText={setSenha}
        secureTextEntry
      />


      <TouchableOpacity
        style={[
          styles.button,
          carregando &&
          styles.buttonDisabled
        ]}
        onPress={entrar}
        disabled={carregando}
      >

        <Text style={styles.buttonText}>

          {
            carregando
              ? "Entrando..."
              : "Entrar"
          }

        </Text>

      </TouchableOpacity>


      <TouchableOpacity>

        <Text style={styles.forgot}>
          Esqueci minha senha
        </Text>

      </TouchableOpacity>


      <View style={styles.registerContainer}>

        <Text style={styles.registerText}>
          Não possui uma conta?
        </Text>

        <TouchableOpacity>
          <Text style={styles.registerLink}>
            Criar conta
          </Text>
        </TouchableOpacity>

      </View>

    </View>

  );

}


const styles =
  StyleSheet.create({

    container: {

      flex: 1,

      justifyContent: "center",

      paddingHorizontal: 28,

      backgroundColor:
        colors.background,

    },


    logo: {

      color: "#38bdf8",

      fontSize: 36,

      fontWeight: "900",

      marginBottom: 42,

    },


    title: {

      color: "#ffffff",

      fontSize: 30,

      fontWeight: "800",

      marginBottom: 8,

    },


    subtitle: {

      color: "#94a3b8",

      fontSize: 15,

      marginBottom: 28,

    },


    input: {

      height: 54,

      borderRadius: 14,

      borderWidth: 1,

      borderColor: "#1e293b",

      backgroundColor: "#101827",

      paddingHorizontal: 16,

      color: "#ffffff",

      fontSize: 16,

      marginBottom: 14,

    },


    button: {

      height: 54,

      alignItems: "center",
      justifyContent: "center",

      backgroundColor: "#2563eb",

      borderRadius: 14,

      marginTop: 8,

    },


    buttonDisabled: {

      opacity: 0.6,

    },


    buttonText: {

      color: "#ffffff",

      fontSize: 16,

      fontWeight: "800",

    },


    forgot: {

      color: "#38bdf8",

      textAlign: "center",

      marginTop: 18,

      fontWeight: "600",

    },


    registerContainer: {

      flexDirection: "row",

      justifyContent: "center",

      marginTop: 32,

      gap: 5,

    },


    registerText: {

      color: "#94a3b8",

    },


    registerLink: {

      color: "#38bdf8",

      fontWeight: "700",

    },

  });