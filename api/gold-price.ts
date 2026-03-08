import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const goldRes = await fetch("https://api.gold-api.com/price/XAU");
    const silverRes = await fetch("https://api.gold-api.com/price/XAG");
    
    if (!goldRes.ok || !silverRes.ok) throw new Error("External API failed");
    
    const goldData = await goldRes.json();
    const silverData = await silverRes.json();
    
    return res.status(200).json({
      gold: goldData.price,
      silver: silverData.price
    });
  } catch (error: any) {
    return res.status(500).json({ error: "Failed to fetch prices", message: error.message });
  }
}
