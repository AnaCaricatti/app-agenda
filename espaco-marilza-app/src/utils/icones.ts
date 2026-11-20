import { Ionicons } from "@expo/vector-icons";

export type NomeDoIcone = keyof typeof Ionicons.glyphMap;

// Ícones que a profissional pode escolher para um serviço.
// O site desenha o mesmo ícone, pelo mesmo nome (biblioteca Ionicons).
// Para oferecer mais opções, basta acrescentar o nome aqui: https://ionic.io/ionicons
export const ICONES_DE_SERVICO: NomeDoIcone[] = [
  "hand-left-outline", // manicure
  "footsteps-outline", // pedicure
  "brush-outline", // esmaltação
  "diamond-outline", // alongamento
  "sparkles-outline", // geral
  "flower-outline", // geral
];

// Usado quando o serviço ainda não tem ícone escolhido.
export const ICONE_PADRAO: NomeDoIcone = "sparkles-outline";

// Devolve o ícone do serviço, ou o padrão se ele não tiver um ícone válido.
export function iconeDoServico(icone?: string): NomeDoIcone {
  const valido = ICONES_DE_SERVICO.includes(icone as NomeDoIcone);
  return valido ? (icone as NomeDoIcone) : ICONE_PADRAO;
}
