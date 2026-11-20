import { useState } from "react";
import { Modal, View, Text, ScrollView, Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import Botao from "./Botao";
import CampoTexto from "./CampoTexto";
import { cores, fontes } from "../theme/cores";
import { DadosDoServico, Servico } from "../types/servico";
import { ICONES_DE_SERVICO, iconeDoServico } from "../utils/icones";

type Props = {
  servico: Servico | null; // null = criando um serviço novo
  salvando: boolean;
  aoSalvar: (dados: DadosDoServico) => void;
  aoExcluir: () => void;
  aoFechar: () => void;
};

// Janela com o formulário para criar ou editar um serviço.
// A tela só desenha este componente quando a janela está aberta,
// por isso os campos sempre começam com os dados do serviço escolhido.
export default function FormularioServico({
  servico,
  salvando,
  aoSalvar,
  aoExcluir,
  aoFechar,
}: Props) {
  const [nome, setNome] = useState(servico?.nome ?? "");
  const [descricao, setDescricao] = useState(servico?.descricao ?? "");
  const [preco, setPreco] = useState(servico ? String(servico.preco).replace(".", ",") : "");
  const [duracao, setDuracao] = useState(servico ? String(servico.duracao) : "");
  const [icone, setIcone] = useState(iconeDoServico(servico?.icone));
  const [erro, setErro] = useState<string | null>(null);

  function salvar() {
    const precoNumero = Number(preco.replace(",", "."));
    const duracaoNumero = Number(duracao);

    if (nome.trim().length < 3) return setErro("Informe o nome do serviço.");
    if (!preco || Number.isNaN(precoNumero) || precoNumero < 0) return setErro("Informe um preço válido.");
    if (!Number.isInteger(duracaoNumero) || duracaoNumero < 10) {
      return setErro("Informe a duração em minutos (mínimo 10).");
    }

    aoSalvar({
      nome: nome.trim(),
      descricao: descricao.trim(),
      preco: precoNumero,
      duracao: duracaoNumero,
      icone,
    });
  }

  return (
    <Modal visible transparent animationType="slide" onRequestClose={aoFechar}>
      <View style={estilos.fundo}>
        <View style={estilos.folha}>
          <View style={estilos.topo}>
            <Text style={estilos.titulo}>{servico ? "Editar serviço" : "Novo serviço"}</Text>
            <Pressable onPress={aoFechar} hitSlop={10} accessibilityLabel="Fechar">
              <Ionicons name="close" size={26} color={cores.texto} />
            </Pressable>
          </View>

          <ScrollView keyboardShouldPersistTaps="handled">
            <CampoTexto
              rotulo="Nome"
              icone="sparkles-outline"
              placeholder="Ex.: Manicure"
              value={nome}
              onChangeText={setNome}
              maxLength={50}
            />
            <CampoTexto
              rotulo="Descrição (aparece no site)"
              icone="chatbubble-outline"
              placeholder="Uma frase curta sobre o serviço"
              value={descricao}
              onChangeText={setDescricao}
              maxLength={120}
            />
            {/* Ícone que representa o serviço no app e no site */}
            <Text style={estilos.rotulo}>Ícone (aparece no site)</Text>
            <View style={estilos.icones}>
              {ICONES_DE_SERVICO.map((opcao) => {
                const selecionado = opcao === icone;
                return (
                  <Pressable
                    key={opcao}
                    onPress={() => setIcone(opcao)}
                    accessibilityLabel={`Ícone ${opcao}`}
                    style={[estilos.opcaoDeIcone, selecionado && estilos.iconeSelecionado]}
                  >
                    <Ionicons
                      name={opcao}
                      size={24}
                      color={selecionado ? cores.superficie : cores.primariaEscura}
                    />
                  </Pressable>
                );
              })}
            </View>

            <View style={estilos.linha}>
              <View style={{ flex: 1 }}>
                <CampoTexto
                  rotulo="Preço (R$)"
                  icone="cash-outline"
                  placeholder="35,00"
                  value={preco}
                  onChangeText={setPreco}
                  keyboardType="decimal-pad"
                  maxLength={8}
                />
              </View>
              <View style={{ flex: 1 }}>
                <CampoTexto
                  rotulo="Duração (min)"
                  icone="time-outline"
                  placeholder="60"
                  value={duracao}
                  onChangeText={setDuracao}
                  keyboardType="number-pad"
                  maxLength={3}
                />
              </View>
            </View>

            {erro ? <Text style={estilos.erro}>{erro}</Text> : null}

            <View style={{ gap: 10, marginTop: 8 }}>
              <Botao titulo="Salvar serviço" aoPressar={salvar} carregando={salvando} />
              {servico ? (
                <Botao titulo="Excluir serviço" variante="perigo" icone="trash-outline" aoPressar={aoExcluir} />
              ) : null}
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const estilos = StyleSheet.create({
  fundo: { flex: 1, justifyContent: "flex-end", backgroundColor: "rgba(74, 31, 43, 0.45)" },
  folha: {
    width: "100%",
    maxWidth: 560,
    alignSelf: "center",
    maxHeight: "90%",
    backgroundColor: cores.fundo,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 22,
  },
  topo: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 18,
  },
  titulo: { fontFamily: fontes.titulo, fontSize: 24, fontWeight: "700", color: cores.texto },
  linha: { flexDirection: "row", gap: 12 },
  rotulo: { fontSize: 14, fontWeight: "600", color: cores.texto, marginBottom: 8 },
  icones: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 18 },
  opcaoDeIcone: {
    width: 48,
    height: 48,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: cores.borda,
    backgroundColor: cores.superficie,
    alignItems: "center",
    justifyContent: "center",
  },
  iconeSelecionado: { backgroundColor: cores.primariaEscura, borderColor: cores.primariaEscura },
  erro: { fontSize: 14, color: cores.cancelado, marginBottom: 10 },
});
