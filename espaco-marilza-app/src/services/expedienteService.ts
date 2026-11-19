// Horários que a profissional disponibiliza. Ficam em um único documento
// do Firebase: configuracoes/expediente. O site lê esse mesmo documento.
import { doc, onSnapshot, setDoc } from "firebase/firestore";

import { Expediente, EXPEDIENTE_VAZIO } from "../types/expediente";
import { COLECOES, db } from "./firebase";

const documento = doc(db, COLECOES.configuracoes, "expediente");

// Acompanha em tempo real os horários disponibilizados.
export function observarExpediente(
  aoMudar: (expediente: Expediente) => void,
  aoFalhar: () => void
): () => void {
  return onSnapshot(
    documento,
    (resultado) => {
      const salvo = resultado.exists() ? (resultado.data().horarios as Expediente) : {};
      aoMudar({ ...EXPEDIENTE_VAZIO, ...salvo });
    },
    aoFalhar
  );
}

export async function salvarExpediente(expediente: Expediente): Promise<void> {
  await setDoc(documento, { horarios: expediente });
}
