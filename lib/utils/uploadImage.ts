"use client";

const R2_ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const EXT_BY_TYPE: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

/** Resize an image client-side (preserving its original format) and upload it to Cloudflare R2. */
export async function uploadResizedImageToR2(file: File, maxWidth: number, prefix = "products"): Promise<string> {
  const dataUrl: string = await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.onload = (e) => resolve(e.target?.result as string);
    reader.readAsDataURL(file);
  });

  // Keep the source format when R2 supports it; otherwise fall back to JPEG.
  const outputType = R2_ALLOWED_TYPES.has(file.type) ? file.type : "image/jpeg";
  const ext = EXT_BY_TYPE[outputType];

  const blob: Blob = await new Promise((resolve, reject) => {
    const img = new window.Image();
    img.onerror = () => reject(new Error("Failed to load image"));
    img.onload = () => {
      const canvas = document.createElement("canvas");
      let w = img.width, h = img.height;
      if (w > maxWidth) { h = Math.round(h * maxWidth / w); w = maxWidth; }
      canvas.width = w; canvas.height = h;
      canvas.getContext("2d")?.drawImage(img, 0, 0, w, h);
      canvas.toBlob(
        (b) => (b ? resolve(b) : reject(new Error("Failed to encode image"))),
        outputType,
        0.85,
      );
    };
    img.src = dataUrl;
  });

  // Browsers silently fall back to PNG if they can't encode the requested type (e.g. older
  // Safari with WebP) — use the blob's actual type so the filename matches the real bytes.
  const actualExt = EXT_BY_TYPE[blob.type] || ext;

  const form = new FormData();
  form.append("file", blob, `${file.name.replace(/\.[^.]+$/, "") || "image"}.${actualExt}`);
  form.append("prefix", prefix);
  const res = await fetch("/api/admin/upload", { method: "POST", body: form });
  const data = await res.json();
  if (!res.ok || !data?.url) throw new Error(data?.error || "Upload failed");
  return data.url as string;
}

/** Upload a file to Cloudflare R2 as-is, with no resizing/rasterizing — for SVGs and other vector/non-raster files. */
export async function uploadFileToR2(file: File, prefix = "content"): Promise<string> {
  const form = new FormData();
  form.append("file", file);
  form.append("prefix", prefix);
  const res = await fetch("/api/admin/upload", { method: "POST", body: form });
  const data = await res.json();
  if (!res.ok || !data?.url) throw new Error(data?.error || "Upload failed");
  return data.url as string;
}
