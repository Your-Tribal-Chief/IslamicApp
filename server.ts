import express from "express";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  console.log(`Starting server in ${process.env.NODE_ENV || 'development'} mode...`);

  app.use(express.json());

  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", mode: process.env.NODE_ENV || 'development' });
  });

  // API Route for Ask Hujur (Proxy to AI Providers)
  app.post("/api/ask-hujur", async (req, res) => {
    try {
      const { messages } = req.body;
      
      // Priority: Groq > NVIDIA > Gemini (Server-side)
      const groqKey = process.env.GROQ_API_KEY;
      const nvidiaKey = process.env.NVIDIA_API_KEY || "MWF0MmpoN285ZDgxcTAxaW9jZzl1bWo0bzQ6N2ZjZTFlOGItMDc0Zi00YjBhLTg0MGQtZjFlNWRlODA4NThm";
      const geminiKey = process.env.GEMINI_API_KEY;

      let apiUrl = "";
      let apiKey = "";
      let model = "";
      let body: any = {};

      if (groqKey) {
        apiUrl = "https://api.groq.com/openai/v1/chat/completions";
        apiKey = groqKey;
        model = "llama-3.3-70b-versatile"; // High quality Llama model
        body = {
          model,
          messages: [
            { role: "system", content: "You are a wise and compassionate Islamic scholar (Mawlana/Hujur). Your goal is to provide halal advice and solutions based on the Quran and Hadith. Always answer in Bengali. Be respectful, empathetic, and provide references where possible." },
            ...messages
          ]
        };
      } else {
        // Fallback to NVIDIA
        apiUrl = "https://integrate.api.nvidia.com/v1/chat/completions";
        apiKey = nvidiaKey;
        model = "qwen/qwen2.5-72b-instruct";
        body = {
          model,
          messages: [
            { role: "system", content: "You are a wise and compassionate Islamic scholar (Mawlana/Hujur). Your goal is to provide halal advice and solutions based on the Quran and Hadith. Always answer in Bengali. Be respectful, empathetic, and provide references where possible." },
            ...messages
          ]
        };
      }

      console.log(`Calling AI API: ${apiUrl} with model: ${model}`);

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`
        },
        body: JSON.stringify(body)
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`AI API Error (${response.status}):`, errorText);
        return res.status(response.status).json({ 
          error: "AI service error", 
          details: errorText.substring(0, 100),
          provider: groqKey ? "Groq" : "NVIDIA"
        });
      }

      const data = await response.json();
      res.json(data);
    } catch (error: any) {
      console.error("Server Proxy Error:", error);
      res.status(500).json({ error: "Internal Server Error", message: error.message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static("dist"));
    app.get("*", (req, res) => {
      res.sendFile("dist/index.html", { root: "." });
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
