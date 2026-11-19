import { Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { cores } from "../theme/cores";

type Props = {
  icone: keyof typeof Ionicons.glyphMap;
  aoPressar: () => void;
  descricao: string; // lido por leitores de tela (acessibilidade)
};

// Botão redondo só com ícone, usado sobre o cabeçalho vinho.
export default function BotaoIcone({ icone, aoPressar, descricao }: Props) {
  return (
    <Pressable
      onPress={aoPressar}
      accessibilityLabel={descricao}
      hitSlop={8}
      style={({ pressed }) => [estilos.botao, pressed && { opacity: 0.7 }]}
    >
      <Ionicons name={icone} size={20} color={cores.textoSobreVinho} />
    </Pressable>
  );
}

const estilos = StyleSheet.create({
  botao: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "rgba(255,255,255,0.14)",
    alignItems: "center",
    justifyContent: "center",
  },
});
