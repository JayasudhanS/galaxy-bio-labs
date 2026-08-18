/**
 * AutoCropImage
 *
 * Renders a product image so the ACTUAL product content fills the display
 * frame — not the surrounding white/off-white/transparent padding that is
 * often baked into source images.
 *
 * Algorithm
 * ─────────
 * 1. Draw the source image onto an off-screen <canvas>.
 * 2. Sample the four corner pixels to auto-detect the background colour.
 * 3. Walk every pixel and find the tightest bounding box of pixels that are
 *    NOT close to the detected background colour (the "content box").
 * 4. Scale that content box to fill the display frame minus a small margin,
 *    then blit it centred onto the visible <canvas>.
 *
 * This works for any uniform background: pure white, off-white (243 243 243),
 * light grey, or fully transparent — without any hardcoded threshold.
 */

import { useEffect, useRef, useState } from "react";

interface AutoCropImageProps {
  src: string;
  alt: string;
  /** Tailwind / CSS classes applied to the outer wrapper (the "frame"). */
  className?: string;
  /**
   * Maximum Euclidean RGB distance from the detected background colour for a
   * pixel to still be considered "background".  Default 22 — covers
   * pure-white AND near-white backgrounds like rgb(243 243 243).
   */
  bgTolerance?: number;
  /** 0–1 fraction kept as visual margin on each side. Default 0.05 (5 %). */
  marginFraction?: number;
}

// ── helpers ────────────────────────────────────────────────────────────────

/** Sample the colour at pixel (x, y) from an ImageData buffer. */
function samplePixel(
  data: Uint8ClampedArray,
  x: number,
  y: number,
  w: number,
): [number, number, number, number] {
  const i = (y * w + x) * 4;
  return [data[i]!, data[i + 1]!, data[i + 2]!, data[i + 3]!];
}

/** Euclidean distance in RGB space (alpha ignored). */
function rgbDist(
  [r1, g1, b1]: [number, number, number, number],
  [r2, g2, b2]: [number, number, number, number],
) {
  return Math.sqrt((r1 - r2) ** 2 + (g1 - g2) ** 2 + (b1 - b2) ** 2);
}

// ── component ───────────────────────────────────────────────────────────────

export function AutoCropImage({
  src,
  alt,
  className = "",
  bgTolerance = 22,
  marginFraction = 0.05,
}: AutoCropImageProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (!src) return;
    setReady(false);
    setHasError(false);

    const img = new Image();
    img.crossOrigin = "anonymous";

    img.onload = () => {
      const canvas = canvasRef.current;
      const wrapper = wrapperRef.current;
      if (!canvas || !wrapper) return;

      // ── frame dimensions (physical pixels) ────────────────────────────
      const dpr = window.devicePixelRatio || 1;
      const frameW = wrapper.clientWidth  || 320;
      const frameH = wrapper.clientHeight || 320;

      canvas.width  = frameW * dpr;
      canvas.height = frameH * dpr;
      canvas.style.width  = `${frameW}px`;
      canvas.style.height = `${frameH}px`;

      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      if (!ctx) return;

      const iw = img.naturalWidth;
      const ih = img.naturalHeight;

      // ── Step 1: draw source onto an off-screen canvas ─────────────────
      const off = document.createElement("canvas");
      off.width  = iw;
      off.height = ih;
      const offCtx = off.getContext("2d", { willReadFrequently: true })!;
      offCtx.drawImage(img, 0, 0);

      let data: Uint8ClampedArray;
      try {
        data = offCtx.getImageData(0, 0, iw, ih).data;
      } catch {
        // CORS / tainted canvas — fall back to simple centred fit
        ctx.scale(dpr, dpr);
        const s = Math.min(
          (frameW * (1 - marginFraction * 2)) / iw,
          (frameH * (1 - marginFraction * 2)) / ih,
        );
        ctx.drawImage(img, (frameW - iw * s) / 2, (frameH - ih * s) / 2, iw * s, ih * s);
        setReady(true);
        return;
      }

      // ── Step 2: detect background colour from the four corners ────────
      const corners: [number, number, number, number][] = [
        samplePixel(data, 0,      0,      iw),   // top-left
        samplePixel(data, iw - 1, 0,      iw),   // top-right
        samplePixel(data, 0,      ih - 1, iw),   // bottom-left
        samplePixel(data, iw - 1, ih - 1, iw),   // bottom-right
      ];

      // Use the most common corner colour (or top-left if all differ).
      // Average the corners if they are all within 30 units of each other.
      const allClose = corners.every((c) => rgbDist(c, corners[0]!) < 30);
      const bgColor: [number, number, number, number] = allClose
        ? [
            Math.round(corners.reduce((s, c) => s + c[0], 0) / 4),
            Math.round(corners.reduce((s, c) => s + c[1], 0) / 4),
            Math.round(corners.reduce((s, c) => s + c[2], 0) / 4),
            Math.round(corners.reduce((s, c) => s + c[3], 0) / 4),
          ]
        : corners[0]!;

      // ── Step 3: find the tight bounding box of non-background pixels ──
      let minX = iw, maxX = 0, minY = ih, maxY = 0;
      let found = false;

      for (let y = 0; y < ih; y++) {
        for (let x = 0; x < iw; x++) {
          const px = samplePixel(data, x, y, iw);
          const isTransparent = px[3] < 20;
          const isBg = rgbDist(px, bgColor) <= bgTolerance;

          if (!isTransparent && !isBg) {
            if (x < minX) minX = x;
            if (x > maxX) maxX = x;
            if (y < minY) minY = y;
            if (y > maxY) maxY = y;
            found = true;
          }
        }
      }

      // ── Step 4: scale content box into the frame ──────────────────────
      ctx.scale(dpr, dpr);

      if (!found || maxX - minX < 4 || maxY - minY < 4) {
        // Content detection failed — just fit the whole image
        const s = Math.min(
          (frameW * (1 - marginFraction * 2)) / iw,
          (frameH * (1 - marginFraction * 2)) / ih,
        );
        ctx.drawImage(img, (frameW - iw * s) / 2, (frameH - ih * s) / 2, iw * s, ih * s);
      } else {
        const contentW = maxX - minX + 1;
        const contentH = maxY - minY + 1;

        const usableW = frameW * (1 - marginFraction * 2);
        const usableH = frameH * (1 - marginFraction * 2);

        const scale = Math.min(usableW / contentW, usableH / contentH);

        const drawW = contentW * scale;
        const drawH = contentH * scale;
        const destX = (frameW - drawW) / 2;
        const destY = (frameH - drawH) / 2;

        ctx.drawImage(
          img,
          minX, minY,         // source crop origin
          contentW, contentH, // source crop size
          destX, destY,       // destination in frame
          drawW, drawH,       // destination size
        );
      }

      setReady(true);
    };

    img.onerror = () => {
      setHasError(true);
      setReady(true);
    };

    img.src = src;
  }, [src, bgTolerance, marginFraction]);

  return (
    <div ref={wrapperRef} className={`relative ${className}`}>
      {/* Fallback visible while canvas is computing or on hard error */}
      {hasError && (
        <img
          src={src}
          alt={alt}
          className="absolute inset-0 size-full object-contain p-6"
        />
      )}

      <canvas
        ref={canvasRef}
        aria-label={alt}
        role="img"
        className="block size-full"
        style={{
          opacity: ready && !hasError ? 1 : 0,
          transition: "opacity 0.45s ease",
        }}
      />

      {/* Shimmer placeholder while the canvas renders */}
      {!ready && (
        <div className="absolute inset-0 animate-pulse rounded-2xl bg-secondary/60" />
      )}
    </div>
  );
}
