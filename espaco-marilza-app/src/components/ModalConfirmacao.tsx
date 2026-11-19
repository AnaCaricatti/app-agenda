import { Modal, View, Text, Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Botao from "./Botao";
import { cores, fontes, sombra } from "../theme/cores";

type Props = {
  visivel: boolean;
  titulo: string;
  mensagem: string;
  textoConfirmar: string;
  aoConfirmar: () => void;
  aoFechar: () => void;
  carregando?: boolean;
};

// Janela que pede confirmação antes de uma ação que não pode ser desfeita
// (cancelar agendamento, excluir serviço). Funciona no celular e no navegador.
export default function ModalConfirmacao({
  visivel,
  titulo,
  mensagem,
  textoConfirmar,
  aoConfirmar,
  aoFechar,
  carregando = false,
}: Props) {
  return (
    <Modal visible={visivel} transparent animationType="fade" onRequestClose={aoFechar}>
      <Pressable style={estilos.fundo} onPress={aoFechar}>
        {/* O Pressable de dentro impede que um toque na caixa feche a janela */}
        <Pressable style={estilos.caixa} onPress={() => {}}>
          <View style={estilos.icone}>
            <Ionicons name="alert" size={26} color={cores.cancelado} />
          </View>
          <Text style={estilos.titulo}>{titulo}</Text>
          <Text style={estilos.mensagem}>{mensagem}</Text>

          <View style={estilos.botoes}>
            <Botao
              titulo={textoConfirmar}
              variante="perigo"
              aoPressar={aoConfirmar}
              carregando={carregando}
            />
            <Botao titulo="Voltar" variante="secundario" aoPressar={aoFechar} />
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const estilos = StyleSheet.create({
  fundo: {
    flex: 1,
    backgroundColor: "rgba(74, 31, 43, 0.45)",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  caixa: {
    width: "100%",
    maxWidth: 400,
    backgroundColor: cores.superficie,
    borderRadius: 24,
    padding: 24,
    alignItems: "center",
    ...sombra,
  },
  icone: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: `${cores.cancelado}1F`,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },
  titulo: { fontFamily: fontes.titulo, fontSize: 22, fontWeight: "700", color: cores.texto },
  mensagem: {
    fontSize: 15,
    lineHeight: 22,
    color: cores.textoSuave,
    textAlign: "center",
    marginTop: 8,
  },
  botoes: { alignSelf: "stretch", gap: 10, marginTop: 22 },
});
