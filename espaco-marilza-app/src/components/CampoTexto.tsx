import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  TextInputProps,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { cores } from "../theme/cores";

// Props: as informações que a tela passa para este componente.
type Props = TextInputProps & {
  rotulo: string;
  icone: keyof typeof Ionicons.glyphMap;
  erro?: string | null;
  ehSenha?: boolean;
};

export default function CampoTexto({
  rotulo,
  icone,
  erro,
  ehSenha = false,
  ...resto // todas as outras props (value, placeholder, maxLength...) vão direto para o TextInput
}: Props) {
  // State: valores que mudam e fazem a tela se redesenhar.
  const [focado, setFocado] = useState(false);
  const [senhaVisivel, setSenhaVisivel] = useState(false);

  // A borda muda de cor conforme a situação do campo.
  const corDaBorda = erro ? cores.cancelado : focado ? cores.primaria : cores.borda;

  return (
    <View style={estilos.grupo}>
      <Text style={estilos.rotulo}>{rotulo}</Text>

      <View style={[estilos.campo, { borderColor: corDaBorda }]}>
        <Ionicons name={icone} size={20} color={cores.textoSuave} />

        <TextInput
          style={estilos.input}
          placeholderTextColor={cores.textoSuave}
          secureTextEntry={ehSenha && !senhaVisivel}
          onFocus={() => setFocado(true)}
          onBlur={() => setFocado(false)}
          {...resto}
        />

        {ehSenha && (
          <Pressable onPress={() => setSenhaVisivel(!senhaVisivel)} hitSlop={10}>
            <Ionicons
              name={senhaVisivel ? "eye-off-outline" : "eye-outline"}
              size={20}
              color={cores.textoSuave}
            />
          </Pressable>
        )}
      </View>

      {erro ? <Text style={estilos.erro}>{erro}</Text> : null}
    </View>
  );
}

const estilos = StyleSheet.create({
  grupo: { marginBottom: 16 },
  rotulo: {
    fontSize: 14,
    fontWeight: "600",
    color: cores.texto,
    marginBottom: 6,
  },
  campo: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: cores.superficie,
    borderWidth: 1.5,
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 52,
    gap: 10,
  },
  input: { flex: 1, fontSize: 16, color: cores.texto },
  erro: { fontSize: 13, color: cores.cancelado, marginTop: 6 },
});