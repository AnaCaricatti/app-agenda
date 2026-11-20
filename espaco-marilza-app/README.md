# Espaço Marilza Caricatti — App da profissional

App (Expo / React Native) onde a profissional gerencia a agenda. Ele funciona junto com o
**site de agendamento** (projeto `-espaco-marilza-site.py`): os dois usam o mesmo banco de
dados no **Firebase**, por isso tudo fica sincronizado em tempo real.

## O que o app faz

- **Agenda**: mostra os agendamentos do dia ou da semana. Pedidos feitos no site aparecem
  sozinhos como *pendentes*.
- **Confirmar ou recusar**: toque no agendamento (ou no botão verde do cartão).
- **WhatsApp**: depois de confirmado, um botão abre o WhatsApp com a mensagem pronta
  ("Seu agendamento de ... foi confirmado para ..., às ...").
- **Agendar pelo app**: botão *Agendar* na agenda, para marcar um horário para uma cliente.
- **Horários**: escolha os horários que ficam disponíveis no site.
- **Serviços**: cadastre os serviços, preços e durações que aparecem no site.

## Configurar o Firebase

O passo a passo completo está no README do site. Resumindo: crie o projeto no Firebase,
ative o **Firestore** e o login por **E-mail/senha**, crie o usuário da profissional e cole
as chaves do projeto em [`src/config/firebaseConfig.ts`](src/config/firebaseConfig.ts)
(as mesmas chaves vão em `js/firebase-config.js` no site).

## Rodar no computador

```bash
npm install
npm run web
```

Depois abra <http://localhost:8081>. Para testar no celular, use `npx expo start` e o app Expo Go.

Antes de entregar uma alteração, confira se está tudo certo:

```bash
npx tsc --noEmit
npx eslint src
```

## Organização dos arquivos (`src/`)

| Pasta / arquivo | O que tem |
| --- | --- |
| `app/` | As telas. Cada arquivo é uma tela (Expo Router) |
| `app/_layout.tsx` | Ponto de partida: decide entre login e área logada |
| `app/login.tsx` | Tela de login |
| `app/(tabs)/` | As três abas: `index` (Agenda), `horarios` e `servicos` |
| `app/agendamento/[id].tsx` | Detalhes: confirmar, recusar, cancelar, WhatsApp |
| `app/agendamento/novo.tsx` | Agendamento feito pela profissional |
| `components/` | Peças visuais reaproveitadas (botão, cartão, cabeçalho...) |
| `services/` | Tudo o que lê e grava no Firebase. As telas só chamam estas funções |
| `contexts/AuthContext.tsx` | Guarda quem está logado |
| `types/` | O formato dos dados (agendamento, serviço, expediente) |
| `utils/` | Funções de apoio: datas, horários livres, WhatsApp, ícones, mensagens |
| `theme/cores.ts` | Cores, fonte dos títulos e sombra. Mude aqui para mudar o visual |
| `config/firebaseConfig.ts` | Chaves do seu projeto Firebase |

O formato dos dados no banco está descrito no README do site.
