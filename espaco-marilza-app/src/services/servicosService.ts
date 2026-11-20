// Tudo o que o app faz com os serviços (manicure, pedicure...) no Firebase.
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";

import { DadosDoServico, Servico } from "../types/servico";
import { COLECOES, db } from "./firebase";

const colecao = collection(db, COLECOES.servicos);

// Acompanha em tempo real a lista de serviços, em ordem alfabética.
export function observarServicos(
  aoMudar: (servicos: Servico[]) => void,
  aoFalhar: () => void
): () => void {
  return onSnapshot(
    colecao,
    (resultado) => {
      const lista = resultado.docs.map((d) => ({ id: d.id, ...d.data() }) as Servico);
      aoMudar(lista.sort((a, b) => a.nome.localeCompare(b.nome)));
    },
    aoFalhar
  );
}

export async function criarServico(dados: DadosDoServico): Promise<void> {
  await addDoc(colecao, dados);
}

export async function atualizarServico(id: string, dados: DadosDoServico): Promise<void> {
  await updateDoc(doc(colecao, id), dados);
}

export async function excluirServico(id: string): Promise<void> {
  await deleteDoc(doc(colecao, id));
}

// Serviços de exemplo, para não começar com o banco vazio.
const SERVICOS_INICIAIS: DadosDoServico[] = [
  {
    nome: "Manicure",
    descricao: "Cuidado delicado para mãos bonitas e bem cuidadas.",
    preco: 35,
    duracao: 60,
    icone: "hand-left-outline",
  },
  {
    nome: "Pedicure",
    descricao: "Um momento de cuidado e beleza para seus pés.",
    preco: 40,
    duracao: 60,
    icone: "footsteps-outline",
  },
  {
    nome: "Esmaltação em gel",
    descricao: "Brilho intenso e acabamento impecável por mais tempo.",
    preco: 65,
    duracao: 90,
    icone: "brush-outline",
  },
  {
    nome: "Alongamento de unhas",
    descricao: "Elegância e formato personalizado para suas unhas.",
    preco: 150,
    duracao: 150,
    icone: "diamond-outline",
  },
];

export async function criarServicosIniciais(): Promise<void> {
  await Promise.all(SERVICOS_INICIAIS.map((servico) => addDoc(colecao, servico)));
}
