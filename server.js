import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();
app.use(cors());
app.use(express.json());

// ✅ API KEY desde Render (NO se pone aquí directamente)
const API_KEY = process.env.OPENAI_API_KEY;

// ✅ RUTA PRINCIPAL IA
app.post("/ia", async (req, res) => {

  try {

    const { mensaje } = req.body;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + API_KEY
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `
Eres un profesor experto en nóminas y asesoría laboral en España.

Reglas:
- Explica paso a paso
- NO des la solución completa directamente
- Corrige errores conceptuales
- Usa lenguaje claro y natural
- Habla como profesor, no como robot
`
          },
          {
            role: "user",
            content: mensaje
          }
        ]
      })
    });

    const data = await response.json();

    res.json({
      respuesta: data.choices[0].message.content
    });

  } catch (error) {
    console.error(error);
    res.json({ respuesta: "Error en la IA" });
  }

});

// ✅ ARRANQUE SERVIDOR
app.listen(3000, () => {
  console.log("✅ Servidor IA funcionando");
});
