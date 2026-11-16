import { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  ActivityIndicator,
  Alert,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import * as Clipboard from "expo-clipboard";

import SeletorDeData from "../components/SeletorDeData";
import CardAgendamento from "../components/CardAgendamento";
import { cores } from "../theme/cores";
import { mensagens } from "../utils/mensagens";
import { LINK_AGENDAMENTO } from "../utils/config";
import { Agendamento } from "../types/agendamento";
import { buscarAgendamentos } from "../services/agendamentosService";
import { dataPorExtenso, inicioDaSemana, paraISO, somarDias } from "../utils/datas";

type Visao = "dia" | "semana";

export default function TelaAgenda() {
  const router = useRouter();

  const [visao, setVisao] = useState<Visao>("dia");
  const [dataSelecionada, setDataSelecionada] = useState(new Date());
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erroConexao, setErroConexao] = useState<string | null>(null);
  const [aviso, setAviso] = useState<string | null>(null);

  // Período que a tela precisa buscar, conforme a aba escolhida.
  const segunda = inicioDaSemana(dataSelecionada);
  const dataInicial = visao === "dia" ? paraISO(dataSelecionada) : paraISO(segunda);
  const dataFinal = visao === "dia" ? paraISO(dataSelecionada) : paraISO(somarDias(segunda, 6));

  // Roda sempre que o período muda (trocar de dia, de semana ou de aba).
  useEffect(() => {
    let desatualizado = false; // evita mostrar uma resposta antiga se o período já mudou

    async function carregar() {
      setCarregando(true);
      setErroConexao(null);
      try {
        const lista = await buscarAgendamentos(dataInicial, dataFinal);
        if (!desatualizado) setAgendamentos(lista);
      } catch {
        // Fluxo de exceção E.1 do documento: falha de conexão
        if (!desatualizado) {
          setErroConexao("Não foi possível atualizar a agenda neste momento. Verifique a conexão.");
        }
      } finally {
        if (!desatualizado) setCarregando(false);
      }
    }

    carregar();
    return () => {
      desatualizado = true;
    };
  }, [dataInicial, dataFinal]);

  function mostrarAviso(texto: string) {
    setAviso(texto);
    setTimeout(() => setAviso(null), 2500);
  }

  async function copiarLink() {
    await Clipboard.setStringAsync(LINK_AGENDAMENTO);
    mostrarAviso(mensagens.MSG02);
  }

  function abrirConfiguracoes() {
    Alert.alert("Configurações", "O que você quer ajustar?", [
      { text: "Serviços", onPress: () => router.push("/servicos") },
      { text: "Expediente", onPress: () => router.push("/expediente") },
      { text: "Cancelar", style: "cancel" },
    ]);
  }

  function abrirDetalhes(agendamento: Agendamento) {
    // TEMPORÁRIO: a tela de detalhes (TL03) será criada no próximo passo.
    Alert.alert(agendamento.clienteNome, "A tela de detalhes será criada no próximo passo.");
  }

  // Na visão da semana, os cards são agrupados por dia.
  const diasDaSemana = Array.from({ length: 7 }, (_, i) => paraISO(somarDias(segunda, i)));

  const total = agendamentos.length;
  const resumo = `${total} agendamento${total === 1 ? "" : "s"}`;

  return (
    <SafeAreaView style={estilos.tela}>
      {/* Cabeçalho */}
      <View style={estilos.cabecalho}>
        <View>
          <Text style={estilos.titulo}>Minha agenda</Text>
          <Text style={estilos.subtitulo}>Espaço Marilza Caricatti</Text>
        </View>
        <View style={estilos.acoes}>
          <Pressable onPress={copiarLink} style={estilos.botaoIcone} hitSlop={8}>
            <Ionicons name="link-outline" size={22} color={cores.primariaEscura} />
          </Pressable>
          <Pressable onPress={abrirConfiguracoes} style={estilos.botaoIcone} hitSlop={8}>
            <Ionicons name="settings-outline" size={22} color={cores.primariaEscura} />
          </Pressable>
        </View>
      </View>

      <ScrollView contentContainerStyle={estilos.conteudo}>
        {/* Abas Dia / Semana */}
        <View style={estilos.abas}>
          {(["dia", "semana"] as Visao[]).map((opcao) => (
            <Pressable
              key={opcao}
              onPress={() => setVisao(opcao)}
              style={[estilos.aba, visao === opcao && estilos.abaAtiva]}
            >
              <Text style={[estilos.textoAba, visao === opcao && estilos.textoAbaAtiva]}>
                {opcao === "dia" ? "Agenda do dia" : "Agenda da semana"}
              </Text>
            </Pressable>
          ))}
        </View>

        <SeletorDeData dataSelecionada={dataSelecionada} aoSelecionar={setDataSelecionada} />

        {erroConexao ? (
          <View style={estilos.alertaErro}>
            <Ionicons name="cloud-offline-outline" size={20} color={cores.cancelado} />
            <Text style={estilos.textoAlerta}>{erroConexao}</Text>
          </View>
        ) : null}

        {carregando ? (
          <ActivityIndicator color={cores.primariaEscura} style={{ marginTop: 40 }} />
        ) : (
          <View style={{ marginTop: 20 }}>
            {visao === "dia" && (
              <>
                <Text style={estilos.tituloLista}>{dataPorExtenso(dataInicial)}</Text>
                <Text style={estilos.resumo}>{resumo}</Text>
                {agendamentos.map((a) => (
                  <CardAgendamento key={a.id} agendamento={a} aoPressar={() => abrirDetalhes(a)} />
                ))}
              </>
            )}

            {visao === "semana" && (
              <>
                <Text style={estilos.resumo}>{resumo} nesta semana</Text>
                {diasDaSemana.map((iso) => {
                  const doDia = agendamentos.filter((a) => a.data === iso);
                  if (doDia.length === 0) return null; // não mostra dias vazios
                  return (
                    <View key={iso} style={{ marginBottom: 8 }}>
                      <Text style={estilos.tituloLista}>{dataPorExtenso(iso)}</Text>
                      {doDia.map((a) => (
                        <CardAgendamento key={a.id} agendamento={a} aoPressar={() => abrirDetalhes(a)} />
                      ))}
                    </View>
                  );
                })}
              </>
            )}

            {total === 0 && !erroConexao && (
              <View style={estilos.vazio}>
                <Ionicons name="calendar-outline" size={40} color={cores.primaria} />
                <Text style={estilos.textoVazio}>
                  Nenhum agendamento {visao === "dia" ? "neste dia" : "nesta semana"}.
                </Text>
              </View>
            )}
          </View>
        )}
      </ScrollView>

      {/* Aviso rápido (como a MSG02) */}
      {aviso ? (
        <View style={estilos.aviso}>
          <Ionicons name="checkmark-circle" size={20} color={cores.superficie} />
          <Text style={estilos.textoAviso}>{aviso}</Text>
        </View>
      ) : null}
    </SafeAreaView>
  );
}

