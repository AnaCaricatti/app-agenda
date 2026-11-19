export const DIAS_CURTOS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
const DIAS_LONGOS = [
  "Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira",
  "Quinta-feira", "Sexta-feira", "Sábado",
];
const MESES = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];

// Transforma uma data em texto "2026-11-16", o formato que guardamos nos agendamentos.
export function paraISO(data: Date): string {
  const ano = data.getFullYear();
  const mes = String(data.getMonth() + 1).padStart(2, "0");
  const dia = String(data.getDate()).padStart(2, "0");
  return `${ano}-${mes}-${dia}`;
}

export function somarDias(data: Date, dias: number): Date {
  const nova = new Date(data);
  nova.setDate(nova.getDate() + dias);
  return nova;
}

// Devolve a segunda-feira da semana da data informada.
export function inicioDaSemana(data: Date): Date {
  const diaDaSemana = data.getDay(); // 0 = domingo
  const diferenca = diaDaSemana === 0 ? -6 : 1 - diaDaSemana;
  return somarDias(data, diferenca);
}

// Exemplo: "Novembro de 2026"
export function tituloDoMes(data: Date): string {
  return `${MESES[data.getMonth()]} de ${data.getFullYear()}`;
}

// Exemplo: "Segunda-feira, 16 de novembro"
export function dataPorExtenso(iso: string): string {
  const [ano, mes, dia] = iso.split("-").map(Number);
  const data = new Date(ano, mes - 1, dia);
  return `${DIAS_LONGOS[data.getDay()]}, ${dia} de ${MESES[mes - 1].toLowerCase()}`;
}
// Exemplo: "(37) 99876-5432" a partir de "37998765432"
export function formatarTelefone(telefone: string): string {
  const numeros = telefone.replace(/\D/g, "").slice(0, 11);
  if (numeros.length > 10) return numeros.replace(/^(\d{2})(\d{5})(\d{0,4}).*/, "($1) $2-$3");
  if (numeros.length > 6) return numeros.replace(/^(\d{2})(\d{4})(\d{0,4}).*/, "($1) $2-$3");
  if (numeros.length > 2) return numeros.replace(/^(\d{2})(\d{0,5})/, "($1) $2");
  return numeros;
}

// Exemplo: "R$ 35,00"
export function formatarPreco(valor: number): string {
  return `R$ ${valor.toFixed(2).replace(".", ",")}`;
}
