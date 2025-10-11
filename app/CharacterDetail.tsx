import { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, StyleSheet, Image, Alert } from "react-native";
import { useLocalSearchParams } from "expo-router";

type Character = {
  id: number | null;
  nombre: string;
  especie: string;
  estado: string;
  imagen?: string | null;
  source: "local" | "global";
};

const API_BASE = "http://192.168.1.50:3000"; 
const isNumeric = (v: string) => /^\d+$/.test(v);

export default function CharacterDetail() {
  const { id, source } = useLocalSearchParams<{ id: string; source: string }>();
  const [character, setCharacter] = useState<Character | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const ctrl = new AbortController();
    async function fetchCharacter() {
      try {
        if (!id) {
          Alert.alert("Error", "No se proporcionó un ID o nombre");
          return;
        }
        if (source === "local") {
          const url = isNumeric(id) ? `${API_BASE}/characters/id/${id}` : `${API_BASE}/characters/${encodeURIComponent(id)}`;
          const r = await fetch(url, { signal: ctrl.signal });
          if (!r.ok) throw new Error("No encontrado");
          const data = await r.json();
          setCharacter({
            id: data.id ?? null,
            nombre: data.nombre,
            especie: data.especie,
            estado: data.estado,
            imagen: data.imagen ?? null,
            source: "local"
          });
        } else {
          const r = await fetch(`https://rickandmortyapi.com/api/character/${id}`, { signal: ctrl.signal });
          if (!r.ok) throw new Error("No encontrado");
          const data = await r.json();
          setCharacter({
            id: data.id,
            nombre: data.name,
            especie: data.species,
            estado: data.status,
            imagen: data.image ?? null,
            source: "global"
          });
        }
      } catch (e: any) {
        if (e.name !== "AbortError") {
          setError(e.message || "Error cargando personaje");
          Alert.alert("Error", e.message || "Error cargando personaje");
        }
      }
    }
    fetchCharacter();
    return () => ctrl.abort();
  }, [id, source]);

  if (error) {
    return <View style={styles.center}><Text style={{ color: "crimson" }}>Error: {error}</Text></View>;
  }
  if (!character) {
    return <View style={styles.center}><ActivityIndicator size="large" /></View>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{character.id ? `#${character.id} ` : ""}{character.nombre}</Text>
      {!!character.imagen && <Image source={{ uri: character.imagen }} style={{ width: 120, height: 120 }} />}
      <Text>Especie: {character.especie}</Text>
      <Text>Estado: {character.estado}</Text>
      <Text>Origen: {character.source}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, alignItems: "center", justifyContent: "center" },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 15 }
});
