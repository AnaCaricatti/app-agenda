// Liga o app ao Firebase. Os outros arquivos da pasta "services"
// importam daqui o banco de dados (db) e o login (auth).
import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

import { firebaseConfig } from "../config/firebaseConfig";

// Se o app já foi iniciado (acontece ao salvar um arquivo com o servidor ligado), reaproveita.
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

export const db = getFirestore(app); // banco de dados (Firestore)
export const auth = getAuth(app); // login com e-mail e senha

// Nomes das coleções do banco. O site usa os mesmos nomes.
export const COLECOES = {
  agendamentos: "agendamentos",
  servicos: "servicos",
  configuracoes: "configuracoes",
};
