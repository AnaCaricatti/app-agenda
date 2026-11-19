// Identidade visual do aplicativo (a mesma do site).
// Todas as telas e componentes usam estes valores, então
// para mudar o visual do app basta mexer aqui.
import { Platform } from "react-native";

const vinho = "#642C3B";
const vinhoEscuro = "#4A1F2B";
const rosa = "#C58F98";
const nude = "#EAD8D4";
const creme = "#F8F3EC";
const marrom = "#49352F";
const dourado = "#B99A68";

export const cores = {
  vinho,
  vinhoEscuro,
  rosa,
  nude,
  creme,
  marrom,
  dourado,

  primaria: rosa,
  primariaEscura: vinho,
  primariaClara: nude,

  fundo: creme,
  superficie: "#FFFFFF",
  borda: nude,

  texto: marrom,
  textoSuave: "rgba(73, 53, 47, 0.65)",
  textoSobreVinho: "#FFFFFF",
  textoSuaveSobreVinho: "rgba(255, 255, 255, 0.72)",

  pendente: dourado,
  confirmado: "#4FA583",
  cancelado: "#D9596D",
  whatsapp: "#25D366", // verde oficial do WhatsApp
};

// Fonte dos títulos: com serifa, para lembrar a elegância do site.
export const fontes = {
  titulo: Platform.select({ ios: "Georgia", android: "serif", default: "Georgia, 'Times New Roman', serif" }),
};

// Sombra suave usada nos cartões.
export const sombra = {
  shadowColor: vinhoEscuro,
  shadowOpacity: 0.08,
  shadowRadius: 16,
  shadowOffset: { width: 0, height: 6 },
  elevation: 3,
};
