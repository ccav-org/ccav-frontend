import { getGalleryItems } from "@/lib/api";

export async function generateStaticParams() {
  try {
    const items = await getGalleryItems();
    return items.map((item) => ({ id: String(item.id) }));
  } catch {
    return [];
  }
}

export default function GalleryDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
