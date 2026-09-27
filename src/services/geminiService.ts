export interface CreateOrEditParams {
  prompt: string;
  image?: string; // base64 or data URL
  aspectRatio?: '1:1' | '16:9' | '4:3' | '3:4' | '9:16';
}

export interface GenerateProParams {
  prompt: string;
  imageSize: '1K' | '2K' | '4K';
  aspectRatio?: '1:1' | '16:9' | '4:3' | '3:4' | '9:16';
  referenceImage?: string; // base64 or data URL
}

export interface GeminiImageResponse {
  success: boolean;
  imageUrl?: string;
  text?: string;
  model: string;
  imageSize?: string;
  aspectRatio?: string;
  error?: string;
}

export async function createOrEditImage(params: CreateOrEditParams): Promise<GeminiImageResponse> {
  const response = await fetch('/api/gemini/create-or-edit', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  });

  const data = await response.json();
  if (!response.ok || !data.success) {
    throw new Error(data.error || 'Failed to create/edit image with gemini-3.1-flash-image-preview');
  }

  return data;
}

export async function generateProImage(params: GenerateProParams): Promise<GeminiImageResponse> {
  const response = await fetch('/api/gemini/generate-pro', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  });

  const data = await response.json();
  if (!response.ok || !data.success) {
    throw new Error(data.error || 'Failed to generate high-quality image with gemini-3-pro-image-preview');
  }

  return data;
}
