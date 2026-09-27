import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

// Allow large payloads for base64 image uploading and processing
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

function getGenAIClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured in the environment.');
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

function parseBase64Image(dataUrlOrBase64: string, defaultMime = 'image/png') {
  if (dataUrlOrBase64.startsWith('data:')) {
    const matches = dataUrlOrBase64.match(/^data:([a-zA-Z0-9\/+-]+);base64,(.+)$/s);
    if (matches && matches.length === 3) {
      return {
        mimeType: matches[1],
        data: matches[2].trim(),
      };
    }
  }
  return {
    mimeType: defaultMime,
    data: dataUrlOrBase64.trim(),
  };
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', hasKey: !!process.env.GEMINI_API_KEY });
});

/**
 * Feature: Create & Edit Images using gemini-3.1-flash-image-preview
 * Supports text-to-image or image-to-image (editing mockups, logos, backgrounds)
 */
app.post('/api/gemini/create-or-edit', async (req, res) => {
  try {
    const { prompt, image, aspectRatio = '1:1' } = req.body;

    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({ error: 'A text prompt is required.' });
    }

    const ai = getGenAIClient();
    const parts: any[] = [];

    if (image && typeof image === 'string') {
      const parsed = parseBase64Image(image);
      parts.push({
        inlineData: {
          mimeType: parsed.mimeType,
          data: parsed.data,
        },
      });
    }

    parts.push({
      text: prompt,
    });

    const response = await ai.models.generateContent({
      model: 'gemini-3.1-flash-image-preview',
      contents: {
        parts,
      },
      config: {
        imageConfig: {
          aspectRatio: aspectRatio || '1:1',
        },
      },
    });

    let imageUrl: string | null = null;
    let textOutput = '';

    const candidate = response.candidates?.[0];
    if (candidate?.content?.parts) {
      for (const part of candidate.content.parts) {
        if (part.inlineData?.data) {
          const mime = part.inlineData.mimeType || 'image/png';
          imageUrl = `data:${mime};base64,${part.inlineData.data}`;
        } else if (part.text) {
          textOutput += part.text;
        }
      }
    }

    if (!imageUrl) {
      return res.status(500).json({
        error: textOutput || 'The model did not return an image. Please try a different prompt.',
      });
    }

    res.json({
      success: true,
      imageUrl,
      text: textOutput,
      model: 'gemini-3.1-flash-image-preview',
    });
  } catch (error: any) {
    console.error('Error in create-or-edit:', error);
    res.status(500).json({
      error: error.message || 'Failed to generate/edit image.',
    });
  }
});

/**
 * Feature: Generate High-Quality Images using gemini-3-pro-image-preview
 * Supports user-selected imageSize (1K, 2K, 4K) and aspect ratios
 */
app.post('/api/gemini/generate-pro', async (req, res) => {
  try {
    const {
      prompt,
      imageSize = '1K',
      aspectRatio = '1:1',
      referenceImage,
    } = req.body;

    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({ error: 'A text prompt is required.' });
    }

    // Validate imageSize
    const validSizes = ['1K', '2K', '4K'];
    const chosenSize = validSizes.includes(imageSize) ? imageSize : '1K';

    const ai = getGenAIClient();
    const parts: any[] = [];

    if (referenceImage && typeof referenceImage === 'string') {
      const parsed = parseBase64Image(referenceImage);
      parts.push({
        inlineData: {
          mimeType: parsed.mimeType,
          data: parsed.data,
        },
      });
    }

    parts.push({
      text: prompt,
    });

    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-image-preview',
      contents: {
        parts,
      },
      config: {
        imageConfig: {
          imageSize: chosenSize as '1K' | '2K' | '4K',
          aspectRatio: aspectRatio || '1:1',
        },
      },
    });

    let imageUrl: string | null = null;
    let textOutput = '';

    const candidate = response.candidates?.[0];
    if (candidate?.content?.parts) {
      for (const part of candidate.content.parts) {
        if (part.inlineData?.data) {
          const mime = part.inlineData.mimeType || 'image/png';
          imageUrl = `data:${mime};base64,${part.inlineData.data}`;
        } else if (part.text) {
          textOutput += part.text;
        }
      }
    }

    if (!imageUrl) {
      return res.status(500).json({
        error: textOutput || 'The model did not return an image. Please try adjusting your prompt.',
      });
    }

    res.json({
      success: true,
      imageUrl,
      text: textOutput,
      model: 'gemini-3-pro-image-preview',
      imageSize: chosenSize,
      aspectRatio,
    });
  } catch (error: any) {
    console.error('Error in generate-pro:', error);
    res.status(500).json({
      error: error.message || 'Failed to generate high-quality image.',
    });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

startServer();
