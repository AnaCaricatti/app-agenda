import { useEffect, useState } from "react";
import { View, Text, ScrollView, Pressable, ActivityIndicator, StyleSheet } from "react-native";

import Aviso, { useAviso } from "../../components/Aviso";
import Botao from "../../components/Botao";
import CabecalhoDaTela from "../../components/CabecalhoDaTela";
import ChipHorario from "../../components/ChipHorario";
import { observarExpediente, salvarExpediente } from "../../services/expedienteService";
import { cores, fontes, sombra } from "../../theme/cores";
import { Expediente, EXPEDIENTE_VAZIO } from "../../types/expediente";
import { DIAS_CURTOS } from "../../utils/datas";
import { gerarOpcoesDeHorario } from "../../utils/horarios";
import { mensagens } from "../../utils/mensagens";

const OPCOES = gerarOpcoesDeHorario(); // 07:00, 07:30 ... 20:30
const DIAS_UTEIS = ["1", "2", "3", "4", "5"]; // segunda a sexta

// Tela onde a profissional escolhe quais horários ficam disponíveis no site.
export default function TelaHorarios() {
  const { aviso, mostrarAviso } = useAviso();

  const [expediente, setExpediente] = useState<Expediente>(EXPEDIENTE_VAZIO);
  const [diaSelecionado, setDiaSelecionado] = useState("1"); // começa na segunda
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [temAlteracao, setTemAlteracao] = useState(false);

  useEffect(() => {
    return observarExpediente(
      (salvo) => {
        setExpediente(salvo);
        setTemAlteracao(false);
        setCarregando(false);
      },
      () => {
        mostrarAviso(mensagens.ERRO_CONEXAO, "erro");
        setCarregando(false);
      }
    );
  }, [mostrarAviso]);

  const horariosDoDia = expediente[diaSelecionado];

  // Troca a lista de horários de um dia e marca que há algo para salvar.
  function alterarDia(dia: string, horarios: string[]) {
    setExpediente({ ...expediente, [dia]: horarios });
    setTemAlteracao(true);
  }

  // Liga ou desliga um horário no dia selecionado.
  function alternarHorario(horario: string) {
    const jaMarcado = horariosDoDia.includes(horario);
    const novaLista = jaMarcado
      ? horariosDoDia.filter((h) => h !== horario)
      : [...horariosDoDia, horario].sort();
    alterarDia(diaSelecionado, novaLista);
  }

  // Copia os horários do dia selecionado para todos os dias de segunda a sexta.
  function copiarParaDiasUteis() {
    const novo = { ...expediente };
    DIAS_UTEIS.forEach((dia) => (novo[dia] = [...horariosDoDia]));
    setExpediente(novo);
    setTemAlteracao(true);
    mostrarAviso("Horários copiados para segunda a sexta. Toque em salvar para publicar.");
  }

  async function salvar() {
    setSalvando(true);
    try {
      await salvarExpediente(expediente);
      mostrarAviso(mensagens.MSG07);
    } catch {
      mostrarAviso(mensagens.ERRO_CONEXAO, "erro");
    } finally {
      setSalvando(false);
    }
  }

  return (
    <View style={estilos.tela}>
      <CabecalhoDaTela sobretitulo="Disponíveis no site" titulo="Meus horários" />

      {carregando ? (
        <ActivityIndicator color={cores.primariaEscura} style={{ marginTop: 40 }} />
      ) : (
        <ScrollView contentContainerStyle={estilos.conteudo}>
          <Text style={estilos.explicacao}>
            Escolha um dia e toque nos horários que você quer oferecer. As clientes só conseguem
            agendar no site nos horários marcados aqui.
          </Text>

          {/* Dias da semana. O número embaixo mostra quantos horários o dia tem. */}
          <View style={estilos.dias}>
            {DIAS_CURTOS.map((nome, indice) => {
              const dia = String(indice);
              const selecionado = dia === diaSelecionado;
              const quantidade = expediente[dia].length;
              return (
                <Pressable
                  key={dia}
                  onPress={() => setDiaSelecionado(dia)}
                  style={[estilos.dia, selecionado && estilos.diaSelecionado]}
                >
                  <Text style={[estilos.nomeDia, selecionado && estilos.textoClaro]}>{nome}</Text>
                  <Text style={[estilos.quantidade, selecionado && estilos.textoClaro]}>
                    {quantidade}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <View style={estilos.cartao}>
            <Text style={estilos.tituloCartao}>
              {horariosDoDia.length === 0
                ? "Sem atendimento neste dia"
                : `${horariosDoDia.length} horário${horariosDoDia.length === 1 ? "" : "s"} disponíve${horariosDoDia.length === 1 ? "l" : "is"}`}
            </Text>

            <View style={estilos.grade}>
              {OPCOES.map((horario) => (
                <ChipHorario
                  key={horario}
                  texto={horario}
                  selecionado={horariosDoDia.includes(horario)}
                  aoPressar={() => alternarHorario(horario)}
                />
              ))}
            </View>

            <View style={estilos.atalhos}>
              <Pressable onPress={copiarParaDiasUteis} hitSlop={6}>
                <Text style={estilos.linkAtalho}>Copiar para seg. a sex.</Text>
              </Pressable>
              <Pressable onPress={() => alterarDia(diaSelecionado, [])} hitSlop={6}>
                <Text style={[estilos.linkAtalho, { color: cores.cancelado }]}>Limpar dia</Text>
              </Pressable>
            </View>
          </View>

          <Botao
            titulo={temAlteracao ? "Salvar e publicar no site" : "Tudo salvo"}
            icone={temAlteracao ? "cloud-upload-outline" : "checkmark-circle-outline"}
            aoPressar={salvar}
            carregando={salvando}
            desativado={!temAlteracao}
          />
        </ScrollView>
      )}

      <Aviso aviso={aviso} />
    </View>
  );
}

const estilos = StyleSheet.create({
  tela: { flex: 1, backgroundColor: cores.fundo },
  conteudo: { padding: 20, paddingBottom: 90, gap: 18 },
  explicacao: { fontSize: 14, lineHeight: 21, color: cores.textoSuave },
  dias: { flexDirection: "row", gap: 6 },
  dia: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 10,
    borderRadius: 16,
    backgroundColor: cores.superficie,
    borderWidth: 1.5,
    borderColor: cores.borda,
  },
  diaSelecionado: { backgroundColor: cores.primariaEscura, borderColor: cores.primariaEscura },
  nomeDia: { fontSize: 12, fontWeight: "600", color: cores.textoSuave },
  quantidade: { fontSize: 17, fontWeight: "800", color: cores.texto, marginTop: 2 },
  textoClaro: { color: cores.superficie },
  cartao: { backgroundColor: cores.superficie, borderRadius: 24, padding: 18, ...sombra },
  tituloCartao: {
    fontFamily: fontes.titulo,
    fontSize: 19,
    fontWeight: "700",
    color: cores.texto,
    marginBottom: 14,
  },
  grade: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  atalhos: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 18,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: cores.borda,
  },
  linkAtalho: { fontSize: 14, fontWeight: "700", color: cores.primariaEscura },
});
