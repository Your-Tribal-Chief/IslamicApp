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
    
    // Priority: Groq > NVIDIA
    const groqKey = process.env.GROQ_API_KEY;
    const nvidiaKey = process.env.NVIDIA_API_KEY || "MWF0MmpoN285ZDgxcTAxaW9jZzl1bWo0bzQ6N2ZjZTFlOGItMDc0Zi00YjBhLTg0MGQtZjFlNWRlODA4NThm";

    let apiUrl = "";
    let apiKey = "";
    let model = "";
    let body: any = {};

    if (groqKey) {
      apiUrl = "https://api.groq.com/openai/v1/chat/completions";
      apiKey = groqKey;
      model = "llama-3.3-70b-versatile";
      body = {
        model,
        messages: [
          { role: "system", content: "You are a wise and compassionate Islamic scholar (Mawlana/Hujur). Your goal is to provide halal advice and solutions based on the Quran and Hadith. Always answer in Bengali. Be respectful, empathetic, and provide references where possible." },
          ...messages
        ]
      };
    } else {
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
      return res.status(response.status).json({ 
        error: "AI service error", 
        details: errorText.substring(0, 100),
        provider: groqKey ? "Groq" : "NVIDIA"
      });
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error: any) {
    return res.status(500).json({ error: "Internal Server Error", message: error.message });
  }
}
