/**
 * 可灵AI API 客户端调用库
 * 所有调用在浏览器端完成，密钥只存localStorage
 * @deprecated 仅限开发/原型验证。生产环境请使用后端 /api/kling/* 代理调用，不可在前端暴露 API 密钥。
 */

export interface KlingCredentials {
  accessKey: string;
  secretKey: string;
}

export interface TextToImageRequest {
  prompt: string;
  negative_prompt?: string;
  width?: number;
  height?: number;
  image_count?: number;
}

export interface TextToVideoRequest {
  prompt: string;
  negative_prompt?: string;
  image?: string; // base64 或 URL
  duration?: number; // 5 或 10
  aspect_ratio?: string; // "16:9", "9:16", "1:1"
}

const API_BASE = "https://api.klingai.com";

/**
 * HMAC-SHA256 签名
 */
async function hmacSha256(key: string, message: string): Promise<string> {
  const encoder = new TextEncoder();
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    encoder.encode(key),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", cryptoKey, encoder.encode(message));
  return Array.from(new Uint8Array(signature))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/**
 * 构造可灵API签名
 */
async function generateSignature(
  secretKey: string,
  method: string,
  path: string,
  body: string
): Promise<{ signature: string; timestamp: string }> {
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const message = `${method}${path}${timestamp}${body}`;
  const signature = await hmacSha256(secretKey, message);
  return { signature, timestamp };
}

/**
 * 可灵API请求封装
 */
async function klingRequest<T>(
  credentials: KlingCredentials,
  method: string,
  path: string,
  body?: object
): Promise<T> {
  const bodyStr = body ? JSON.stringify(body) : "";
  const { signature, timestamp } = await generateSignature(
    credentials.secretKey,
    method,
    path,
    bodyStr
  );

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "X-Access-Key": credentials.accessKey,
    "X-Signature": signature,
    "X-Timestamp": timestamp,
  };

  const response = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: bodyStr || undefined,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || `API错误: ${response.status}`);
  }

  return data;
}

/**
 * 文生图
 */
export async function textToImage(
  credentials: KlingCredentials,
  params: TextToImageRequest
) {
  return klingRequest<{ data: { task_id: string } }>(
    credentials,
    "POST",
    "/v1/images/generations",
    {
      model: "kling-v1",
      prompt: params.prompt,
      negative_prompt: params.negative_prompt || "",
      width: params.width || 1024,
      height: params.height || 1024,
      n: params.image_count || 1,
    }
  );
}

/**
 * 文生视频
 */
export async function textToVideo(
  credentials: KlingCredentials,
  params: TextToVideoRequest
) {
  const body: Record<string, unknown> = {
    model: "kling-v1",
    prompt: params.prompt,
    negative_prompt: params.negative_prompt || "",
    duration: params.duration || 5,
    aspect_ratio: params.aspect_ratio || "16:9",
  };

  if (params.image) {
    body.image = params.image;
  }

  return klingRequest<{ data: { task_id: string } }>(
    credentials,
    "POST",
    "/v1/videos/generations",
    body
  );
}

/**
 * 查询任务状态
 */
export async function queryTask(
  credentials: KlingCredentials,
  taskId: string,
  type: "image" | "video"
) {
  const path = type === "image"
    ? `/v1/images/generations/${taskId}`
    : `/v1/videos/generations/${taskId}`;

  return klingRequest<{
    data: {
      task_id: string;
      status: "pending" | "processing" | "succeeded" | "failed";
      output?: {
        works?: Array<{ resource_without_watermark: string }>;
        video?: { resource_without_watermark: string };
      };
      message?: string;
    };
  }>(credentials, "GET", path);
}

/**
 * 从localStorage读取密钥
 */
export function getStoredCredentials(): KlingCredentials | null {
  if (typeof window === "undefined") return null;
  const accessKey = localStorage.getItem("kling_access_key");
  const secretKey = localStorage.getItem("kling_secret_key");
  if (accessKey && secretKey) {
    return { accessKey, secretKey };
  }
  return null;
}

/**
 * 保存密钥到localStorage
 */
export function saveCredentials(credentials: KlingCredentials): void {
  if (typeof window === "undefined") return;
  localStorage.setItem("kling_access_key", credentials.accessKey);
  localStorage.setItem("kling_secret_key", credentials.secretKey);
}

/**
 * 清除存储的密钥
 */
export function clearCredentials(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem("kling_access_key");
  localStorage.removeItem("kling_secret_key");
}
