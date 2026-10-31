import { useState } from "react";

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

import { supabase } from "../lib/supabase";
import { colors } from "../theme/colors";

export default function RegisterScreen({ onBack }) {
  const [nome, setNome] = useState("");
  const [gamertag, setGamertag] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [carregando, setCarregando] = useState(false);

  async function cadastrar() {
    const nomeLimpo = nome.trim();
    const tagLimpa = gamertag.trim();
    const emailLimpo = email.trim().toLowerCase();

    if (!nomeLimpo || !tagLimpa || !emailLimpo || !senha || !confirmarSenha) {
      Alert.alert("Atenção", "Preencha todos os campos.");
      return;
    }

    if (tagLimpa.length < 3) {
      Alert.alert("Gamertag inválido", "Use pelo menos 3 caracteres.");
      return;
    }

    if (!/^[a-zA-Z0-9_]+$/.test(tagLimpa)) {
      Alert.alert(
        "Gamertag inválido",
        "Use apenas letras, números e underline (_)."
      );
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailLimpo)) {
      Alert.alert("E-mail inválido", "Confira o endereço de e-mail.");
      return;
    }

    if (senha.length < 6) {
      Alert.alert("Senha muito curta", "Use pelo menos 6 caracteres.");
      return;
    }

    if (senha !== confirmarSenha) {
      Alert.alert("Senhas diferentes", "As senhas digitadas não coincidem.");
      return;
    }

    try {
      setCarregando(true);

      const { data, error } = await supabase.auth.signUp({
        email: emailLimpo,
        password: senha,
        options: {
          data: {
            nome: nomeLimpo,
            gamertag: tagLimpa,
          },
        },
      });

      if (error) {
        Alert.alert("Não foi possível criar a conta", error.message);
        return;
      }

      if (data.session) {
        Alert.alert(
          "Conta criada!",
          "Sua conta EyesCode foi criada com sucesso.",
          [{ text: "Continuar", onPress: () => onBack?.() }]
        );
      } else {
        Alert.alert(
          "Confira seu e-mail",
          "Enviamos uma mensagem de confirmação, caso a confirmação de e-mail esteja habilitada no projeto. Confirme seu endereço para continuar.",
          [{ text: "Voltar ao login", onPress: () => onBack?.() }]
        );
      }
    } catch (erro) {
      console.error("Erro no cadastro:", erro);

      Alert.alert(
        "Erro",
        "Não foi possível concluir o cadastro. Tente novamente."
      );
    } finally {
      setCarregando(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.logo}>EyesCode</Text>

        <Text style={styles.title}>Criar conta</Text>

        <Text style={styles.subtitle}>
          Faça parte da comunidade EyesCode
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Nome completo"
          placeholderTextColor="#64748b"
          value={nome}
          onChangeText={setNome}
          autoCapitalize="words"
          maxLength={100}
        />

        <TextInput
          style={styles.input}
          placeholder="Gamertag"
          placeholderTextColor="#64748b"
          value={gamertag}
          onChangeText={setGamertag}
          autoCapitalize="none"
          maxLength={30}
        />

        <TextInput
          style={styles.input}
          placeholder="E-mail"
          placeholderTextColor="#64748b"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          autoCorrect={false}
          maxLength={254}
        />

        <TextInput
          style={styles.input}
          placeholder="Senha (mínimo 6 caracteres)"
          placeholderTextColor="#64748b"
          value={senha}
          onChangeText={setSenha}
          secureTextEntry
          autoCapitalize="none"
        />

        <TextInput
          style={styles.input}
          placeholder="Confirmar senha"
          placeholderTextColor="#64748b"
          value={confirmarSenha}
          onChangeText={setConfirmarSenha}
          secureTextEntry
          autoCapitalize="none"
        />

        <TouchableOpacity
          style={[styles.button, carregando && styles.buttonDisabled]}
          onPress={cadastrar}
          disabled={carregando}
          activeOpacity={0.8}
        >
          {carregando ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text style={styles.buttonText}>Criar conta</Text>
          )}
        </TouchableOpacity>

        <View style={styles.loginContainer}>
          <Text style={styles.loginText}>Já possui uma conta?</Text>

          <TouchableOpacity onPress={onBack}>
            <Text style={styles.loginLink}>Entrar</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  content: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 28,
    paddingVertical: 32,
  },

  logo: {
    color: "#38bdf8",
    fontSize: 36,
    fontWeight: "900",
    marginBottom: 28,
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
    marginBottom: 24,
  },

  input: {
    minHeight: 54,
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
    minHeight: 54,
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

  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    flexWrap: "wrap",
    gap: 5,
    marginTop: 28,
  },

  loginText: {
    color: "#94a3b8",
  },

  loginLink: {
    color: "#38bdf8",
    fontWeight: "700",
  },
});