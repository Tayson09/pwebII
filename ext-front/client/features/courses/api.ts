import { apiRequest } from "@/lib/api-client";
import type { CourseListResponse } from "@/types/course";

export async function getCourses() {
  const response = await apiRequest<CourseListResponse>("cursos");
  return response.data;
}

export function createEnrollment(cursoId: string) {
  return apiRequest<unknown>("inscricoes", {
    method: "POST",
    body: JSON.stringify({ cursoId }),
  });
}
