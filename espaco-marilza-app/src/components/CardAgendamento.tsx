import { View, Text, Pressable, StyleSheet } from "react-native";
import { cores } from "../theme/cores";
import { Agendamento, StatusAgendamento } from "../types/agendamento";

const corDoStatus: Record<StatusAgendamento, string> = {
  pendente: cores.pendente,
  confirmado: cores.confirmado,
  cancelado: cores.cancelado,
};

const nomeDoStatus: Record<StatusAgendamento, string> = {
  pendente: "Pendente",
  confirmado: "Confirmado",
  cancelado: "Cancelado",
};

type Props = {
  agendamento: Agendamento;
  aoPressar: () => void;
};

export default function CardAgendamento({ agendamento, aoPressar }: Props) {
  const cor = corDoStatus[agendamento.status];
  const cancelado = agendamento.status === "cancelado";

  return (
    <Pressable
      onPress={aoPressar}
      style={({ pressed }) => [estilos.card, pressed && estilos.pressionado]}
    >
      <View style={estilos.colunaHorario}>
        <Text style={estilos.horario}>{agendamento.horario}</Text>
      </View>

      <View style={estilos.info}>
        <Text style={[estilos.cliente, cancelado && estilos.riscado]} numberOfLines={1}>
          {agendamento.clienteNome}
        </Text>
        <Text style={estilos.servico} numberOfLines={1}>
          {agendamento.servico}
        </Text>
      </View>

      {/* "${cor}55" adiciona transparência à cor do status */}
      <View style={[estilos.selo, { backgroundColor: `${cor}55` }]}>
        <View style={[estilos.bolinha, { backgroundColor: cor }]} />
        <Text style={estilos.textoSelo}>{nomeDoStatus[agendamento.status]}</Text>
      </View>
    </Pressable>
  );
}

const estilos = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: cores.superficie,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: cores.borda,
    padding: 14,
    marginBottom: 10,
    gap: 12,
  },
  pressionado: { opacity: 0.85 },
  colunaHorario: {
    backgroundColor: cores.primariaClara,
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  horario: { fontSize: 15, fontWeight: "700", color: cores.primariaEscura },
  info: { flex: 1 },
  cliente: { fontSize: 16, fontWeight: "600", color: cores.texto },
  riscado: { textDecorationLine: "line-through", color: cores.textoSuave },
  servico: { fontSize: 13, color: cores.textoSuave, marginTop: 2 },
  selo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderRadius: 20,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  bolinha: { width: 8, height: 8, borderRadius: 4 },
  textoSelo: { fontSize: 12, fontWeight: "600", color: cores.texto },
});