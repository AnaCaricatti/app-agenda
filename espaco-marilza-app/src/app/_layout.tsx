import { Stack } from "expo-router";
import { cores } from "../theme/cores";

// Define como as telas se empilham e o visual do cabeçalho.
export default function LayoutRaiz() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: cores.superficie },
        headerTintColor: cores.primariaEscura,
        headerTitleStyle: { fontWeight: "600" },
        contentStyle: { backgroundColor: cores.fundo },
      }}
    >
      <Stack.Screen name="index" options={{ title: "Início" }} />
      <Stack.Screen name="login" options={{ title: "Login", headerShown: false }} />
      <Stack.Screen name="agenda" options={{ headerShown: false, gestureEnabled: false }} />
      <Stack.Screen name="servicos" options={{ title: "Serviços" }} />
      <Stack.Screen name="expediente" options={{ title: "Expediente" }} />
    </Stack>
  );
}