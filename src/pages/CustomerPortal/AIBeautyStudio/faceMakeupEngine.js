// StyleSync Face Makeup Simulation Engine
// Pure client-side HTML5 Canvas cosmetic simulation
// Provides realistic blending of lip shades, cheek blush, and eyeshadow tones

/**
 * Apply makeup layers to a portrait photo using Canvas blending modes
 * @param {Object} options
 * @param {string} options.imageSrc - Portrait image data URL
 * @param {Object} options.lip - { hex: string, opacity: number }
 * @param {Object} options.blush - { hex: string, opacity: number }
 * @param {Object} options.eyeshadow - { hex: string, opacity: number }
 * @returns {Promise<string>} Transformed image data URL
 */
export const renderMakeupPreview = ({
  imageSrc,
  lip = null,
  blush = null,
  eyeshadow = null,
}) => {
  return new Promise((resolve, reject) => {
    if (!imageSrc) {
      resolve(null);
      return;
    }

    // If no makeup layer is selected, return original
    if (!lip?.hex && !blush?.hex && !eyeshadow?.hex) {
      resolve(imageSrc);
      return;
    }

    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      try {
        const W = img.naturalWidth || img.width || 800;
        const H = img.naturalHeight || img.height || 1000;

        const canvas = document.createElement('canvas');
        canvas.width = W;
        canvas.height = H;
        const ctx = canvas.getContext('2d');

        // Draw original base portrait
        ctx.drawImage(img, 0, 0, W, H);

        const cx = W * 0.50;
        const eyeY = H * 0.40;
        const mouthY = H * 0.68;
        const mouthWidth = W * 0.16;
        const mouthHeight = H * 0.055;

        // ─── 1. BLUSH APPLICATION (Cheeks) ───
        if (blush && blush.hex && blush.hex !== 'transparent') {
          ctx.save();
          ctx.globalCompositeOperation = 'soft-light';
          ctx.globalAlpha = Math.min(0.85, (blush.opacity || 0.45));

          const cheekY = H * 0.52;
          const leftCheekX = cx - W * 0.22;
          const rightCheekX = cx + W * 0.22;
          const blushRadius = W * 0.11;

          [leftCheekX, rightCheekX].forEach(cheekX => {
            const grad = ctx.createRadialGradient(cheekX, cheekY, blushRadius * 0.1, cheekX, cheekY, blushRadius);
            grad.addColorStop(0, blush.hex);
            grad.addColorStop(0.65, blush.hex);
            grad.addColorStop(1, 'transparent');

            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.ellipse(cheekX, cheekY, blushRadius, blushRadius * 0.75, 0, 0, Math.PI * 2);
            ctx.fill();
          });

          ctx.restore();
        }

        // ─── 2. EYESHADOW APPLICATION (Eyelids) ───
        if (eyeshadow && eyeshadow.hex && eyeshadow.hex !== 'transparent') {
          ctx.save();
          ctx.globalCompositeOperation = 'soft-light';
          ctx.globalAlpha = Math.min(0.75, (eyeshadow.opacity || 0.40));

          const eyeSpacing = W * 0.15;
          const eyeWidth = W * 0.09;
          const eyeHeight = H * 0.035;

          [cx - eyeSpacing, cx + eyeSpacing].forEach(eyeX => {
            const grad = ctx.createRadialGradient(eyeX, eyeY - eyeHeight * 0.5, eyeWidth * 0.1, eyeX, eyeY, eyeWidth);
            grad.addColorStop(0, eyeshadow.hex);
            grad.addColorStop(0.7, eyeshadow.hex);
            grad.addColorStop(1, 'transparent');

            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.ellipse(eyeX, eyeY - eyeHeight * 0.3, eyeWidth, eyeHeight, 0, 0, Math.PI * 2);
            ctx.fill();
          });

          ctx.restore();
        }

        // ─── 3. LIPSTICK APPLICATION (Lips) ───
        if (lip && lip.hex && lip.hex !== 'transparent') {
          ctx.save();
          
          // Primary color wash
          ctx.globalCompositeOperation = 'color';
          ctx.globalAlpha = Math.min(0.9, (lip.opacity || 0.65));

          const lipGrad = ctx.createRadialGradient(cx, mouthY, mouthWidth * 0.1, cx, mouthY, mouthWidth);
          lipGrad.addColorStop(0, lip.hex);
          lipGrad.addColorStop(0.85, lip.hex);
          lipGrad.addColorStop(1, 'transparent');

          ctx.fillStyle = lipGrad;
          ctx.beginPath();
          ctx.ellipse(cx, mouthY, mouthWidth, mouthHeight, 0, 0, Math.PI * 2);
          ctx.fill();

          // Second pass: soft-light for satin finish & highlight retention
          ctx.globalCompositeOperation = 'soft-light';
          ctx.globalAlpha = (lip.opacity || 0.65) * 0.8;
          ctx.fillStyle = lip.hex;
          ctx.beginPath();
          ctx.ellipse(cx, mouthY, mouthWidth * 0.95, mouthHeight * 0.9, 0, 0, Math.PI * 2);
          ctx.fill();

          ctx.restore();
        }

        resolve(canvas.toDataURL('image/jpeg', 0.92));

      } catch (err) {
        console.warn('Makeup preview rendering error:', err);
        resolve(imageSrc);
      }
    };

    img.onerror = () => {
      resolve(imageSrc);
    };

    img.src = imageSrc;
  });
};
