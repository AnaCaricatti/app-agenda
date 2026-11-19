import { useCallback, useRef, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { cores, sombra } from "../theme/cores";

type Tipo = "sucesso" | "erro";
type DadosDoAviso = { texto: string; tipo: Tipo } | null;

// Controla o aviso rápido que aparece no rodapé da tela e some sozinho.
// Uso na tela:
//   const { aviso, mostrarAviso } = useAviso();
//   mostrarAviso("Salvo com sucesso!");
//   ... <Aviso aviso={aviso} />
export function useAviso() {
  const [aviso, setAviso] = useState<DadosDoAviso>(null);
  const temporizador = useRef<ReturnType<typeof setTimeout> | null>(null);

  const mostrarAviso = useCallback((texto: string, tipo: Tipo = "sucesso") => {
    if (temporizador.current) clearTimeout(temporizador.current);
    setAviso({ texto, tipo });
    temporizador.current = setTimeout(() => setAviso(null), 3000);
  }, []);

  return { aviso, mostrarAviso };
}

export default function Aviso({ aviso }: { aviso: DadosDoAviso }) {
  if (!aviso) return null;
  const ehErro = aviso.tipo === "erro";

  return (
    <View style={[estilos.aviso, ehErro && estilos.erro]} pointerEvents="none">
      <Ionicons
        name={ehErro ? "alert-circle" : "checkmark-circle"}
        size={20}
        color={cores.superficie}
      />
      <Text style={estilos.texto}>{aviso.texto}</Text>
    </View>
  );
}

const estilos = StyleSheet.create({
  aviso: {
    position: "absolute",
    bottom: 24,
    left: 20,
    right: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: cores.vinhoEscuro,
    borderRadius: 16,
    padding: 14,
    ...sombra,
  },
  erro: { backgroundColor: cores.cancelado },
  texto: { flex: 1, color: cores.superficie, fontSize: 14, fontWeight: "600" },
});
