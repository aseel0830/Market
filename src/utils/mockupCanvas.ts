export interface PlacementConfig {
  x: number; // percentage 0 - 100
  y: number; // percentage 0 - 100
  scale: number; // percentage 10 - 100
  rotation: number; // degrees -180 to 180
  opacity: number; // 0 - 100
  blendMode: 'multiply' | 'normal' | 'overlay' | 'screen' | 'darken';
  curve: number; // -50 to 50 for cylindrical warp
  colorEffect?: 'original' | 'white' | 'black' | 'gold' | 'invert';
  removeWhiteBg?: boolean;
}

/**
 * Creates an image element and loads a source URL asynchronously
 */
export function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = (e) => reject(new Error(`Failed to load image at ${src}: ${e}`));
    img.src = src;
  });
}

/**
 * Pre-processes logo for color effects or background removal
 */
export function processLogoImage(
  logoImg: HTMLImageElement,
  colorEffect: PlacementConfig['colorEffect'] = 'original',
  removeWhiteBg = false
): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = logoImg.naturalWidth || logoImg.width;
  canvas.height = logoImg.naturalHeight || logoImg.height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;

  ctx.drawImage(logoImg, 0, 0);

  if (colorEffect === 'original' && !removeWhiteBg) {
    return canvas;
  }

  const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imgData.data;

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const a = data[i + 3];

    if (a < 10) continue;

    // Optional background removal (near white threshold)
    if (removeWhiteBg) {
      if (r > 235 && g > 235 && b > 235) {
        data[i + 3] = 0;
        continue;
      }
    }

    if (colorEffect === 'white') {
      data[i] = 255;
      data[i + 1] = 255;
      data[i + 2] = 255;
    } else if (colorEffect === 'black') {
      data[i] = 20;
      data[i + 1] = 20;
      data[i + 2] = 20;
    } else if (colorEffect === 'gold') {
      data[i] = 220;
      data[i + 1] = 180;
      data[i + 2] = 75;
    } else if (colorEffect === 'invert') {
      data[i] = 255 - r;
      data[i + 1] = 255 - g;
      data[i + 2] = 255 - b;
    }
  }

  ctx.putImageData(imgData, 0, 0);
  return canvas;
}

/**
 * Renders the product mockup with realistic cylindrical warp and fabric blending onto target canvas
 */
export async function renderMockup({
  canvas,
  productImg,
  logoCanvasOrImg,
  placement,
  productColorHex,
}: {
  canvas: HTMLCanvasElement;
  productImg: HTMLImageElement;
  logoCanvasOrImg: HTMLCanvasElement | HTMLImageElement | null;
  placement: PlacementConfig;
  productColorHex?: string;
}) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const width = canvas.width;
  const height = canvas.height;

  // 1. Draw base product
  ctx.clearRect(0, 0, width, height);
  ctx.drawImage(productImg, 0, 0, width, height);

  // 2. Optional product tint if user changed default color
  if (productColorHex && productColorHex !== '#FFFFFF' && productColorHex !== '#F4EFE6') {
    ctx.save();
    ctx.globalCompositeOperation = 'multiply';
    ctx.globalAlpha = 0.55;
    ctx.fillStyle = productColorHex;
    ctx.fillRect(0, 0, width, height);
    ctx.restore();
  }

  // If no logo provided, we are done
  if (!logoCanvasOrImg) return;

  // Calculate logo target dimensions
  const logoAspect = logoCanvasOrImg.width / logoCanvasOrImg.height;
  const targetWidth = (width * (placement.scale / 100));
  const targetHeight = targetWidth / logoAspect;

  const centerX = (width * placement.x) / 100;
  const centerY = (height * placement.y) / 100;

  ctx.save();
  ctx.globalAlpha = Math.max(0, Math.min(1, placement.opacity / 100));

  // Blend mode mapping for HTML5 Canvas
  const blendMap: Record<PlacementConfig['blendMode'], GlobalCompositeOperation> = {
    multiply: 'multiply',
    normal: 'source-over',
    overlay: 'overlay',
    screen: 'screen',
    darken: 'darken',
  };
  ctx.globalCompositeOperation = blendMap[placement.blendMode] || 'multiply';

  // Apply rotation around target center
  ctx.translate(centerX, centerY);
  if (placement.rotation !== 0) {
    ctx.rotate((placement.rotation * Math.PI) / 180);
  }

  const halfW = targetWidth / 2;
  const halfH = targetHeight / 2;

  // 3. Render logo: either cylindrical warp or standard flat
  if (placement.curve && Math.abs(placement.curve) > 2) {
    // Cylindrical warp algorithm (strips)
    const strips = Math.min(80, Math.floor(targetWidth));
    const srcStripWidth = logoCanvasOrImg.width / strips;
    const dstStripWidth = targetWidth / strips;
    const curveAmount = placement.curve / 100; // curvature intensity

    for (let i = 0; i < strips; i++) {
      // normalized position from -1 (left) to 1 (right)
      const normX = ((i / strips) - 0.5) * 2;
      
      // Cylindrical projection horizontal compression
      const cylinderAngle = normX * (Math.PI / 3) * Math.abs(curveAmount) * 2;
      const compressedX = Math.sin(cylinderAngle) * halfW * 1.05;
      
      // Vertical curve arch
      const archOffset = (1 - Math.cos(cylinderAngle)) * (halfH * curveAmount * 0.4);

      // Shading calculation: subtle lighting falloff towards mug curve edges
      const shadingFactor = Math.max(0.75, Math.cos(cylinderAngle * 1.1));

      ctx.save();
      // Apply slight strip dimming for cylinder curvature 3D depth
      ctx.globalAlpha = (placement.opacity / 100) * shadingFactor;

      ctx.drawImage(
        logoCanvasOrImg,
        i * srcStripWidth,
        0,
        srcStripWidth,
        logoCanvasOrImg.height,
        compressedX - (dstStripWidth / 2),
        -halfH + archOffset,
        dstStripWidth + 0.8, // prevent fractional gaps
        targetHeight
      );
      ctx.restore();
    }
  } else {
    // Standard flat placement (for T-shirts, totes, hoodies)
    ctx.drawImage(
      logoCanvasOrImg,
      -halfW,
      -halfH,
      targetWidth,
      targetHeight
    );
  }

  ctx.restore();

  // 4. Subtle gloss/fabric highlight overlay over print area for realism
  ctx.save();
  ctx.globalCompositeOperation = 'overlay';
  ctx.globalAlpha = 0.08;
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, '#ffffff');
  gradient.addColorStop(0.5, 'transparent');
  gradient.addColorStop(1, '#000000');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
  ctx.restore();
}
