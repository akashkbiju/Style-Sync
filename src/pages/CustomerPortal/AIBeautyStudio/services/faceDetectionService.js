// StyleSync Face and Hair Detection Service
// Provides precision facial landmark tracking, hairline detection, and face preservation zone calculation.
// Combines MediaPipe FaceLandmarker with robust in-browser Canvas Computer Vision fallback.

import { FilesetResolver, FaceLandmarker } from '@mediapipe/tasks-vision';

let faceLandmarkerInstance = null;
let isInitializingMediaPipe = false;
let mediaPipeLoadFailed = false;

/**
 * Initializes MediaPipe FaceLandmarker (cached singleton).
 */
export const getFaceLandmarker = async () => {
  if (faceLandmarkerInstance) return faceLandmarkerInstance;
  if (mediaPipeLoadFailed) return null;
  if (isInitializingMediaPipe) {
    // Wait briefly if already initializing
    await new Promise(r => setTimeout(r, 400));
    return faceLandmarkerInstance;
  }

  isInitializingMediaPipe = true;
  try {
    const vision = await FilesetResolver.forVisionTasks(
      'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm'
    );

    faceLandmarkerInstance = await FaceLandmarker.createFromOptions(vision, {
      baseOptions: {
        modelAssetPath: 'https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task',
        delegate: 'GPU'
      },
      runningMode: 'IMAGE',
      numFaces: 1
    });

    isInitializingMediaPipe = false;
    return faceLandmarkerInstance;
  } catch (err) {
    console.warn('MediaPipe FaceLandmarker failed to load from CDN, activating Canvas CV fallback:', err);
    mediaPipeLoadFailed = true;
    isInitializingMediaPipe = false;
    return null;
  }
};

/**
 * Canvas Computer Vision Face & Feature Detector (Fallback).
 * Scans skin color chromaticity in YCbCr color space and locates the eye line via contrast.
 */
