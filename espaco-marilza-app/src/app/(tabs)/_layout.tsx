import { Tabs } from "expo-router/js-tabs";
import { Ionicons } from "@expo/vector-icons";
import { cores } from "../../theme/cores";

type NomeDoIcone = keyof typeof Ionicons.glyphMap;

// Ícone de uma aba: cheio e vinho quando a aba está ativa, contorno quando não está.
function IconeDaAba({ ativa, nome }: { ativa: boolean; nome: NomeDoIcone }) {
  const nomeFinal = ativa ? nome : (`${nome}-outline` as NomeDoIcone);
  return (
    <Ionicons
      name={nomeFinal}
      size={24}
      color={ativa ? cores.primariaEscura : cores.textoSuave}
    />
  );
}

// Barra de navegação inferior com as três áreas do app.
export default function LayoutDasAbas() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: cores.primariaEscura,
        tabBarInactiveTintColor: cores.textoSuave,
        tabBarLabelStyle: { fontSize: 12, fontWeight: "700" },
        tabBarStyle: {
          backgroundColor: cores.superficie,
          borderTopColor: cores.borda,
          height: 68,
          paddingTop: 6,
          paddingBottom: 10,
        },
        sceneStyle: { backgroundColor: cores.fundo },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Agenda",
          tabBarIcon: ({ focused }) => <IconeDaAba ativa={focused} nome="calendar" />,
        }}
      />
      <Tabs.Screen
        name="horarios"
        options={{
          title: "Horários",
          tabBarIcon: ({ focused }) => <IconeDaAba ativa={focused} nome="time" />,
        }}
      />
      <Tabs.Screen
        name="servicos"
        options={{
          title: "Serviços",
          tabBarIcon: ({ focused }) => <IconeDaAba ativa={focused} nome="sparkles" />,
        }}
      />
    </Tabs>
  );
}
