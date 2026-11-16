import { View, Text, StyleSheet } from "react-native";
import { Link } from "expo-router";
import { cores } from "../theme/cores";

export default function TelaInicial() {
  return (
    <View style={estilos.container}>
      <Text style={estilos.titulo}>Espaço Marilza Caricatti</Text>
      <Text style={estilos.subtitulo}>Teste de navegação</Text>

      <Link href="/login" style={estilos.link}>Ir para Login</Link>
      <Link href="/agenda" style={estilos.link}>Ir para Agenda</Link>
      <Link href="/servicos" style={estilos.link}>Ir para Serviços</Link>
      <Link href="/expediente" style={estilos.link}>Ir para Expediente</Link>
    </View>
  );
}

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  titulo: { fontSize: 24, fontWeight: "bold", color: cores.primariaEscura },
  subtitulo: { fontSize: 16, color: cores.textoSuave, marginTop: 8, marginBottom: 24 },
  link: { fontSize: 18, color: cores.primariaEscura, paddingVertical: 10 },
});