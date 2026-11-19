import { useEffect, useState } from "react";
import { View, Text, ScrollView, ActivityIndicator, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";

import Aviso, { useAviso } from "../../components/Aviso";
import Botao from "../../components/Botao";
import ModalConfirmacao from "../../components/ModalConfirmacao";
import SeloStatus from "../../components/SeloStatus";
import { atualizarStatus, observarAgendamento } from "../../services/agendamentosService";
import { cores, fontes, sombra } from "../../theme/cores";
import { Agendamento } from "../../types/agendamento";
import { dataPorExtenso, formatarPreco, formatarTelefone } from "../../utils/datas";
import { mensagens } from "../../utils/mensagens";
import { enviarConfirmacaoPeloWhatsApp, mensagemDeConfirmacao } from "../../utils/whatsapp";

// Uma linha de informação (ícone + rótulo + valor)
function LinhaInfo({
  icone,
  rotulo,
  valor,
}: {
  icone: keyof typeof Ionicons.glyphMap;
  rotulo: string;
  valor: string;
}) {
  return (
    <View style={estilos.linhaInfo}>
      <View style={estilos.iconeInfo}>
        <Ionicons name={icone} size={20} color={cores.primariaEscura} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={estilos.rotulo}>{rotulo}</Text>
        <Text style={estilos.valor}>{valor}</Text>
      </View>
    </View>
  );
}

export default function TelaDetalhes() {
  // O id vem da rota: /agendamento/abc123 -> id = "abc123"
  const { id } = useLocalSearchParams<{ id: string }>();
  const { aviso, mostrarAviso } = useAviso();

  const [agendamento, setAgendamento] = useState<Agendamento | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [processando, setProcessando] = useState(false);
  const [confirmacaoAberta, setConfirmacaoAberta] = useState(false);

  // Acompanha o agendamento em tempo real (se a cliente cancelar pelo site, a tela muda sozinha).
  useEffect(() => {
    return observarAgendamento(
      id,
      (encontrado) => {
        setAgendamento(encontrado);
        setCarregando(false);
      },
      () => setCarregando(false)
    );
  }, [id]);

  async function confirmar() {
    if (!agendamento) return;
    setProcessando(true);
    try {
      await atualizarStatus(agendamento.id, "confirmado");
      mostrarAviso(mensagens.MSG03);
    } catch {
      mostrarAviso(mensagens.ERRO_CONEXAO, "erro");
    } finally {
      setProcessando(false);
    }
  }

  async function cancelar() {
    if (!agendamento) return;
    setProcessando(true);
    try {
      await atualizarStatus(agendamento.id, "cancelado");
      setConfirmacaoAberta(false);
      mostrarAviso("Agendamento cancelado. O horário foi liberado.");
    } catch {
      mostrarAviso(mensagens.ERRO_CONEXAO, "erro");
    } finally {
      setProcessando(false);
    }
  }

  if (carregando) {
    return (
      <View style={estilos.centro}>
        <ActivityIndicator color={cores.primariaEscura} />
      </View>
    );
  }

  if (!agendamento) {
    return (
      <View style={estilos.centro}>
        <Text style={estilos.valor}>Agendamento não encontrado.</Text>
      </View>
    );
  }

  const { status } = agendamento;

  return (
    <View style={estilos.tela}>
      <ScrollView contentContainerStyle={estilos.conteudo}>
        {/* Cabeçalho da cliente */}
        <View style={estilos.topo}>
          <View style={estilos.avatar}>
            <Text style={estilos.inicial}>{agendamento.clienteNome.charAt(0).toUpperCase()}</Text>
          </View>
          <Text style={estilos.nome}>{agendamento.clienteNome}</Text>
          <SeloStatus status={status} />
          <Text style={estilos.origem}>
            {agendamento.origem === "site" ? "Agendado pela cliente no site" : "Agendado por você no app"}
          </Text>
        </View>

        {/* Dados do agendamento */}
        <View style={estilos.card}>
          <LinhaInfo
            icone="call-outline"
            rotulo="Telefone / WhatsApp"
            valor={formatarTelefone(agendamento.clienteTelefone)}
          />
          <View style={estilos.divisor} />
          <LinhaInfo
            icone="sparkles-outline"
            rotulo="Serviço"
            valor={`${agendamento.servico} · ${formatarPreco(agendamento.preco)}`}
          />
          <View style={estilos.divisor} />
          <LinhaInfo icone="calendar-outline" rotulo="Data" valor={dataPorExtenso(agendamento.data)} />
          <View style={estilos.divisor} />
          <LinhaInfo
            icone="time-outline"
            rotulo="Horário"
            valor={`${agendamento.horario} às ${agendamento.horarioFim}`}
          />
        </View>

        {/* Prévia da mensagem pronta do WhatsApp (só depois de confirmado) */}
        {status === "confirmado" && (
          <View style={estilos.previa}>
            <Text style={estilos.rotulo}>Mensagem pronta para a cliente</Text>
            <Text style={estilos.textoPrevia}>{mensagemDeConfirmacao(agendamento)}</Text>
          </View>
        )}

        {/* Ações: só aparecem as que fazem sentido para o status atual */}
        <View style={estilos.acoes}>
          {status === "pendente" && (
            <>
              <Botao
                titulo="Confirmar agendamento"
                icone="checkmark-circle-outline"
                aoPressar={confirmar}
                carregando={processando}
              />
              <Botao
                titulo="Recusar agendamento"
                variante="perigo"
                aoPressar={() => setConfirmacaoAberta(true)}
              />
            </>
          )}

          {status === "confirmado" && (
            <>
              <Botao
                titulo="Avisar cliente pelo WhatsApp"
                variante="whatsapp"
                icone="logo-whatsapp"
                aoPressar={() => enviarConfirmacaoPeloWhatsApp(agendamento)}
              />
              <Botao
                titulo="Cancelar agendamento"
                variante="perigo"
                aoPressar={() => setConfirmacaoAberta(true)}
              />
            </>
          )}

          {status === "cancelado" && (
            <Text style={estilos.textoCancelado}>
              Este agendamento foi cancelado e o horário está liberado.
            </Text>
          )}
        </View>
      </ScrollView>

      <ModalConfirmacao
        visivel={confirmacaoAberta}
        titulo={status === "pendente" ? "Recusar agendamento" : "Cancelar agendamento"}
        mensagem={mensagens.MSG04}
        textoConfirmar={status === "pendente" ? "Recusar" : "Cancelar agendamento"}
        aoConfirmar={cancelar}
        aoFechar={() => setConfirmacaoAberta(false)}
        carregando={processando}
      />

      <Aviso aviso={aviso} />
    </View>
  );
}

const estilos = StyleSheet.create({
  tela: { flex: 1, backgroundColor: cores.fundo },
  centro: { flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: cores.fundo },
  conteudo: { padding: 20, paddingBottom: 100 },
  topo: { alignItems: "center", marginBottom: 24, gap: 10 },
  avatar: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: cores.primariaEscura,
    alignItems: "center",
    justifyContent: "center",
  },
  inicial: { fontFamily: fontes.titulo, fontSize: 36, fontWeight: "700", color: cores.superficie },
  nome: { fontFamily: fontes.titulo, fontSize: 26, fontWeight: "700", color: cores.texto },
  origem: { fontSize: 13, color: cores.textoSuave },
  card: { backgroundColor: cores.superficie, borderRadius: 24, padding: 18, ...sombra },
  linhaInfo: { flexDirection: "row", alignItems: "center", gap: 12 },
  iconeInfo: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: cores.primariaClara,
    alignItems: "center",
    justifyContent: "center",
  },
  rotulo: { fontSize: 12, color: cores.textoSuave },
  valor: { fontSize: 16, fontWeight: "600", color: cores.texto, marginTop: 2 },
  divisor: { height: 1, backgroundColor: cores.borda, marginVertical: 14 },
  previa: {
    marginTop: 16,
    backgroundColor: "#E7F8EE",
    borderRadius: 18,
    borderTopLeftRadius: 4,
    padding: 16,
    gap: 6,
  },
  textoPrevia: { fontSize: 15, lineHeight: 22, color: cores.texto },
  acoes: { marginTop: 24, gap: 12 },
  textoCancelado: { textAlign: "center", fontSize: 14, color: cores.textoSuave },
});
