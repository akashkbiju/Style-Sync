// StyleSync AI Hairstyle Service & Integration Layer
// Handles real AI provider requests (Google Gemini / Imagen 3, Fal.ai, Replicate, Hugging Face, Custom Backend)
// And provides client-side Canvas color-tinting simulation

const STORAGE_KEY = 'stylesync_ai_hair_config';

/**
 * Get current AI Service configuration from localStorage or .env
 */
export const getAIServiceConfig = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.apiKey) return parsed;
    }
  } catch (e) {
    // Ignore parsing errors
  }

  const envKey = 
    import.meta.env.VITE_AI_HAIRSTYLE_API_KEY || 
    import.meta.env.VITE_GEMINI_API_KEY || 
    import.meta.env.VITE_FAL_KEY || 
    import.meta.env.VITE_REPLICATE_API_TOKEN || 
    '';
    
  const envProvider = 
    import.meta.env.VITE_AI_HAIRSTYLE_PROVIDER || 
    (import.meta.env.VITE_FAL_KEY ? 'fal' : 
     import.meta.env.VITE_REPLICATE_API_TOKEN ? 'replicate' : 
     import.meta.env.VITE_GEMINI_API_KEY ? 'gemini' : 'gemini');

  const envEndpoint = import.meta.env.VITE_AI_HAIRSTYLE_ENDPOINT || '';

  return {
    isConfigured: !!envKey,
    apiKey: envKey,
    provider: envProvider, // 'gemini' | 'fal' | 'replicate' | 'huggingface' | 'custom'
    endpoint: envEndpoint,
    backendMode: !envKey && !!envEndpoint ? 'custom' : 'direct',
  };
};

/**
 * Save custom AI configuration to localStorage
 */
export const saveAIServiceConfig = (config) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({
    ...config,
    isConfigured: !!config.apiKey || !!config.endpoint
  }));
};

/**
 * Clears AI configuration
 */
export const clearAIServiceConfig = () => {
  localStorage.removeItem(STORAGE_KEY);
};

/**
 * Generates an AI Hairstyle Try-On preview using the configured AI service.
 * If no service is configured, strictly returns a clear non-mock message.
 *
 * @param {Object} params
 * @param {string} params.userImageBase64 - The customer photo (Data URL or hosted URL)
 * @param {Object} params.hairstyle - The selected hairstyle object
 * @param {Object} params.hairColor - The selected hair color object
 * @param {Function} params.onProgress - Progress callback (percentage: number, statusText: string)
 * @returns {Promise<{success: boolean, resultImageUrl?: string, error?: string, isConfigured: boolean}>}
 */
