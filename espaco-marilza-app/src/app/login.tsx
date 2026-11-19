import { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import CampoTexto from "../components/CampoTexto";
import Botao from "../components/Botao";
import { useAuth } from "../contexts/AuthContext";
import { cores, fontes, sombra } from "../theme/cores";
import { mensagens } from "../utils/mensagens";
import { validarEmail, validarSenha } from "../utils/validacoes";

export default function TelaLogin() {
  const { entrar, recuperarSenha } = useAuth();

  // O que a pessoa digitou
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  // Mensagens de erro de cada campo e do login em geral
  const [erroEmail, setErroEmail] = useState<string | null>(null);
  const [erroSenha, setErroSenha] = useState<string | null>(null);
  const [erroLogin, setErroLogin] = useState<string | null>(null);
  const [avisoSenha, setAvisoSenha] = useState<string | null>(null);

  const [carregando, setCarregando] = useState(false);

  async function fazerLogin() {
    setErroLogin(null);
    setAvisoSenha(null);

    // 1) Valida os campos
    const erroDoEmail = validarEmail(email);
    const erroDaSenha = validarSenha(senha);
    setErroEmail(erroDoEmail);
    setErroSenha(erroDaSenha);
    if (erroDoEmail || erroDaSenha) return; // se tem erro, para aqui

    setCarregando(true);

    // 2) Pede ao Firebase para conferir o e-mail e a senha
    try {
      await entrar(email, senha);
      // Deu certo: o _layout percebe o login e troca sozinho para a agenda.
    } catch {
      setErroLogin(mensagens.MSG01);
      setCarregando(false);
    }
  }

  async function enviarRecuperacao() {
    const erroDoEmail = validarEmail(email);
    setErroEmail(erroDoEmail);
    if (erroDoEmail) return; // precisa do e-mail preenchido para enviar o link

    try {
      await recuperarSenha(email);
    } catch {
      // Por segurança, mostramos a mesma mensagem mesmo se o e-mail não existir.
    }
    setAvisoSenha("Se este e-mail estiver cadastrado, enviaremos um link para criar uma nova senha.");
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
              <Text style={estilos.monograma}>MC</Text>
            </View>
            <Text style={estilos.marca}>ESPAÇO MARILZA CARICATTI</Text>
            <Text style={estilos.titulo}>Bem-vinda de volta</Text>
            <Text style={estilos.subtitulo}>Entre para gerenciar a sua agenda</Text>
          </View>

          {erroLogin ? (
            <View style={estilos.alerta}>
              <Ionicons name="alert-circle" size={20} color={cores.cancelado} />
              <Text style={estilos.textoAlerta}>{erroLogin}</Text>
            </View>
          ) : null}

          {avisoSenha ? (
            <View style={estilos.alerta}>
              <Ionicons name="mail-outline" size={20} color={cores.primariaEscura} />
              <Text style={estilos.textoAlerta}>{avisoSenha}</Text>
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

          <Pressable onPress={enviarRecuperacao} style={estilos.linkEsqueci}>
            <Text style={estilos.textoLink}>Esqueci minha senha</Text>
          </Pressable>

          <Botao titulo="Acessar" aoPressar={fazerLogin} carregando={carregando} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const estilos = StyleSheet.create({
  tela: { flex: 1, backgroundColor: cores.fundo },
  conteudo: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 24,
    width: "100%",
    maxWidth: 460,
    alignSelf: "center",
  },
  cabecalho: { alignItems: "center", marginBottom: 32 },
  logo: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: cores.primariaEscura,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    ...sombra,
    shadowOpacity: 0.25,
  },
  monograma: { fontFamily: fontes.titulo, fontSize: 30, fontWeight: "700", color: cores.superficie },
  marca: { fontSize: 11, fontWeight: "700", letterSpacing: 2, color: cores.dourado, marginBottom: 8 },
  titulo: { fontFamily: fontes.titulo, fontSize: 30, fontWeight: "700", color: cores.texto },
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