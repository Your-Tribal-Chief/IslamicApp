import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { messages } = req.body;
    const geminiKey = process.env.GEMINI_API_KEY;
    const groqKey = process.env.GROQ_API_KEY;
    const nvidiaKey = process.env.NVIDIA_API_KEY || "MWF0MmpoN285ZDgxcTAxaW9jZzl1bWo0bzQ6N2ZjZTFlOGItMDc0Zi00YjBhLTg0MGQtZjFlNWRlODA4NThm";

    const systemPrompt = "You are a wise and compassionate Islamic scholar (Mawlana/Hujur). Your goal is to provide halal advice and solutions based on the Quran and Hadith. Always answer in Bengali. Be respectful, empathetic, and provide references where possible.";

    // 1. Try Gemini (REST API)
    if (geminiKey) {
      try {
        console.log("Trying Gemini REST API...");
        const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`;
        const geminiBody = {
          contents: [
            { role: "user", parts: [{ text: `System Instruction: ${systemPrompt}` }] },
            ...messages.map((m: any) => ({
              role: m.role === 'user' ? 'user' : 'model',
              parts: [{ text: m.content }]
            }))
          ]
        };

        const response = await fetch(geminiUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(geminiBody)
        });

        if (response.ok) {
          const data = await response.json();
          const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (text) {
            return res.status(200).json({ choices: [{ message: { content: text } }] });
          }
        }
      } catch (e) {
        console.warn("Gemini REST failed:", e);
      }
    }

    // 2. Try Groq
    if (groqKey) {
      try {
        console.log("Trying Groq...");
        const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${groqKey}`
          },
          body: JSON.stringify({
            model: "llama-3.3-70b-versatile",
            messages: [{ role: "system", content: systemPrompt }, ...messages]
          })
        });
        if (groqRes.ok) return res.status(200).json(await groqRes.json());
      } catch (e) {
        console.warn("Groq failed:", e);
      }
    }

    // 3. Try NVIDIA
    try {
      console.log("Trying NVIDIA...");
      const nvidiaRes = await fetch("https://integrate.api.nvidia.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${nvidiaKey}`
        },
        body: JSON.stringify({
          model: "qwen/qwen2.5-72b-instruct",
          messages: [{ role: "system", content: systemPrompt }, ...messages]
        })
      });
      if (nvidiaRes.ok) return res.status(200).json(await nvidiaRes.json());
      throw new Error(await nvidiaRes.text());
    } catch (e: any) {
      return res.status(500).json({ error: "All AI providers failed", details: e.message });
    }
  } catch (error: any) {
    return res.status(500).json({ error: "Internal Server Error", message: error.message });
  }
}
