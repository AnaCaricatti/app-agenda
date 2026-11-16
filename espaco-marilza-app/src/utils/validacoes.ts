// Funções de validação. Retornam o texto do erro, ou null se estiver tudo certo.

export function validarEmail(email: string): string | null {
    const valor = email.trim();
  
    if (valor === "") return "Informe o e-mail.";
    if (valor.length > 100) return "O e-mail deve ter no máximo 100 caracteres.";
  
    // Formato básico: texto + @ + texto + ponto + texto
    const formatoValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formatoValido.test(valor)) return "Digite um e-mail válido.";
  
    return null;
  }
  
  export function validarSenha(senha: string): string | null {
    if (senha === "") return "Informe a senha.";
    if (senha.length < 8 || senha.length > 20) {
      return "A senha deve ter entre 8 e 20 caracteres.";
    }
  
    return null;
  }