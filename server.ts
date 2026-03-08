import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function startServer() {
  const app = express();
  const port = 3000;

  app.use(express.json());

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
