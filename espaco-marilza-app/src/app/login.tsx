import { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Alert,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import CampoTexto from "../components/CampoTexto";
import Botao from "../components/Botao";
import { cores } from "../theme/cores";
import { mensagens } from "../utils/mensagens";
import { validarEmail, validarSenha } from "../utils/validacoes";

export default function TelaLogin() {
  const router = useRouter(); // ferramenta para trocar de tela

  // O que a pessoa digitou
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  // Mensagens de erro de cada campo e do login em geral
  const [erroEmail, setErroEmail] = useState<string | null>(null);
  const [erroSenha, setErroSenha] = useState<string | null>(null);
  const [erroLogin, setErroLogin] = useState<string | null>(null);

  const [carregando, setCarregando] = useState(false);

  async function entrar() {
    setErroLogin(null);

    // 1) Valida os campos
    const erroDoEmail = validarEmail(email);
    const erroDaSenha = validarSenha(senha);
    setErroEmail(erroDoEmail);
    setErroSenha(erroDaSenha);
    if (erroDoEmail || erroDaSenha) return; // se tem erro, para aqui

    // 2) Tenta entrar
    setCarregando(true);

    // TEMPORÁRIO: simula o login até conectarmos o Firebase.
    // Para testar, use: marilzacari@hotmail.com e a senha 12345678
    await new Promise((resolve) => setTimeout(resolve, 800));
    const loginCorreto =
      email.trim().toLowerCase() === "marilzacari@hotmail.com" &&
      senha === "12345678";

    setCarregando(false);

    // 3) Segue para a agenda ou mostra a MSG01
    if (loginCorreto) {
      router.replace("/agenda"); // replace: não deixa voltar ao login
    } else {
      setErroLogin(mensagens.MSG01);
    }
  }

  function recuperarSenha() {
    // Será ligado ao Firebase mais adiante.
    Alert.alert("Recuperar senha", "Esta função será ativada quando conectarmos o Firebase.");
  }

  return (
    <SafeAreaView style={estilos.tela}>
      <KeyboardAvoidingView
        style={estilos.tela}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={estilos.conteudo}
          keyboardShouldPersistTaps="handled"
        >
          <View style={estilos.cabecalho}>
            <View style={estilos.logo}>
              <Ionicons name="flower-outline" size={36} color={cores.primariaEscura} />
            </View>
            <Text style={estilos.titulo}>Bem-vinda de volta</Text>
            <Text style={estilos.subtitulo}>Entre para gerenciar a sua agenda</Text>
          </View>

          {erroLogin ? (
            <View style={estilos.alerta}>
              <Ionicons name="alert-circle" size={20} color={cores.cancelado} />
              <Text style={estilos.textoAlerta}>{erroLogin}</Text>
            </View>
          ) : null}

          <CampoTexto
            rotulo="E-mail"
            icone="mail-outline"
            placeholder="seuemail@exemplo.com"
            value={email}
            onChangeText={setEmail}
            erro={erroEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            maxLength={100}
          />

          <CampoTexto
            rotulo="Senha"
            icone="lock-closed-outline"
            placeholder="Digite sua senha"
            value={senha}
            onChangeText={setSenha}
            erro={erroSenha}
            ehSenha
            autoCapitalize="none"
            maxLength={20}
          />

          <Pressable onPress={recuperarSenha} style={estilos.linkEsqueci}>
            <Text style={estilos.textoLink}>Esqueci minha senha</Text>
          </Pressable>

          <Botao titulo="Acessar" aoPressar={entrar} carregando={carregando} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const estilos = StyleSheet.create({
  tela: { flex: 1, backgroundColor: cores.fundo },
  conteudo: { flexGrow: 1, justifyContent: "center", padding: 24 },
  cabecalho: { alignItems: "center", marginBottom: 32 },
  logo: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: cores.primariaClara,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  titulo: { fontSize: 26, fontWeight: "700", color: cores.texto },
  subtitulo: { fontSize: 15, color: cores.textoSuave, marginTop: 6 },
  alerta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: cores.primariaClara,
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  textoAlerta: { flex: 1, fontSize: 14, color: cores.texto },
  linkEsqueci: { alignSelf: "flex-end", marginBottom: 24 },
  textoLink: { fontSize: 14, fontWeight: "600", color: cores.primariaEscura },
});