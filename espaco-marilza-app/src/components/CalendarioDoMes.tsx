import { View, Text, Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { cores, sombra } from "../theme/cores";
import { DIAS_CURTOS, paraISO, tituloDoMes } from "../utils/datas";

type Props = {
  mes: Date; // qualquer dia do mês que deve ser mostrado
  diasComAgendamento: string[]; // datas "2026-11-16" que têm algo marcado
  aoMudarMes: (novoMes: Date) => void;
  aoEscolherDia: (dia: Date) => void;
};

// Calendário do mês inteiro. Os dias com algum agendamento ficam em vinho.
export default function CalendarioDoMes({
  mes,
  diasComAgendamento,
  aoMudarMes,
  aoEscolherDia,
}: Props) {
  const ano = mes.getFullYear();
  const numeroDoMes = mes.getMonth();
  const hojeISO = paraISO(new Date());

  const diasNoMes = new Date(ano, numeroDoMes + 1, 0).getDate();
  const espacosAntes = new Date(ano, numeroDoMes, 1).getDay(); // dia da semana em que o mês começa

  // Lista com os "quadradinhos" do calendário: vazios no começo e depois os dias.
  const quadrados: (Date | null)[] = [
    ...Array(espacosAntes).fill(null),
    ...Array.from({ length: diasNoMes }, (_, i) => new Date(ano, numeroDoMes, i + 1)),
  ];

  return (
    <View style={estilos.caixa}>
      <View style={estilos.topo}>
        <Pressable
          onPress={() => aoMudarMes(new Date(ano, numeroDoMes - 1, 1))}
          hitSlop={12}
          accessibilityLabel="Mês anterior"
        >
          <Ionicons name="chevron-back" size={22} color={cores.primariaEscura} />
        </Pressable>

        <Text style={estilos.mes}>{tituloDoMes(mes)}</Text>

        <Pressable
          onPress={() => aoMudarMes(new Date(ano, numeroDoMes + 1, 1))}
          hitSlop={12}
          accessibilityLabel="Próximo mês"
        >
          <Ionicons name="chevron-forward" size={22} color={cores.primariaEscura} />
        </Pressable>
      </View>

      {/* Dom, Seg, Ter... */}
      <View style={estilos.grade}>
        {DIAS_CURTOS.map((nome) => (
          <View key={nome} style={estilos.quadrado}>
            <Text style={estilos.nomeDia}>{nome}</Text>
          </View>
        ))}
      </View>

      <View style={estilos.grade}>
        {quadrados.map((dia, indice) => {
          if (!dia) return <View key={`vazio-${indice}`} style={estilos.quadrado} />;

          const iso = paraISO(dia);
          const temAgendamento = diasComAgendamento.includes(iso);
          const ehHoje = iso === hojeISO;

          return (
            <View key={iso} style={estilos.quadrado}>
              <Pressable
                onPress={() => aoEscolherDia(dia)}
                style={({ pressed }) => [
                  estilos.dia,
                  ehHoje && estilos.hoje,
                  temAgendamento && estilos.diaComAgendamento,
                  pressed && { opacity: 0.7 },
                ]}
              >
                <Text style={[estilos.numero, temAgendamento && estilos.numeroClaro]}>
                  {dia.getDate()}
                </Text>
              </Pressable>
            </View>
          );
        })}
      </View>

      <View style={estilos.legenda}>
        <View style={estilos.itemLegenda}>
          <View style={[estilos.amostra, estilos.diaComAgendamento]} />
          <Text style={estilos.textoLegenda}>Com agendamento</Text>
        </View>
        <View style={estilos.itemLegenda}>
          <View style={[estilos.amostra, estilos.hoje]} />
          <Text style={estilos.textoLegenda}>Hoje</Text>
        </View>
      </View>
    </View>
  );
}

const estilos = StyleSheet.create({
  caixa: { backgroundColor: cores.superficie, borderRadius: 24, padding: 14, ...sombra },
  topo: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
    paddingHorizontal: 6,
  },
  mes: { fontSize: 16, fontWeight: "700", color: cores.texto },
  grade: { flexDirection: "row", flexWrap: "wrap" },
  // Cada quadrado ocupa 1/7 da largura (são 7 dias na semana).
  quadrado: { width: `${100 / 7}%`, alignItems: "center", paddingVertical: 3 },
  nomeDia: { fontSize: 12, color: cores.textoSuave, marginBottom: 4 },
  dia: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: "transparent",
  },
  hoje: { borderColor: cores.primaria },
  diaComAgendamento: { backgroundColor: cores.primariaEscura, borderColor: cores.primariaEscura },
  numero: { fontSize: 15, fontWeight: "600", color: cores.texto },
  numeroClaro: { color: cores.superficie, fontWeight: "800" },
  legenda: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 20,
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: cores.borda,
  },
  itemLegenda: { flexDirection: "row", alignItems: "center", gap: 6 },
  amostra: { width: 14, height: 14, borderRadius: 7, borderWidth: 1.5, borderColor: "transparent" },
  textoLegenda: { fontSize: 12, color: cores.textoSuave },
});
