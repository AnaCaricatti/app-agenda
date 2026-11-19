import { Pressable, Text, ActivityIndicator, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { cores } from "../theme/cores";

// "primario"   = vinho cheio (ação principal da tela)
// "secundario" = contorno vinho (ação alternativa)
// "perigo"     = contorno vermelho (cancelar, excluir)
// "whatsapp"   = verde do WhatsApp
type Variante = "primario" | "secundario" | "perigo" | "whatsapp";

type Props = {
  titulo: string;
  aoPressar: () => void;
  carregando?: boolean;
  desativado?: boolean;
  variante?: Variante;
  icone?: keyof typeof Ionicons.glyphMap;
};

// Cor de fundo, da borda e do texto de cada variante.
const visual: Record<Variante, { fundo: string; borda: string; texto: string }> = {
  primario: { fundo: cores.primariaEscura, borda: cores.primariaEscura, texto: cores.superficie },
  secundario: { fundo: cores.superficie, borda: cores.primariaEscura, texto: cores.primariaEscura },
  perigo: { fundo: cores.superficie, borda: cores.cancelado, texto: cores.cancelado },
  whatsapp: { fundo: cores.whatsapp, borda: cores.whatsapp, texto: cores.superficie },
};

export default function Botao({
  titulo,
  aoPressar,
  carregando = false,
  desativado = false,
  variante = "primario",
  icone,
}: Props) {
  const { fundo, borda, texto } = visual[variante];

  return (
    <Pressable
      onPress={aoPressar}
      disabled={carregando || desativado}
      style={({ pressed }) => [
        estilos.botao,
        { backgroundColor: fundo, borderColor: borda },
        pressed && estilos.pressionado,
        desativado && estilos.desativado,
      ]}
    >
      {carregando ? (
        <ActivityIndicator color={texto} />
      ) : (
        <>
          {icone ? <Ionicons name={icone} size={20} color={texto} /> : null}
          <Text style={[estilos.texto, { color: texto }]}>{titulo}</Text>
        </>
      )}
    </Pressable>
  );
}

const estilos = StyleSheet.create({
  botao: {
    height: 54,
    borderRadius: 16,
    borderWidth: 1.5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingHorizontal: 18,
  },
  pressionado: { opacity: 0.85, transform: [{ scale: 0.98 }] },
  desativado: { opacity: 0.45 },
  texto: { fontSize: 16, fontWeight: "700" },
});
