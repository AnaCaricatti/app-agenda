import { View, Text, Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import SeloStatus from "./SeloStatus";
import { cores, sombra } from "../theme/cores";
import { Agendamento } from "../types/agendamento";
import { corDoStatus } from "../utils/status";

type Props = {
  agendamento: Agendamento;
  aoPressar: () => void; // abre os detalhes
  aoConfirmar: () => void; // só aparece se estiver pendente
  aoEnviarWhatsApp: () => void; // só aparece se estiver confirmado
};

export default function CardAgendamento({
  agendamento,
  aoPressar,
  aoConfirmar,
  aoEnviarWhatsApp,
}: Props) {
  const { status } = agendamento;
  const cancelado = status === "cancelado";

  return (
    <Pressable
      onPress={aoPressar}
      style={({ pressed }) => [estilos.card, pressed && estilos.pressionado]}
    >
      {/* Faixa lateral com a cor do status */}
      <View style={[estilos.faixa, { backgroundColor: corDoStatus[status] }]} />

      <View style={estilos.colunaHorario}>
        <Text style={estilos.horario}>{agendamento.horario}</Text>
        <Text style={estilos.horarioFim}>{agendamento.horarioFim}</Text>
      </View>

      <View style={estilos.info}>
        <Text style={[estilos.cliente, cancelado && estilos.riscado]} numberOfLines={1}>
          {agendamento.clienteNome}
        </Text>
        <Text style={estilos.servico} numberOfLines={1}>
          {agendamento.servico}
        </Text>
        <View style={{ marginTop: 8 }}>
          <SeloStatus status={status} />
        </View>
      </View>

      {/* Atalho que muda conforme o status */}
      {status === "pendente" && (
        <Pressable onPress={aoConfirmar} style={[estilos.atalho, estilos.atalhoConfirmar]} hitSlop={6}>
          <Ionicons name="checkmark" size={22} color={cores.superficie} />
        </Pressable>
      )}
      {status === "confirmado" && (
        <Pressable onPress={aoEnviarWhatsApp} style={[estilos.atalho, estilos.atalhoWhats]} hitSlop={6}>
          <Ionicons name="logo-whatsapp" size={22} color={cores.superficie} />
        </Pressable>
      )}
    </Pressable>
  );
}

const estilos = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: cores.superficie,
    borderRadius: 20,
    padding: 14,
    paddingLeft: 20,
    marginBottom: 12,
    gap: 14,
    overflow: "hidden",
    ...sombra,
  },
  pressionado: { opacity: 0.9, transform: [{ scale: 0.99 }] },
  faixa: { position: "absolute", left: 0, top: 0, bottom: 0, width: 6 },
  colunaHorario: { alignItems: "center", minWidth: 52 },
  horario: { fontSize: 18, fontWeight: "800", color: cores.primariaEscura },
  horarioFim: { fontSize: 12, color: cores.textoSuave, marginTop: 2 },
  info: { flex: 1 },
  cliente: { fontSize: 16, fontWeight: "700", color: cores.texto },
  riscado: { textDecorationLine: "line-through", color: cores.textoSuave },
  servico: { fontSize: 13, color: cores.textoSuave, marginTop: 2 },
  atalho: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  atalhoConfirmar: { backgroundColor: cores.confirmado },
  atalhoWhats: { backgroundColor: cores.whatsapp },
});
