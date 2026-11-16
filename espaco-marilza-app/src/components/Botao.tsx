import { Pressable, Text, ActivityIndicator, StyleSheet } from "react-native";
import { cores } from "../theme/cores";

type Props = {
  titulo: string;
  aoPressar: () => void;
  carregando?: boolean;
};

export default function Botao({ titulo, aoPressar, carregando = false }: Props) {
  return (
    <Pressable
      onPress={aoPressar}
      disabled={carregando}
      style={({ pressed }) => [estilos.botao, pressed && estilos.pressionado]}
    >
      {carregando ? (
        <ActivityIndicator color={cores.superficie} />
      ) : (
        <Text style={estilos.texto}>{titulo}</Text>
      )}
    </Pressable>
  );
}

const estilos = StyleSheet.create({
  botao: {
    backgroundColor: cores.primariaEscura,
    height: 54,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  pressionado: { opacity: 0.85 },
  texto: { color: cores.superficie, fontSize: 16, fontWeight: "700" },
});