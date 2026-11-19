// Guarda quem está logado e deixa essa informação disponível para o app inteiro.
// Qualquer tela pode usar: const { usuario, entrar, sair } = useAuth();
import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import {
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  User,
} from "firebase/auth";

import { auth } from "../services/firebase";

type DadosDoAuth = {
  usuario: User | null;
  carregando: boolean; // true enquanto o Firebase ainda verifica se já existe login
  entrar: (email: string, senha: string) => Promise<void>;
  sair: () => Promise<void>;
  recuperarSenha: (email: string) => Promise<void>;
};

const AuthContext = createContext<DadosDoAuth | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<User | null>(null);
  const [carregando, setCarregando] = useState(true);

  // O Firebase avisa sempre que alguém entra ou sai.
  useEffect(() => {
    return onAuthStateChanged(auth, (usuarioAtual) => {
      setUsuario(usuarioAtual);
      setCarregando(false);
    });
  }, []);

  const valor: DadosDoAuth = {
    usuario,
    carregando,
    entrar: async (email, senha) => {
      await signInWithEmailAndPassword(auth, email.trim(), senha);
    },
    sair: () => signOut(auth),
    recuperarSenha: (email) => sendPasswordResetEmail(auth, email.trim()),
  };

  return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>;
}

export function useAuth(): DadosDoAuth {
  const contexto = useContext(AuthContext);
  if (!contexto) throw new Error("useAuth precisa estar dentro de <AuthProvider>.");
  return contexto;
}
