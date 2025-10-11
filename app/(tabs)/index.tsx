import React, { useState } from "react";

interface Character {
  id: number;
  name?: string;
  nombre?: string;
  species?: string;
  especie?: string;
  status?: string;
  estado?: string;
  image?: string;
  imagen?: string;
}

export default function Index() {
  const [q, setQ] = useState<string>("");
  const [results, setResults] = useState<Character[]>([]);
  const [source, setSource] = useState<"local" | "global">("local");
 const buscarLocal = async () => {
    try {
      if (!q.trim()) return alert("Ingresa un nombre o ID");

      const isNumeric = !isNaN(Number(q));
      const url = isNumeric
        ? `http://192.168.1.5:3000/characters/id/${q}`
        : `http://192.168.1.5:3000/characters/${encodeURIComponent(
            q.toLowerCase()
          )}`; // ✅ ya no se usa /nombre/

      const res = await fetch(url);
      if (!res.ok) throw new Error("No encontrado");

      const data = await res.json();

      // Si el backend devuelve 1 objeto o varios, lo convertimos en array
      setSource("local");
      setResults(Array.isArray(data) ? data : [data]);
    } catch (err) {
      console.error("❌ Error en búsqueda local:", err);
      alert("No se encontró el personaje localmente");
      setResults([]);
    }
  };

  const buscarGlobal = async () => {
    try {
      if (!q.trim()) return alert("Ingresa un nombre o ID");

      const isNumeric = !isNaN(Number(q));
      const url = isNumeric
        ? `https://rickandmortyapi.com/api/character/${q}`
        : `https://rickandmortyapi.com/api/character/?name=${encodeURIComponent(q)}`;

      const res = await fetch(url);
      if (!res.ok) throw new Error("No encontrado");

      const data = await res.json();
      const resultsData = isNumeric ? [data] : data.results;

      setSource("global");
      setResults(resultsData);
    } catch (err) {
      console.error(err);
      alert("No se encontró el personaje globalmente");
      setResults([]);
    }
  };

  return (
    <div
      style={{
        fontFamily: "'Poppins', sans-serif",
        background: "linear-gradient(135deg, #d1fae5, #bfdbfe)",
        minHeight: "100vh",
        padding: "40px 20px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <h1
        style={{
          fontSize: "2.5rem",
          color: "#1e3a8a",
          marginBottom: "30px",
          textAlign: "center",
        }}
      >
        🧩 Buscador de Personajes <br />
        <span style={{ fontSize: "1.5rem", color: "#2563eb" }}>
          (Base local / API Global)
        </span>
      </h1>

      {/* Input y botones */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          alignItems: "center",
          gap: "10px",
          marginBottom: "30px",
        }}
      >
        <input
          type="text"
          placeholder="🔍 Escribe un ID o nombre..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
          style={{
            padding: "14px 18px",
            borderRadius: "10px",
            border: "2px solid #93c5fd",
            width: "300px",
            fontSize: "1.1rem",
            outline: "none",
            boxShadow: "0 0 10px rgba(0,0,0,0.1)",
          }}
        />

        <button
          onClick={buscarLocal}
          style={{
            backgroundColor: "#34d399",
            color: "#fff",
            border: "none",
            borderRadius: "10px",
            padding: "12px 20px",
            fontSize: "1.1rem",
            cursor: "pointer",
            transition: "0.3s",
          }}
          onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#059669")}
          onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#34d399")}
        >
          Local 🖥️
        </button>

        <button
          onClick={buscarGlobal}
          style={{
            backgroundColor: "#60a5fa",
            color: "#fff",
            border: "none",
            borderRadius: "10px",
            padding: "12px 20px",
            fontSize: "1.1rem",
            cursor: "pointer",
            transition: "0.3s",
          }}
          onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#2563eb")}
          onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#60a5fa")}
        >
          Global 🌍
        </button>
      </div>

      <h2 style={{ color: "#1f2937", marginBottom: "20px" }}>
        Resultados desde {source === "local" ? "💾 Base local" : "🌐 API global"}
      </h2>

      {/* Resultados */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
          gap: "20px",
          maxWidth: "1000px",
          width: "100%",
        }}
      >
        {results.length > 0 ? (
          results.map((char) => (
            <div
              key={char.id}
              style={{
                backgroundColor: "#fff",
                borderRadius: "15px",
                padding: "15px",
                boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                textAlign: "center",
                transition: "transform 0.2s",
              }}
              onMouseOver={(e) =>
                (e.currentTarget.style.transform = "scale(1.05)")
              }
              onMouseOut={(e) =>
                (e.currentTarget.style.transform = "scale(1)")
              }
            >
              <img
                src={char.image || char.imagen}
                alt={char.name || char.nombre}
                style={{
                  width: "140px",
                  height: "140px",
                  borderRadius: "50%",
                  objectFit: "cover",
                  marginBottom: "10px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                }}
              />
              <h3 style={{ color: "#1e40af", fontSize: "1.3rem", margin: "10px 0" }}>
                {char.name || char.nombre}
              </h3>
              <p style={{ margin: "4px 0", color: "#374151" }}>
                🧬 Especie: {char.species || char.especie}
              </p>
              <p style={{ margin: "4px 0", color: "#374151" }}>
                ⚡ Estado: {char.status || char.estado}
              </p>
            </div>
          ))
        ) : (
          <p
            style={{
              color: "#6b7280",
              fontSize: "1.2rem",
              textAlign: "center",
              gridColumn: "1 / -1",
            }}
          >
            No hay resultados 😢
          </p>
        )}
      </div>
    </div>
  );
}
