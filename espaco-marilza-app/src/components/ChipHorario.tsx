import { Pressable, Text, StyleSheet } from "react-native";
import { cores } from "../theme/cores";

type Props = {
  texto: string;
  selecionado: boolean;
  aoPressar: () => void;
};

// "Pílula" clicável usada para escolher horários e dias.
export default function ChipHorario({ texto, selecionado, aoPressar }: Props) {
  return (
    <Pressable
      onPress={aoPressar}
      style={({ pressed }) => [
        estilos.chip,
        selecionado && estilos.selecionado,
        pressed && { opacity: 0.8 },
      ]}
    >
      <Text style={[estilos.texto, selecionado && estilos.textoSelecionado]}>{texto}</Text>
    </Pressable>
  );
}

const estilos = StyleSheet.create({
  chip: {
    width: "22.5%", // quatro por linha
    alignItems: "center",
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: cores.borda,
    backgroundColor: cores.superficie,
  },
  selecionado: { backgroundColor: cores.primariaEscura, borderColor: cores.primariaEscura },
  texto: { fontSize: 14, fontWeight: "700", color: cores.texto },
  textoSelecionado: { color: cores.superficie },
});
