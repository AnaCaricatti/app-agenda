// Tudo o que o app faz com os agendamentos no Firebase fica neste arquivo.
// As telas nunca falam direto com o banco: elas chamam as funções daqui.
import {
  addDoc,
  collection,
  doc,
  getDocs,
  onSnapshot,
  query,
  updateDoc,
  where,
  DocumentData,
} from "firebase/firestore";

import { Agendamento, NovoAgendamento, StatusAgendamento } from "../types/agendamento";
import { calcularFim, paraMinutos } from "../utils/horarios";
import { mensagens } from "../utils/mensagens";
import { COLECOES, db } from "./firebase";

const colecao = collection(db, COLECOES.agendamentos);

// Função que "desliga" uma observação em tempo real.
type PararDeObservar = () => void;

// Transforma um documento do Firebase em um Agendamento do app.
function paraAgendamento(id: string, dados: DocumentData): Agendamento {
  return { id, ...dados } as Agendamento;
}

function ordenarPorDataEHora(lista: Agendamento[]): Agendamento[] {
  return lista.sort((a, b) => (a.data + a.horario).localeCompare(b.data + b.horario));
}

// Acompanha EM TEMPO REAL os agendamentos entre duas datas (inclusive).
// Sempre que alguém marcar, confirmar ou cancelar (pelo site ou pelo app),
// a função "aoMudar" é chamada de novo com a lista atualizada.
export function observarAgendamentos(
  dataInicial: string,
  dataFinal: string,
  aoMudar: (agendamentos: Agendamento[]) => void,
  aoFalhar: () => void
): PararDeObservar {
  const consulta = query(colecao, where("data", ">=", dataInicial), where("data", "<=", dataFinal));

  return onSnapshot(
    consulta,
    (resultado) => {
      const lista = resultado.docs.map((d) => paraAgendamento(d.id, d.data()));
      aoMudar(ordenarPorDataEHora(lista));
    },
    aoFalhar
  );
}

// Acompanha em tempo real um único agendamento (tela de detalhes).
export function observarAgendamento(
  id: string,
  aoMudar: (agendamento: Agendamento | null) => void,
  aoFalhar: () => void
): PararDeObservar {
  return onSnapshot(
    doc(colecao, id),
    (documento) => {
      aoMudar(documento.exists() ? paraAgendamento(documento.id, documento.data()) : null);
    },
    aoFalhar
  );
}

// Busca uma vez só os agendamentos de um dia (usado para calcular horários livres).
export async function buscarAgendamentosDoDia(data: string): Promise<Agendamento[]> {
  const resultado = await getDocs(query(colecao, where("data", "==", data)));
  return resultado.docs.map((d) => paraAgendamento(d.id, d.data()));
}

// Muda o status de um agendamento (confirmar ou cancelar).
// Como o site só considera ocupado o que NÃO está cancelado,
// cancelar libera o horário automaticamente (RN03).
export async function atualizarStatus(id: string, status: StatusAgendamento): Promise<void> {
  await updateDoc(doc(colecao, id), { status });
}

// Cria um agendamento feito pela própria profissional no app.
// Ele já nasce "confirmado", pois foi ela mesma quem marcou.
export async function criarAgendamento(dados: NovoAgendamento): Promise<string> {
  const horarioFim = calcularFim(dados.horario, dados.duracao);

  // Confere de novo se o horário continua livre antes de gravar (MSG08).
  const doDia = await buscarAgendamentosDoDia(dados.data);
  const inicio = paraMinutos(dados.horario);
  const fim = paraMinutos(horarioFim);
  const ocupado = doDia.some(
    (a) =>
      a.status !== "cancelado" &&
      inicio < paraMinutos(a.horarioFim) &&
      fim > paraMinutos(a.horario)
  );
  if (ocupado) throw new Error(mensagens.MSG08);

  const novo = await addDoc(colecao, {
    ...dados,
    horarioFim,
    status: "confirmado",
    origem: "app",
    criadoEm: new Date().toISOString(),
  });
  return novo.id;
}
