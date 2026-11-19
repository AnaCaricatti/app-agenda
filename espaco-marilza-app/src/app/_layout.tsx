import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import { Stack } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { firebaseConfigurado } from "../config/firebaseConfig";
import { AuthProvider, useAuth } from "../contexts/AuthContext";
import { cores, fontes } from "../theme/cores";

// Ponto de partida do app: define as telas e quem pode acessá-las.
export default function LayoutRaiz() {
  // Enquanto o Firebase não for configurado, mostra um aviso explicando o que falta.
  if (!firebaseConfigurado) return <FirebaseNaoConfigurado />;

  return (
    <AuthProvider>
      {/* No navegador do computador, o app fica centralizado com largura de celular */}
      <View style={estilos.fundoDoNavegador}>
        <View style={estilos.moldura}>
          <Navegacao />
        </View>
      </View>
    </AuthProvider>
  );
}

function Navegacao() {
  const { usuario, carregando } = useAuth();

  if (carregando) {
    return (
      <View style={estilos.centro}>
        <ActivityIndicator color={cores.primariaEscura} size="large" />
      </View>
    );
  }

  const logada = usuario !== null;

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: cores.fundo },
        headerShadowVisible: false,
        headerTintColor: cores.primariaEscura,
        headerTitleStyle: { fontFamily: fontes.titulo, fontWeight: "700", fontSize: 20 },
        headerBackButtonDisplayMode: "minimal",
        contentStyle: { backgroundColor: cores.fundo },
      }}
    >
      {/* Só entra nestas telas quem fez login */}
      <Stack.Protected guard={logada}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="agendamento/[id]" options={{ title: "Detalhes" }} />
        <Stack.Screen name="agendamento/novo" options={{ title: "Novo agendamento" }} />
      </Stack.Protected>

      {/* Quem já está logada não precisa ver o login */}
      <Stack.Protected guard={!logada}>
        <Stack.Screen name="login" options={{ headerShown: false }} />
      </Stack.Protected>
    </Stack>
  );
}

function FirebaseNaoConfigurado() {
  return (
    <View style={estilos.centro}>
      <Ionicons name="construct-outline" size={44} color={cores.primariaEscura} />
      <Text style={estilos.titulo}>Falta configurar o Firebase</Text>
      <Text style={estilos.texto}>
        Abra o arquivo src/config/firebaseConfig.ts e cole os dados do seu projeto Firebase.
        O passo a passo está no README.
      </Text>
    </View>
  );
}

const estilos = StyleSheet.create({
  fundoDoNavegador: { flex: 1, backgroundColor: cores.primariaClara },
  moldura: { flex: 1, width: "100%", maxWidth: 520, alignSelf: "center", backgroundColor: cores.fundo },
  centro: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: cores.fundo,
    padding: 32,
    gap: 12,
  },
  titulo: { fontFamily: fontes.titulo, fontSize: 24, fontWeight: "700", color: cores.texto },
  texto: { fontSize: 15, lineHeight: 22, color: cores.textoSuave, textAlign: "center", maxWidth: 420 },
});