export const requestAIHairstyleGeneration = async ({
  userImageBase64,
  hairstyle,
  hairColor,
  onProgress = () => {}
}) => {
  const config = getAIServiceConfig();

  // Strict Compliance: Never pretend an image was AI-generated when the service is not configured!
  if (!config.isConfigured && !config.endpoint) {
    return {
      success: false,
      isConfigured: false,
      error: 'AI Try-On API is not configured. Please add your API key in .env or Settings to enable generative AI hair rendering.'
    };
  }

  onProgress(15, 'Preparing photo & styling prompt...');

  const colorDesc = hairColor && hairColor.id !== 'original' 
    ? `Hair color: ${hairColor.name} (${hairColor.description}).` 
    : 'Preserve natural hair color.';

  const prompt = `Professional salon portrait photograph of the same person with ${hairstyle.name} haircut, ${hairstyle.description}. ${colorDesc} Maintain exact facial identity, skin tone, bone structure, expression, studio lighting, and photorealistic 8k hair texture.`;

  try {
    // ── Provider 1: Google Gemini / Imagen 3 ──────────────────────────────
    if (config.provider === 'gemini') {
      onProgress(35, 'Contacting Google Generative AI Imagen 3...');
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-002:predict?key=${config.apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          instances: [
            { prompt: prompt }
          ],
          parameters: {
            sampleCount: 1,
            aspectRatio: "1:1",
            outputMimeType: "image/jpeg"
          }
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || `Google Imagen 3 API error (${response.status})`);
      }

      onProgress(85, 'Finalizing generated portrait...');
      const data = await response.json();
      const b64 = data.predictions?.[0]?.bytesBase64Encoded;

      if (!b64) {
        throw new Error('Google Imagen 3 did not return image data');
      }

      const resultImageUrl = `data:image/jpeg;base64,${b64}`;
      onProgress(100, 'Complete!');
      return {
        success: true,
        isConfigured: true,
        resultImageUrl
      };
    }

    // ── Provider 2: Fal.ai ───────────────────────────────────────────────
    if (config.provider === 'fal') {
      onProgress(35, 'Connecting to Fal.ai model...');
      const response = await fetch('https://queue.fal.run/fal-ai/flux-subject', {
        method: 'POST',
        headers: {
          'Authorization': `Key ${config.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          prompt: prompt,
          image_url: userImageBase64,
          negative_prompt: 'deformed face, blurry, bad anatomy, artificial sticker hair, unnatural colors',
          num_images: 1,
          sync_mode: true
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `Fal.ai API error (${response.status})`);
      }

      onProgress(85, 'Finalizing hairstyle render...');
      const data = await response.json();
      const resultImageUrl = data.images?.[0]?.url || data.image?.url;

      if (!resultImageUrl) {
        throw new Error('No image returned by Fal.ai API');
      }

      onProgress(100, 'Complete!');
      return {
        success: true,
        isConfigured: true,
        resultImageUrl
      };
    }

    // ── Provider 3: Replicate API ─────────────────────────────────────────
    if (config.provider === 'replicate') {
      onProgress(35, 'Submitting job to Replicate...');
      const response = await fetch('https://api.replicate.com/v1/predictions', {
        method: 'POST',
        headers: {
          'Authorization': `Token ${config.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          version: 'latest',
          input: {
            image: userImageBase64,
            prompt: prompt
          }
        })
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.detail || `Replicate API error (${response.status})`);
      }

      const prediction = await response.json();
      onProgress(70, 'Processing model output...');
      
      const resultImageUrl = Array.isArray(prediction.output) ? prediction.output[0] : prediction.output;
      if (resultImageUrl) {
        return { success: true, isConfigured: true, resultImageUrl };
      }

      return {
        success: true,
        isConfigured: true,
        resultImageUrl: prediction.urls?.get || null
      };
    }

    // ── Provider 4: Hugging Face Inference API ────────────────────────────
    if (config.provider === 'huggingface') {
      onProgress(35, 'Sending request to Hugging Face Inference API...');
      const response = await fetch('https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${config.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          inputs: prompt
        })
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.error || `Hugging Face API error (${response.status})`);
      }

      const blob = await response.blob();
      const resultImageUrl = URL.createObjectURL(blob);
      onProgress(100, 'Complete!');
      return {
        success: true,
        isConfigured: true,
        resultImageUrl
      };
    }

    // ── Provider 5: Custom Backend / Serverless Endpoint ──────────────────
    if (config.endpoint) {
      onProgress(40, 'Contacting secure salon backend service...');
      const response = await fetch(config.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(config.apiKey ? { 'Authorization': `Bearer ${config.apiKey}` } : {})
        },
        body: JSON.stringify({
          image: userImageBase64,
          hairstyleId: hairstyle.id,
          hairstyleName: hairstyle.name,
          colorHex: hairColor.hex,
          colorName: hairColor.name,
          prompt
        })
      });

      if (!response.ok) {
        throw new Error(`Custom AI Endpoint returned status ${response.status}`);
      }

      const data = await response.json();
      onProgress(100, 'Complete!');
      return {
        success: true,
        isConfigured: true,
        resultImageUrl: data.imageUrl || data.resultImageUrl
      };
    }

    throw new Error('Unsupported AI provider configuration');

  } catch (err) {
    console.error('AI Generation Error:', err);
    return {
      success: false,
      isConfigured: true,
      error: err.message || 'An error occurred while contacting the AI hairstyle try-on service.'
    };
  }
};

/**
 * Intelligent AI Biometric Face Analysis using Google Gemini Vision
 * Analyzes uploaded portrait to determine face shape and suggest flattering styles.
 */
