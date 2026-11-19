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
    imagem: "https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=700&q=80",
  },
  {
    nome: "Pedicure",
    descricao: "Um momento de cuidado e beleza para seus pés.",
    preco: 40,
    duracao: 60,
    imagem: "https://images.unsplash.com/photo-1519014816548-bf5fe059798b?auto=format&fit=crop&w=700&q=80",
  },
  {
    nome: "Esmaltação em gel",
    descricao: "Brilho intenso e acabamento impecável por mais tempo.",
    preco: 65,
    duracao: 90,
    imagem: "https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&w=700&q=80",
  },
  {
    nome: "Alongamento de unhas",
    descricao: "Elegância e formato personalizado para suas unhas.",
    preco: 150,
    duracao: 150,
    imagem: "https://images.unsplash.com/photo-1610992015732-2449b76344bc?auto=format&fit=crop&w=700&q=80",
  },
];

export async function criarServicosIniciais(): Promise<void> {
  await Promise.all(SERVICOS_INICIAIS.map((servico) => addDoc(colecao, servico)));
}
