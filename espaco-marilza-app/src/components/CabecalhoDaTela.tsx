import { ReactNode } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { cores, fontes } from "../theme/cores";

type Props = {
  sobretitulo: string; // texto pequeno em cima do título
  titulo: string;
  acoes?: ReactNode; // botões que ficam à direita
  children?: ReactNode; // conteúdo extra dentro da área vinho
};

// Faixa vinho com cantos arredondados que abre as telas principais do app.
export default function CabecalhoDaTela({ sobretitulo, titulo, acoes, children }: Props) {
  const margens = useSafeAreaInsets(); // espaço da barra de status do celular

  return (
    <View style={[estilos.cabecalho, { paddingTop: margens.top + 18 }]}>
      {/* Círculos decorativos ao fundo */}
      <View style={[estilos.circulo, estilos.circuloGrande]} />
      <View style={[estilos.circulo, estilos.circuloPequeno]} />

      <View style={estilos.linha}>
        <View style={{ flex: 1 }}>
          <Text style={estilos.sobretitulo}>{sobretitulo.toUpperCase()}</Text>
          <Text style={estilos.titulo}>{titulo}</Text>
        </View>
        {acoes ? <View style={estilos.acoes}>{acoes}</View> : null}
      </View>

      {children}
    </View>
  );
}

const estilos = StyleSheet.create({
  cabecalho: {
    backgroundColor: cores.primariaEscura,
    paddingHorizontal: 20,
    paddingBottom: 22,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    overflow: "hidden",
  },
  circulo: { position: "absolute", borderRadius: 999, backgroundColor: "rgba(255,255,255,0.06)" },
  circuloGrande: { width: 220, height: 220, top: -90, right: -60 },
  circuloPequeno: { width: 120, height: 120, bottom: -50, left: -30 },
  linha: { flexDirection: "row", alignItems: "center", gap: 12 },
  sobretitulo: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 2,
    color: cores.dourado,
    marginBottom: 4,
  },
  titulo: {
    fontFamily: fontes.titulo,
    fontSize: 30,
    fontWeight: "700",
    color: cores.textoSobreVinho,
  },
  acoes: { flexDirection: "row", gap: 10 },
});