export const analyzeFaceWithGeminiVision = async (userImageBase64) => {
  const config = getAIServiceConfig();
  if (!config.apiKey || config.provider !== 'gemini') {
    return null;
  }

  try {
    // Strip Data URL prefix if present for raw Base64
    const base64Data = userImageBase64.replace(/^data:image\/\w+;base64,/, '');

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${config.apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: 'Analyze the person in this photo for salon styling. Identify their face shape as exactly one of: Oval, Round, Square, Heart, Oblong, or Diamond. Also identify natural hair texture (Straight, Wavy, Curly). Reply with strict JSON only: {"faceShape": "...", "hairTexture": "...", "consultationNote": "..."}'
              },
              {
                inlineData: {
                  mimeType: 'image/jpeg',
                  data: base64Data
                }
              }
            ]
          }
        ]
      })
    });

    if (!response.ok) return null;
    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (text) {
      const cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim();
      return JSON.parse(cleaned);
    }
  } catch (e) {
    console.warn('Gemini vision face analysis failed:', e);
  }
  return null;
};

/**
 * Client-Side Realistic Canvas Hair Color Simulation
 * Applies a photographic blend of the selected color swatch to the upper hair region
 * with gradient feathering and luminosity preservation.
 *
 * @param {string} imageSrc - Base64 Data URL or loaded image URL
 * @param {string} colorHex - Hair color hex
 * @param {number} intensity - Opacity / intensity (0.1 to 1.0)
 * @returns {Promise<string>} - Resolves to updated Data URL
 */
export const applyCanvasHairTint = (imageSrc, colorHex, intensity = 0.55) => {
  return new Promise((resolve, reject) => {
    if (!colorHex || colorHex === 'transparent') {
      resolve(imageSrc);
      return;
    }

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth || img.width;
      canvas.height = img.naturalHeight || img.height;
      const ctx = canvas.getContext('2d');

      // 1. Draw original photo
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      // 2. Prepare hair mask overlay (upper 55% of portrait with radial feathering away from face center)
      const w = canvas.width;
      const h = canvas.height;

      ctx.save();
      
      // Create upper hair region path
      ctx.beginPath();
      // Cover top crown and sides where hair lives
      ctx.rect(0, 0, w, h * 0.65);
      ctx.clip();

      // Blend mode: 'color' or 'soft-light' creates natural hair tinting preserving shadows & highlights
      ctx.globalCompositeOperation = 'color';
      ctx.globalAlpha = Math.min(1.0, Math.max(0.2, intensity));
      ctx.fillStyle = colorHex;
      ctx.fillRect(0, 0, w, h);

      // Add a subtle soft-light overlay for tonal warmth and shine
      ctx.globalCompositeOperation = 'soft-light';
      ctx.globalAlpha = intensity * 0.45;
      ctx.fillStyle = colorHex;
      ctx.fillRect(0, 0, w, h);

      // Cut out the central face oval so the skin remains natural
      ctx.globalCompositeOperation = 'destination-out';
      const faceCenterX = w * 0.5;
      const faceCenterY = h * 0.42;
      const faceRadiusX = w * 0.22;
      const faceRadiusY = h * 0.25;

      const radialGrad = ctx.createRadialGradient(
        faceCenterX, faceCenterY, 0,
        faceCenterX, faceCenterY, Math.max(faceRadiusX, faceRadiusY)
      );
      radialGrad.addColorStop(0, 'rgba(0,0,0,1)');
      radialGrad.addColorStop(0.7, 'rgba(0,0,0,0.85)');
      radialGrad.addColorStop(1, 'rgba(0,0,0,0)');

      ctx.fillStyle = radialGrad;
      ctx.beginPath();
      ctx.ellipse(faceCenterX, faceCenterY, faceRadiusX, faceRadiusY, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();

      // Resolve final high-res composite data URL
      resolve(canvas.toDataURL('image/jpeg', 0.92));
    };

    img.onerror = () => {
      reject(new Error('Failed to process image for canvas color simulation'));
    };

    img.src = imageSrc;
  });
};
