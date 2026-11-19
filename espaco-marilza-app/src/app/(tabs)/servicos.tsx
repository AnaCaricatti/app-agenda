import { useEffect, useState } from "react";
import { View, Text, ScrollView, Pressable, ActivityIndicator, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import Aviso, { useAviso } from "../../components/Aviso";
import Botao from "../../components/Botao";
import BotaoIcone from "../../components/BotaoIcone";
import CabecalhoDaTela from "../../components/CabecalhoDaTela";
import FormularioServico from "../../components/FormularioServico";
import ModalConfirmacao from "../../components/ModalConfirmacao";
import {
  atualizarServico,
  criarServico,
  criarServicosIniciais,
  excluirServico,
  observarServicos,
} from "../../services/servicosService";
import { cores, sombra } from "../../theme/cores";
import { DadosDoServico, Servico } from "../../types/servico";
import { formatarPreco } from "../../utils/datas";
import { mensagens } from "../../utils/mensagens";

// Tela onde a profissional cadastra os serviços que aparecem no site.
export default function TelaServicos() {
  const { aviso, mostrarAviso } = useAviso();

  const [servicos, setServicos] = useState<Servico[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [processando, setProcessando] = useState(false);

  // Controle das janelas (formulário e confirmação de exclusão)
  const [formularioAberto, setFormularioAberto] = useState(false);
  const [confirmacaoAberta, setConfirmacaoAberta] = useState(false);
  const [servicoEmEdicao, setServicoEmEdicao] = useState<Servico | null>(null);

  useEffect(() => {
    return observarServicos(
      (lista) => {
        setServicos(lista);
        setCarregando(false);
      },
      () => {
        mostrarAviso(mensagens.ERRO_CONEXAO, "erro");
        setCarregando(false);
      }
    );
  }, [mostrarAviso]);

  function abrirFormulario(servico: Servico | null) {
    setServicoEmEdicao(servico);
    setFormularioAberto(true);
  }

  // Executa uma ação no banco mostrando "carregando" e avisando se der erro.
  async function executar(acao: () => Promise<void>, mensagemDeSucesso: string) {
    setProcessando(true);
    try {
      await acao();
      setFormularioAberto(false);
      setConfirmacaoAberta(false);
      mostrarAviso(mensagemDeSucesso);
    } catch {
      mostrarAviso(mensagens.ERRO_CONEXAO, "erro");
    } finally {
      setProcessando(false);
    }
  }

  function salvar(dados: DadosDoServico) {
    const acao = servicoEmEdicao
      ? () => atualizarServico(servicoEmEdicao.id, dados)
      : () => criarServico(dados);
    executar(acao, mensagens.MSG05);
  }

  function excluir() {
    if (!servicoEmEdicao) return;
    executar(() => excluirServico(servicoEmEdicao.id), "Serviço excluído.");
  }

  return (
    <View style={estilos.tela}>
      <CabecalhoDaTela
        sobretitulo="O que você oferece"
        titulo="Serviços"
        acoes={
          <BotaoIcone icone="add" aoPressar={() => abrirFormulario(null)} descricao="Novo serviço" />
        }
      />

      {carregando ? (
        <ActivityIndicator color={cores.primariaEscura} style={{ marginTop: 40 }} />
      ) : (
        <ScrollView contentContainerStyle={estilos.conteudo}>
          {servicos.map((servico) => (
            <Pressable
              key={servico.id}
              onPress={() => abrirFormulario(servico)}
              style={({ pressed }) => [estilos.card, pressed && { opacity: 0.9 }]}
            >
              <View style={estilos.icone}>
                <Ionicons name="sparkles" size={20} color={cores.primariaEscura} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={estilos.nome}>{servico.nome}</Text>
                <Text style={estilos.detalhe}>{servico.duracao} min</Text>
              </View>
              <Text style={estilos.preco}>{formatarPreco(servico.preco)}</Text>
              <Ionicons name="chevron-forward" size={18} color={cores.textoSuave} />
            </Pressable>
          ))}

          {servicos.length === 0 && (
            <View style={estilos.vazio}>
              <Ionicons name="sparkles-outline" size={44} color={cores.primaria} />
              <Text style={estilos.textoVazio}>
                Você ainda não cadastrou serviços. Sem eles, as clientes não conseguem agendar.
              </Text>
              <Botao
                titulo="Adicionar serviços de exemplo"
                variante="secundario"
                aoPressar={() => executar(criarServicosIniciais, "Serviços de exemplo adicionados!")}
                carregando={processando}
              />
            </View>
          )}
        </ScrollView>
      )}

      {formularioAberto && (
        <FormularioServico
          servico={servicoEmEdicao}
          salvando={processando}
          aoSalvar={salvar}
          aoExcluir={() => {
            setFormularioAberto(false);
            setConfirmacaoAberta(true);
          }}
          aoFechar={() => setFormularioAberto(false)}
        />
      )}

      <ModalConfirmacao
        visivel={confirmacaoAberta}
        titulo="Excluir serviço"
        mensagem={mensagens.MSG06}
        textoConfirmar="Excluir serviço"
        aoConfirmar={excluir}
        aoFechar={() => setConfirmacaoAberta(false)}
        carregando={processando}
      />

      <Aviso aviso={aviso} />
    </View>
  );
}

const estilos = StyleSheet.create({
  tela: { flex: 1, backgroundColor: cores.fundo },
  conteudo: { padding: 20, paddingBottom: 90 },
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: cores.superficie,
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
    ...sombra,
  },
  icone: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: cores.primariaClara,
    alignItems: "center",
    justifyContent: "center",
  },
  nome: { fontSize: 16, fontWeight: "700", color: cores.texto },
  detalhe: { fontSize: 13, color: cores.textoSuave, marginTop: 2 },
  preco: { fontSize: 16, fontWeight: "800", color: cores.primariaEscura },
  vazio: { alignItems: "center", marginTop: 32, gap: 14 },
  textoVazio: {
    fontSize: 15,
    lineHeight: 22,
    color: cores.textoSuave,
    textAlign: "center",
    maxWidth: 320,
  },
});
