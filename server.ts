import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Proxy route
  app.post("/api/openrouter", async (req, res) => {
    console.log('Proxying request to OpenRouter...');
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000); // 15s timeout

    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'HTTP-Referer': process.env.APP_URL || '',
          'X-OpenRouter-Title': 'EcoPulse Sentinel AI',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(req.body),
        signal: controller.signal
      });

      clearTimeout(timeout);
      
      const data = await response.json();
      console.log('OpenRouter response status:', response.status);
      if (!response.ok) {
        console.error('OpenRouter error details:', data);
      }
      res.status(response.status).json(data);
    } catch (error) {
      clearTimeout(timeout);
      console.error('Error proxying to OpenRouter:', error);
      res.status(500).json({ error: 'Failed to proxy request to OpenRouter', details: error instanceof Error ? error.message : 'Unknown error' });
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
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
