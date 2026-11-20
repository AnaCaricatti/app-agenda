import { useEffect, useState } from "react";
import { View, Text, ScrollView, Pressable, ActivityIndicator, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import * as Clipboard from "expo-clipboard";

import Aviso, { useAviso } from "../../components/Aviso";
import BotaoIcone from "../../components/BotaoIcone";
import CabecalhoDaTela from "../../components/CabecalhoDaTela";
import CalendarioDoMes from "../../components/CalendarioDoMes";
import CardAgendamento from "../../components/CardAgendamento";
import SeletorDeData from "../../components/SeletorDeData";
import { useAuth } from "../../contexts/AuthContext";
import { atualizarStatus, observarAgendamentos } from "../../services/agendamentosService";
import { cores, fontes, sombra } from "../../theme/cores";
import { Agendamento } from "../../types/agendamento";
import { LINK_AGENDAMENTO } from "../../utils/config";
import { dataPorExtenso, inicioDaSemana, paraISO, somarDias } from "../../utils/datas";
import { mensagens } from "../../utils/mensagens";
import { enviarConfirmacaoPeloWhatsApp } from "../../utils/whatsapp";

type Visao = "dia" | "semana" | "mes";

const NOME_DA_VISAO: Record<Visao, string> = { dia: "Dia", semana: "Semana", mes: "Mês" };

// Primeiro e último dia do período mostrado em cada visão.
function calcularPeriodo(visao: Visao, data: Date): [Date, Date] {
  if (visao === "dia") return [data, data];
  if (visao === "semana") {
    const segunda = inicioDaSemana(data);
    return [segunda, somarDias(segunda, 6)];
  }
  const ano = data.getFullYear();
  const mes = data.getMonth();
  return [new Date(ano, mes, 1), new Date(ano, mes + 1, 0)]; // dia 0 do mês seguinte = último deste
}

export default function TelaAgenda() {
  const router = useRouter();
  const { sair } = useAuth();
  const { aviso, mostrarAviso } = useAviso();

  const [visao, setVisao] = useState<Visao>("dia");
  const [dataSelecionada, setDataSelecionada] = useState(new Date());
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [periodoCarregado, setPeriodoCarregado] = useState(""); // último período que chegou do banco
  const [erroConexao, setErroConexao] = useState(false);

  // Período que a tela mostra, conforme a aba escolhida (um dia, a semana ou o mês).
  const [primeiroDia, ultimoDia] = calcularPeriodo(visao, dataSelecionada);
  const dataInicial = paraISO(primeiroDia);
  const dataFinal = paraISO(ultimoDia);

  // Enquanto os dados do período atual não chegam, mostra o "carregando".
  const periodo = `${dataInicial}_${dataFinal}`;
  const carregando = periodoCarregado !== periodo;

  // Fica "escutando" o Firebase: quando uma cliente marca pelo site,
  // o agendamento aparece aqui sozinho, sem precisar atualizar a tela.
  useEffect(() => {
    const parar = observarAgendamentos(
      dataInicial,
      dataFinal,
      (lista) => {
        setAgendamentos(lista);
        setErroConexao(false);
        setPeriodoCarregado(periodo);
      },
      () => {
        setAgendamentos([]);
        setErroConexao(true);
        setPeriodoCarregado(periodo);
      }
    );
    return parar; // desliga a escuta ao trocar de período ou sair da tela
  }, [dataInicial, dataFinal, periodo]);

  async function copiarLink() {
    await Clipboard.setStringAsync(LINK_AGENDAMENTO);
    mostrarAviso(mensagens.MSG02);
  }

  async function confirmar(agendamento: Agendamento) {
    try {
      await atualizarStatus(agendamento.id, "confirmado");
      mostrarAviso(mensagens.MSG03);
    } catch {
      mostrarAviso(mensagens.ERRO_CONEXAO, "erro");
    }
  }

  function abrirDetalhes(agendamento: Agendamento) {
    router.push({ pathname: "/agendamento/[id]", params: { id: agendamento.id } });
  }

  function renderizarCard(agendamento: Agendamento) {
    return (
      <CardAgendamento
        key={agendamento.id}
        agendamento={agendamento}
        aoPressar={() => abrirDetalhes(agendamento)}
        aoConfirmar={() => confirmar(agendamento)}
        aoEnviarWhatsApp={() => enviarConfirmacaoPeloWhatsApp(agendamento)}
      />
    );
  }

  // Números do resumo que aparece no cabeçalho.
  const pendentes = agendamentos.filter((a) => a.status === "pendente").length;
  const confirmados = agendamentos.filter((a) => a.status === "confirmado").length;
  const quando = { dia: "no dia", semana: "na semana", mes: "no mês" }[visao];

  // Na visão da semana, os cards são agrupados por dia.
  const diasDaSemana = Array.from({ length: 7 }, (_, i) => paraISO(somarDias(primeiroDia, i)));

  // Na visão do mês, o calendário pinta os dias que têm algo marcado (cancelados não contam).
  const diasComAgendamento = agendamentos.filter((a) => a.status !== "cancelado").map((a) => a.data);

  // Tocar em um dia do calendário abre a agenda daquele dia.
  function abrirDia(dia: Date) {
    setDataSelecionada(dia);
    setVisao("dia");
  }

  return (
    <View style={estilos.tela}>
      <CabecalhoDaTela
        sobretitulo="Espaço Marilza Caricatti"
        titulo="Minha agenda"
        acoes={
          <>
            <BotaoIcone icone="link-outline" aoPressar={copiarLink} descricao="Copiar link do site" />
            <BotaoIcone icone="log-out-outline" aoPressar={sair} descricao="Sair" />
          </>
        }
      >
        <View style={estilos.resumo}>
          <CaixaResumo numero={pendentes} rotulo={`Pendentes ${quando}`} destaque />
          <CaixaResumo numero={confirmados} rotulo={`Confirmados ${quando}`} />
        </View>
      </CabecalhoDaTela>

      <ScrollView contentContainerStyle={estilos.conteudo}>
        {/* Abas Dia / Semana / Mês */}
        <View style={estilos.abas}>
          {(["dia", "semana", "mes"] as Visao[]).map((opcao) => (
            <Pressable
              key={opcao}
              onPress={() => setVisao(opcao)}
              style={[estilos.aba, visao === opcao && estilos.abaAtiva]}
            >
              <Text style={[estilos.textoAba, visao === opcao && estilos.textoAbaAtiva]}>
                {NOME_DA_VISAO[opcao]}
              </Text>
            </Pressable>
          ))}
        </View>

        {visao === "mes" ? (
          <CalendarioDoMes
            mes={dataSelecionada}
            diasComAgendamento={carregando ? [] : diasComAgendamento}
            aoMudarMes={setDataSelecionada}
            aoEscolherDia={abrirDia}
          />
        ) : (
          <SeletorDeData dataSelecionada={dataSelecionada} aoSelecionar={setDataSelecionada} />
        )}

        {erroConexao ? (
          <View style={estilos.alertaErro}>
            <Ionicons name="cloud-offline-outline" size={20} color={cores.cancelado} />
            <Text style={estilos.textoAlerta}>{mensagens.ERRO_CONEXAO}</Text>
          </View>
        ) : null}

        {visao === "mes" ? (
          <Text style={estilos.dicaDoMes}>Toque em um dia para ver os agendamentos dele.</Text>
        ) : carregando ? (
          <ActivityIndicator color={cores.primariaEscura} style={{ marginTop: 40 }} />
        ) : (
          <View style={{ marginTop: 24 }}>
            {visao === "dia" && (
              <>
                <Text style={estilos.tituloLista}>{dataPorExtenso(dataInicial)}</Text>
                {agendamentos.map(renderizarCard)}
              </>
            )}

            {visao === "semana" &&
              diasDaSemana.map((iso) => {
                const doDia = agendamentos.filter((a) => a.data === iso);
                if (doDia.length === 0) return null; // não mostra dias vazios
                return (
                  <View key={iso} style={{ marginBottom: 8 }}>
                    <Text style={estilos.tituloLista}>{dataPorExtenso(iso)}</Text>
                    {doDia.map(renderizarCard)}
                  </View>
                );
              })}

            {agendamentos.length === 0 && !erroConexao && (
              <View style={estilos.vazio}>
                <Ionicons name="flower-outline" size={44} color={cores.primaria} />
                <Text style={estilos.textoVazio}>
                  Nenhum agendamento {visao === "dia" ? "neste dia" : "nesta semana"}.
                </Text>
              </View>
            )}
          </View>
        )}
      </ScrollView>

      {/* Botão flutuante: a profissional marca um horário pelo próprio app */}
      <Pressable
        onPress={() => router.push("/agendamento/novo")}
        style={({ pressed }) => [estilos.botaoNovo, pressed && { transform: [{ scale: 0.96 }] }]}
      >
        <Ionicons name="add" size={24} color={cores.superficie} />
        <Text style={estilos.textoBotaoNovo}>Agendar</Text>
      </Pressable>

      <Aviso aviso={aviso} />
    </View>
  );
}

// Caixinha com um número grande e uma legenda, dentro do cabeçalho.
function CaixaResumo({
  numero,
  rotulo,
  destaque = false,
}: {
  numero: number;
  rotulo: string;
  destaque?: boolean;
}) {
  return (
    <View style={[estilos.caixaResumo, destaque && numero > 0 && estilos.caixaDestaque]}>
      <Text style={estilos.numeroResumo}>{numero}</Text>
      <Text style={estilos.rotuloResumo}>{rotulo}</Text>
    </View>
  );
}

const estilos = StyleSheet.create({
  tela: { flex: 1, backgroundColor: cores.fundo },
  resumo: { flexDirection: "row", gap: 12, marginTop: 20 },
  caixaResumo: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.12)",
    borderRadius: 18,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  caixaDestaque: { backgroundColor: cores.dourado },
  numeroResumo: {
    fontFamily: fontes.titulo,
    fontSize: 30,
    fontWeight: "700",
    color: cores.textoSobreVinho,
  },
  rotuloResumo: { fontSize: 12, fontWeight: "600", color: cores.textoSobreVinho, opacity: 0.85 },
  conteudo: { padding: 20, paddingBottom: 110 },
  abas: {
    flexDirection: "row",
    backgroundColor: cores.primariaClara,
    borderRadius: 16,
    padding: 4,
    marginBottom: 16,
  },
  aba: { flex: 1, paddingVertical: 10, borderRadius: 12, alignItems: "center" },
  abaAtiva: { backgroundColor: cores.superficie },
  textoAba: { fontSize: 14, fontWeight: "700", color: cores.textoSuave },
  textoAbaAtiva: { color: cores.primariaEscura },
  alertaErro: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: cores.primariaClara,
    borderRadius: 14,
    padding: 12,
    marginTop: 16,
  },
  textoAlerta: { flex: 1, fontSize: 14, color: cores.texto },
  tituloLista: {
    fontFamily: fontes.titulo,
    fontSize: 20,
    fontWeight: "700",
    color: cores.texto,
    marginBottom: 12,
  },
  dicaDoMes: { fontSize: 14, color: cores.textoSuave, textAlign: "center", marginTop: 18 },
  vazio: { alignItems: "center", marginTop: 32, gap: 10 },
  textoVazio: { fontSize: 15, color: cores.textoSuave },
  botaoNovo: {
    position: "absolute",
    right: 20,
    bottom: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: cores.primariaEscura,
    borderRadius: 30,
    paddingVertical: 14,
    paddingLeft: 16,
    paddingRight: 22,
    ...sombra,
    shadowOpacity: 0.3,
  },
  textoBotaoNovo: { color: cores.superficie, fontSize: 16, fontWeight: "700" },
});
