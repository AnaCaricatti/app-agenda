import { View, Text, Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { cores } from "../theme/cores";
import {
  DIAS_CURTOS,
  inicioDaSemana,
  paraISO,
  somarDias,
  tituloDoMes,
} from "../utils/datas";

type Props = {
  dataSelecionada: Date;
  aoSelecionar: (data: Date) => void;
};

export default function SeletorDeData({ dataSelecionada, aoSelecionar }: Props) {
  const inicio = inicioDaSemana(dataSelecionada);
  const diasDaSemana = Array.from({ length: 7 }, (_, i) => somarDias(inicio, i));
  const hojeISO = paraISO(new Date());
  const selecionadaISO = paraISO(dataSelecionada);

  return (
    <View style={estilos.caixa}>
      <View style={estilos.topo}>
        <Pressable onPress={() => aoSelecionar(somarDias(dataSelecionada, -7))} hitSlop={12}>
          <Ionicons name="chevron-back" size={22} color={cores.primariaEscura} />
        </Pressable>

        <Text style={estilos.mes}>{tituloDoMes(dataSelecionada)}</Text>

        <Pressable onPress={() => aoSelecionar(somarDias(dataSelecionada, 7))} hitSlop={12}>
          <Ionicons name="chevron-forward" size={22} color={cores.primariaEscura} />
        </Pressable>
      </View>

      <View style={estilos.linha}>
        {diasDaSemana.map((dia) => {
          const iso = paraISO(dia);
          const selecionado = iso === selecionadaISO;
          const ehHoje = iso === hojeISO;

          return (
            <Pressable
              key={iso}
              onPress={() => aoSelecionar(dia)}
              style={[
                estilos.dia,
                ehHoje && estilos.hoje,
                selecionado && estilos.diaSelecionado,
              ]}
            >
              <Text style={[estilos.nomeDia, selecionado && estilos.textoSelecionado]}>
                {DIAS_CURTOS[dia.getDay()]}
              </Text>
              <Text style={[estilos.numeroDia, selecionado && estilos.textoSelecionado]}>
                {dia.getDate()}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const estilos = StyleSheet.create({
  caixa: {
    backgroundColor: cores.superficie,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: cores.borda,
    padding: 12,
  },
  topo: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  mes: { fontSize: 16, fontWeight: "700", color: cores.texto },
  linha: { flexDirection: "row" },
  dia: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 10,
    borderRadius: 14,
    marginHorizontal: 2,
    borderWidth: 1.5,
    borderColor: "transparent",
  },
  hoje: { borderColor: cores.primaria },
  diaSelecionado: { backgroundColor: cores.primariaEscura, borderColor: cores.primariaEscura },
  nomeDia: { fontSize: 12, color: cores.textoSuave, marginBottom: 4 },
  numeroDia: { fontSize: 16, fontWeight: "700", color: cores.texto },
  textoSelecionado: { color: cores.superficie },
});