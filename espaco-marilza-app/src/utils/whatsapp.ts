import { Linking } from "react-native";
import { Agendamento } from "../types/agendamento";
import { dataPorExtenso } from "./datas";

// Mensagem pronta enviada para a cliente quando o horário é confirmado.
export function mensagemDeConfirmacao(agendamento: Agendamento): string {
  const primeiroNome = agendamento.clienteNome.trim().split(" ")[0];
  const dia = dataPorExtenso(agendamento.data).toLowerCase();

  return (
    `Olá, ${primeiroNome}! Seu agendamento de ${agendamento.servico} foi confirmado ` +
    `para ${dia}, às ${agendamento.horario}. ` +
    `Esperamos você no Espaço Marilza Caricatti!`
  );
}

// Monta o link do WhatsApp. O número precisa do código do Brasil (55) na frente.
export function linkDoWhatsApp(telefone: string, mensagem?: string): string {
  const numeros = telefone.replace(/\D/g, "");
  const comPais = numeros.length <= 11 ? `55${numeros}` : numeros;
  const texto = mensagem ? `?text=${encodeURIComponent(mensagem)}` : "";
  return `https://wa.me/${comPais}${texto}`;
}

// Abre o WhatsApp com a mensagem de confirmação já escrita.
export async function enviarConfirmacaoPeloWhatsApp(agendamento: Agendamento) {
  const link = linkDoWhatsApp(agendamento.clienteTelefone, mensagemDeConfirmacao(agendamento));
  await Linking.openURL(link);
}
