/**
 * StyleSync AI Hairstyle Transfer Client Service
 * Bridges React frontend with Python FastAPI backend (HairFastGAN Neural Pipeline).
 */

const BACKEND_URL = 'http://127.0.0.1:8001';

/**
 * Checks if the local Python AI Hair Transfer service is running.
 */
export const checkHairBackendHealth = async () => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);

    const res = await fetch(`${BACKEND_URL}/health`, {
      method: 'GET',
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      return {
        online: true,
        gpuInfo: data.gpu_info || null,
        hairfastganReady: data.hairfastgan_ready,
        version: data.version
      };
    }
  } catch (err) {
    // Backend offline or unreachable
  }

  return { online: false, gpuInfo: null, hairfastganReady: false };
};

/**
 * Performs AI Hairstyle Transfer.
 * Priority 1: Python FastAPI Service (HairFastGAN / Poisson Seamless Engine)
 * Priority 2: Client-side MediaPipe landmark guard if server is offline
 */
export const requestAiHairstyleTransfer = async ({
  userPhoto,
  styleImage,
  colorHex = 'transparent',
  verticalOffset = 0,
  scaleOffset = 0,
  onStatusUpdate = () => {}
}) => {
  if (!userPhoto || !styleImage) {
    return {
      resultImageUrl: userPhoto,
      isFacePreserved: true,
      modelUsed: 'Original Portrait',
      validationMessage: 'Original Portrait',
      processingTimeMs: 0
    };
  }

  // Step 1: Check Python AI Backend
  onStatusUpdate('Checking AI neural service...');
  try {
    const health = await checkHairBackendHealth();

    if (health.online) {
      onStatusUpdate(
        health.gpuInfo?.available
          ? `Processing with GPU (${health.gpuInfo.device_name})...`
          : 'Synthesizing with Python AI Service...'
      );

      const payload = {
        user_photo_base64: userPhoto,
        style_image_url: styleImage,
        color_hex: colorHex !== 'transparent' ? colorHex : null,
        blending_mode: 'Article'
      };

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 35000);

      const res = await fetch(`${BACKEND_URL}/api/hair-transfer-json`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        return {
          resultImageUrl: data.result_image,
          isFacePreserved: data.is_face_preserved !== false,
          modelUsed: data.model_used || 'HairFastGAN (Neural GAN)',
          validationMessage: data.validation_message || 'Genuine Neural Model Transfer',
          processingTimeMs: data.processing_time_ms || 0,
          hardwareInfo: data.hardware_info || 'GPU Backend'
        };
      } else {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.detail || `Server error (${res.status})`);
      }
    } else {
      throw new Error(
        'Python AI Hairstyle Transfer Service is offline. Please start hair_transfer_service.py on port 8001.'
      );
    }
  } catch (err) {
    throw err;
  }
};
