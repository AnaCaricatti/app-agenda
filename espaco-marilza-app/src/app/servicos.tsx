import { View, Text, StyleSheet } from "react-native";
import { cores } from "../theme/cores";

export default function TelaServicos() {
  return (
    <View style={estilos.container}>
      <Text style={estilos.texto}>Gestão de Serviços (TL03)</Text>
    </View>
  );
}

const estilos = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  texto: { fontSize: 20, color: cores.texto },
});