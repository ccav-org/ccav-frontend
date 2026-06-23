import { studentCourses, trainingCourse } from "@/lib/courseData";
import CourseDetailClient from "./CourseDetailClient";

export function generateStaticParams() {
  const allCourses = [...studentCourses, trainingCourse];
  return allCourses.map((course) => ({
    id: course.id,
  }));
}

export default async function CourseDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return <CourseDetailClient id={id} />;
}
