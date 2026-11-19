import { View, Text, StyleSheet } from "react-native";
import { cores } from "../theme/cores";
import { StatusAgendamento } from "../types/agendamento";
import { corDoStatus, nomeDoStatus } from "../utils/status";

// Etiqueta colorida com o status do agendamento (Pendente, Confirmado, Cancelado).
export default function SeloStatus({ status }: { status: StatusAgendamento }) {
  const cor = corDoStatus[status];

  return (
    // "${cor}26" deixa a cor do status bem clarinha (transparente) no fundo
    <View style={[estilos.selo, { backgroundColor: `${cor}26` }]}>
      <View style={[estilos.bolinha, { backgroundColor: cor }]} />
      <Text style={estilos.texto}>{nomeDoStatus[status]}</Text>
    </View>
  );
}

const estilos = StyleSheet.create({
  selo: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    gap: 6,
    borderRadius: 20,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  bolinha: { width: 8, height: 8, borderRadius: 4 },
  texto: { fontSize: 12, fontWeight: "700", color: cores.texto },
});