const estilos = StyleSheet.create({
  tela: { flex: 1, backgroundColor: cores.fundo },
  cabecalho: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 12,
  },
  titulo: { fontSize: 24, fontWeight: "700", color: cores.texto },
  subtitulo: { fontSize: 14, color: cores.textoSuave, marginTop: 2 },
  acoes: { flexDirection: "row", gap: 10 },
  botaoIcone: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: cores.primariaClara,
    alignItems: "center",
    justifyContent: "center",
  },
  conteudo: { paddingHorizontal: 20, paddingBottom: 40 },
  abas: {
    flexDirection: "row",
    backgroundColor: cores.primariaClara,
    borderRadius: 14,
    padding: 4,
    marginBottom: 16,
  },
  aba: { flex: 1, paddingVertical: 10, borderRadius: 11, alignItems: "center" },
  abaAtiva: { backgroundColor: cores.superficie },
  textoAba: { fontSize: 14, fontWeight: "600", color: cores.textoSuave },
  textoAbaAtiva: { color: cores.primariaEscura },
  alertaErro: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: cores.primariaClara,
    borderRadius: 12,
    padding: 12,
    marginTop: 16,
  },
  textoAlerta: { flex: 1, fontSize: 14, color: cores.texto },
  tituloLista: { fontSize: 17, fontWeight: "700", color: cores.texto, marginBottom: 4 },
  resumo: { fontSize: 13, color: cores.textoSuave, marginBottom: 12 },
  vazio: { alignItems: "center", marginTop: 40, gap: 10 },
  textoVazio: { fontSize: 15, color: cores.textoSuave },
  aviso: {
    position: "absolute",
    bottom: 30,
    left: 20,
    right: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: cores.primariaEscura,
    borderRadius: 14,
    padding: 14,
  },
  textoAviso: { flex: 1, color: cores.superficie, fontSize: 14, fontWeight: "600" },
});