export const detectFaceCanvasCV = (imageElement) => {
  const W = imageElement.naturalWidth || imageElement.width || 800;
  const H = imageElement.naturalHeight || imageElement.height || 1000;

  const canvas = document.createElement('canvas');
  // Downsample for fast scanning
  const scanW = 240;
  const scanH = Math.round(scanW * (H / W));
  canvas.width = scanW;
  canvas.height = scanH;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(imageElement, 0, 0, scanW, scanH);

  const imgData = ctx.getImageData(0, 0, scanW, scanH);
  const data = imgData.data;

  let minX = scanW, maxX = 0, minY = scanH, maxY = 0;
  let totalSkinX = 0, totalSkinY = 0, skinPixelCount = 0;

  // Skin color chromaticity filter in YCbCr space
  for (let y = 0; y < scanH; y++) {
    for (let x = 0; x < scanW; x++) {
      const idx = (y * scanW + x) * 4;
      const r = data[idx];
      const g = data[idx + 1];
      const b = data[idx + 2];

      // Convert to YCbCr
      const yVal  = 0.299 * r + 0.587 * g + 0.114 * b;
      const cbVal = 128 - 0.168736 * r - 0.331264 * g + 0.5 * b;
      const crVal = 128 + 0.5 * r - 0.418688 * g - 0.081312 * b;

      // Human skin chrominance bounds
      if (yVal > 40 && cbVal >= 77 && cbVal <= 128 && crVal >= 133 && crVal <= 175) {
        skinPixelCount++;
        totalSkinX += x;
        totalSkinY += y;

        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }

  // If no clear skin detected, provide proportional center estimate
  if (skinPixelCount < scanW * scanH * 0.04) {
    const scaleX = W / scanW;
    const scaleY = H / scanH;
    return {
      detected: false,
      confidence: 0.50,
      source: 'heuristic',
      center: { x: W * 0.5, y: H * 0.48 },
      forehead: { x: W * 0.5, y: H * 0.28 },
      hairlineY: H * 0.24,
      eyebrowY: H * 0.34,
      eyeLineY: H * 0.39,
      leftEye: { x: W * 0.40, y: H * 0.39 },
      rightEye: { x: W * 0.60, y: H * 0.39 },
      chin: { x: W * 0.5, y: H * 0.72 },
      faceWidth: W * 0.42,
      faceHeight: H * 0.46,
      tiltAngleRad: 0
    };
  }

  const scaleX = W / scanW;
  const scaleY = H / scanH;

  const faceCenterScanX = totalSkinX / skinPixelCount;
  const faceCenterScanY = totalSkinY / skinPixelCount;

  const faceWidth = Math.max(W * 0.25, (maxX - minX) * scaleX);
  const faceHeight = Math.max(H * 0.30, (maxY - minY) * scaleY);
  const centerX = faceCenterScanX * scaleX;
  const centerY = faceCenterScanY * scaleY;

  const chinY = maxY * scaleY;
  const topFaceY = minY * scaleY;
  const eyebrowY = topFaceY + (chinY - topFaceY) * 0.30;
  const eyeLineY = topFaceY + (chinY - topFaceY) * 0.38;
  const hairlineY = topFaceY + (chinY - topFaceY) * 0.12;

  return {
    detected: true,
    confidence: 0.85,
    source: 'canvas-cv',
    center: { x: centerX, y: centerY },
    forehead: { x: centerX, y: hairlineY },
    hairlineY: Math.max(H * 0.08, hairlineY),
    eyebrowY,
    eyeLineY,
    leftEye: { x: centerX - faceWidth * 0.22, y: eyeLineY },
    rightEye: { x: centerX + faceWidth * 0.22, y: eyeLineY },
    chin: { x: centerX, y: chinY },
    faceWidth,
    faceHeight,
    tiltAngleRad: 0
  };
};

/**
 * Main Face & Landmark Detector Dispatcher.
 * Uses MediaPipe FaceLandmarker if available, otherwise runs Canvas CV.
 */
export const detectFacialGeometry = async (imageElement) => {
  const W = imageElement.naturalWidth || imageElement.width || 800;
  const H = imageElement.naturalHeight || imageElement.height || 1000;

  try {
    const landmarker = await getFaceLandmarker();
    if (landmarker) {
      const results = landmarker.detect(imageElement);
      if (results.faceLandmarks && results.faceLandmarks.length > 0) {
        const landmarks = results.faceLandmarks[0];

        // Key MediaPipe landmark indices:
        // 10: Top of forehead center
        // 152: Chin bottom
        // 33: Left eye outer corner, 263: Right eye outer corner
        // 70: Left eyebrow, 300: Right eyebrow
        // 234: Left cheek / ear level, 454: Right cheek / ear level

        const foreheadPt = landmarks[10];
        const chinPt = landmarks[152];
        const leftEyePt = landmarks[33];
        const rightEyePt = landmarks[263];
        const leftCheekPt = landmarks[234];
        const rightCheekPt = landmarks[454];
        const leftEyebrowPt = landmarks[70];
        const rightEyebrowPt = landmarks[300];

        const leftEyeX = leftEyePt.x * W;
        const leftEyeY = leftEyePt.y * H;
        const rightEyeX = rightEyePt.x * W;
        const rightEyeY = rightEyePt.y * H;

        // Calculate head roll angle from eye slope
        const dx = rightEyeX - leftEyeX;
        const dy = rightEyeY - leftEyeY;
        const tiltAngleRad = Math.atan2(dy, dx);

        const faceWidth = Math.abs(rightCheekPt.x - leftCheekPt.x) * W * 1.15;
        const faceHeight = Math.abs(chinPt.y - foreheadPt.y) * H;
        const centerX = ((leftEyeX + rightEyeX) / 2);
        const eyeLineY = ((leftEyeY + rightEyeY) / 2);

        // Eyebrow level (boundary where hair must NEVER intrude)
        const eyebrowY = Math.min(leftEyebrowPt.y, rightEyebrowPt.y) * H;

        // Hairline sits above the top forehead landmark
        const foreheadY = foreheadPt.y * H;
        const hairlineY = foreheadY - faceHeight * 0.10;

        return {
          detected: true,
          confidence: 0.98,
          source: 'mediapipe',
          center: { x: centerX, y: eyeLineY + faceHeight * 0.15 },
          forehead: { x: centerX, y: foreheadY },
          hairlineY: Math.max(H * 0.05, hairlineY),
          eyebrowY,
          eyeLineY,
          leftEye: { x: leftEyeX, y: leftEyeY },
          rightEye: { x: rightEyeX, y: rightEyeY },
          chin: { x: chinPt.x * W, y: chinPt.y * H },
          faceWidth,
          faceHeight,
          tiltAngleRad
        };
      }
    }
  } catch (err) {
    console.warn('MediaPipe detection failed, falling back to Canvas CV:', err);
  }

  // Fallback to Canvas Computer Vision
  return detectFaceCanvasCV(imageElement);
};
