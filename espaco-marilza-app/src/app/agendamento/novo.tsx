import { useEffect, useState } from "react";
import { View, Text, ScrollView, Pressable, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

import Aviso, { useAviso } from "../../components/Aviso";
import Botao from "../../components/Botao";
import CampoTexto from "../../components/CampoTexto";
import ChipHorario from "../../components/ChipHorario";
import SeletorDeData from "../../components/SeletorDeData";
import { criarAgendamento, observarAgendamentos } from "../../services/agendamentosService";
import { observarExpediente } from "../../services/expedienteService";
import { observarServicos } from "../../services/servicosService";
import { cores, fontes } from "../../theme/cores";
import { Agendamento } from "../../types/agendamento";
import { Expediente, EXPEDIENTE_VAZIO } from "../../types/expediente";
import { Servico } from "../../types/servico";
import { formatarPreco, formatarTelefone, paraISO } from "../../utils/datas";
import { calcularHorariosLivres } from "../../utils/horarios";
import { mensagens } from "../../utils/mensagens";

// Tela em que a profissional marca um horário para uma cliente pelo próprio app.
export default function TelaNovoAgendamento() {
  const router = useRouter();
  const { aviso, mostrarAviso } = useAviso();

  // O que foi preenchido no formulário
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [servico, setServico] = useState<Servico | null>(null);
  const [data, setData] = useState(new Date());
  const [horario, setHorario] = useState<string | null>(null);

  // Dados que vêm do Firebase
  const [servicos, setServicos] = useState<Servico[]>([]);
  const [expediente, setExpediente] = useState<Expediente>(EXPEDIENTE_VAZIO);
  const [agendamentosDoDia, setAgendamentosDoDia] = useState<Agendamento[]>([]);

  const [salvando, setSalvando] = useState(false);
  const dataISO = paraISO(data);

  // Busca os serviços e os horários oferecidos (e acompanha mudanças).
  useEffect(() => {
    const avisarErro = () => mostrarAviso(mensagens.ERRO_CONEXAO, "erro");
    const pararServicos = observarServicos(setServicos, avisarErro);
    const pararExpediente = observarExpediente(setExpediente, avisarErro);
    return () => {
      pararServicos();
      pararExpediente();
    };
  }, [mostrarAviso]);

  // Acompanha os agendamentos do dia escolhido para saber quais horários já estão ocupados.
  useEffect(() => {
    return observarAgendamentos(dataISO, dataISO, setAgendamentosDoDia, () =>
      mostrarAviso(mensagens.ERRO_CONEXAO, "erro")
    );
  }, [dataISO, mostrarAviso]);

  // Horários livres = horários oferecidos naquele dia da semana, menos os já ocupados.
  const horariosDoDia = expediente[String(data.getDay())];
  const horariosLivres = servico
    ? calcularHorariosLivres(dataISO, horariosDoDia, servico.duracao, agendamentosDoDia)
    : [];

  const telefoneValido = telefone.replace(/\D/g, "").length >= 10;
  const podeSalvar = nome.trim().length >= 3 && telefoneValido && servico !== null && horario !== null;

  async function salvar() {
    if (!servico || !horario) return;
    setSalvando(true);
    try {
      await criarAgendamento({
        clienteNome: nome.trim(),
        clienteTelefone: telefone.replace(/\D/g, ""),
        servicoId: servico.id,
        servico: servico.nome,
        preco: servico.preco,
        duracao: servico.duracao,
        data: dataISO,
        horario,
      });
      router.back(); // volta para a agenda, que já mostra o novo agendamento
    } catch (erro) {
      const texto = erro instanceof Error ? erro.message : mensagens.ERRO_CONEXAO;
      mostrarAviso(texto, "erro");
      setHorario(null);
    } finally {
      setSalvando(false);
    }
  }

  return (
    <View style={estilos.tela}>
      <ScrollView contentContainerStyle={estilos.conteudo} keyboardShouldPersistTaps="handled">
        <Text style={estilos.secao}>1. Cliente</Text>
        <CampoTexto
          rotulo="Nome completo"
          icone="person-outline"
          placeholder="Nome da cliente"
          value={nome}
          onChangeText={setNome}
          maxLength={60}
        />
        <CampoTexto
          rotulo="Telefone / WhatsApp"
          icone="call-outline"
          placeholder="(00) 00000-0000"
          value={telefone}
          onChangeText={(texto) => setTelefone(formatarTelefone(texto))}
          keyboardType="phone-pad"
          maxLength={15}
        />

        <Text style={estilos.secao}>2. Serviço</Text>
        {servicos.length === 0 ? (
          <Text style={estilos.dica}>Cadastre um serviço na aba Serviços para poder agendar.</Text>
        ) : (
          <View style={{ gap: 8 }}>
            {servicos.map((item) => {
              const selecionado = servico?.id === item.id;
              return (
                <Pressable
                  key={item.id}
                  onPress={() => {
                    setServico(item);
                    setHorario(null);
                  }}
                  style={[estilos.opcaoServico, selecionado && estilos.opcaoSelecionada]}
                >
                  <View style={{ flex: 1 }}>
                    <Text style={[estilos.nomeServico, selecionado && estilos.textoClaro]}>
                      {item.nome}
                    </Text>
                    <Text style={[estilos.detalheServico, selecionado && estilos.textoClaro]}>
                      {item.duracao} min
                    </Text>
                  </View>
                  <Text style={[estilos.nomeServico, selecionado && estilos.textoClaro]}>
                    {formatarPreco(item.preco)}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        )}

        <Text style={estilos.secao}>3. Dia e horário</Text>
        <SeletorDeData
          dataSelecionada={data}
          aoSelecionar={(novaData) => {
            setData(novaData);
            setHorario(null); // o horário escolhido valia para o dia anterior
          }}
        />

        <View style={estilos.grade}>
          {horariosLivres.map((opcao) => (
            <ChipHorario
              key={opcao}
              texto={opcao}
              selecionado={horario === opcao}
              aoPressar={() => setHorario(opcao)}
            />
          ))}
        </View>
        {horariosLivres.length === 0 && (
          <Text style={estilos.dica}>
            {servico
              ? "Não há horários livres neste dia. Escolha outro dia ou libere horários na aba Horários."
              : "Escolha um serviço para ver os horários livres."}
          </Text>
        )}

        <View style={{ marginTop: 28 }}>
          <Botao
            titulo="Salvar agendamento"
            icone="checkmark-circle-outline"
            aoPressar={salvar}
            carregando={salvando}
            desativado={!podeSalvar}
          />
        </View>
      </ScrollView>

      <Aviso aviso={aviso} />
    </View>
  );
}

const estilos = StyleSheet.create({
  tela: { flex: 1, backgroundColor: cores.fundo },
  conteudo: { padding: 20, paddingBottom: 100, maxWidth: 640, width: "100%", alignSelf: "center" },
  secao: {
    fontFamily: fontes.titulo,
    fontSize: 20,
    fontWeight: "700",
    color: cores.primariaEscura,
    marginTop: 12,
    marginBottom: 12,
  },
  dica: { fontSize: 14, lineHeight: 21, color: cores.textoSuave, marginTop: 12 },
  opcaoServico: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: cores.superficie,
    borderWidth: 1.5,
    borderColor: cores.borda,
    borderRadius: 16,
    padding: 14,
  },
  opcaoSelecionada: { backgroundColor: cores.primariaEscura, borderColor: cores.primariaEscura },
  nomeServico: { fontSize: 15, fontWeight: "700", color: cores.texto },
  detalheServico: { fontSize: 13, color: cores.textoSuave, marginTop: 2 },
  textoClaro: { color: cores.superficie },
  grade: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 16 },
});
