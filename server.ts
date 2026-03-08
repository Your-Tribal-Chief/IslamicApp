import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Simple in-memory cache
const cache = new Map<string, { data: any, expiry: number }>();
const CACHE_DURATION = 1000 * 60 * 60; // 1 hour cache

async function fetchWithCache(url: string, cacheKey: string, duration = CACHE_DURATION) {
  const cached = cache.get(cacheKey);
  if (cached && cached.expiry > Date.now()) {
    return cached.data;
  }

  const response = await fetch(url);
  if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
  const data = await response.json();
  
  cache.set(cacheKey, { data, expiry: Date.now() + duration });
  return data;
}

async function startServer() {
  const app = express();
  const port = 3000;

  app.use(express.json());

  // Proxy for Quran API
  app.get('/api/quran/*', async (req, res) => {
    const path = req.params[0];
    const url = `https://api.alquran.cloud/v1/${path}${req.url.includes('?') ? '?' + req.url.split('?')[1] : ''}`;
    try {
      const data = await fetchWithCache(url, `quran-${req.url}`);
      res.json(data);
    } catch (err: any) {
      res.status(500).json({ error: 'Quran API Proxy Error', message: err.message });
    }
  });

  // Proxy for Hadith API
  app.get('/api/hadith/*', async (req, res) => {
    const path = req.params[0];
    const url = `https://raw.githubusercontent.com/fawazahmed0/hadith-api/1/${path}`;
    try {
      const data = await fetchWithCache(url, `hadith-${req.url}`);
      res.json(data);
    } catch (err: any) {
      res.status(500).json({ error: 'Hadith API Proxy Error', message: err.message });
    }
  });

  // Proxy for Aladhan API
  app.get('/api/aladhan/*', async (req, res) => {
    const path = req.params[0];
    const url = `https://api.aladhan.com/v1/${path}${req.url.includes('?') ? '?' + req.url.split('?')[1] : ''}`;
    try {
      const data = await fetchWithCache(url, `aladhan-${req.url}`);
      res.json(data);
    } catch (err: any) {
      res.status(500).json({ error: 'Aladhan API Proxy Error', message: err.message });
    }
  });

  // Proxy for OSM (Overpass) API
  app.get('/api/osm', async (req, res) => {
    const dataQuery = req.query.data as string;
    if (!dataQuery) return res.status(400).json({ error: 'Missing data query' });
    
    const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(dataQuery)}`;
    try {
      // OSM data might change, but 10 mins cache is fine for mosques/restaurants
      const data = await fetchWithCache(url, `osm-${dataQuery}`, 1000 * 60 * 10);
      res.json(data);
    } catch (err: any) {
      res.status(500).json({ error: 'OSM API Proxy Error', message: err.message });
    }
  });

  // Dynamic API handler for Vercel-style serverless functions
  app.all('/api/:function', async (req, res) => {
    const funcName = req.params.function;
    const funcPath = path.join(__dirname, 'api', `${funcName}.ts`);
    
    if (fs.existsSync(funcPath)) {
      try {
        // In dev mode, we can use tsx or dynamic import if configured
        // For simplicity in this environment, we'll use dynamic import
        const module = await import(`./api/${funcName}.ts`);
        if (module.default) {
          return module.default(req, res);
        }
      } catch (err: any) {
        console.error(`Error running API function ${funcName}:`, err);
        return res.status(500).json({ error: 'API Error', message: err.message });
      }
    }
    
    res.status(404).json({ error: 'API function not found' });
  });

  // Vite middleware for frontend
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });

  app.use(vite.middlewares);

  app.listen(port, '0.0.0.0', () => {
    console.log(`Server running at http://0.0.0.0:${port}`);
  });
}

startServer();
