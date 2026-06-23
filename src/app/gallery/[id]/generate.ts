import { getGalleryItems } from "@/lib/api";

// 预生成所有作品详情页（静态导出需要）
export async function generateStaticGalleryParams() {
  try {
    const items = await getGalleryItems();
    return items.map((item) => ({ id: String(item.id) }));
  } catch {
    return [];
  }
}
