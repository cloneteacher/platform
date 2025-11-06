import { generateMetadata } from "@/lib/utils/metadata";
import type { Metadata } from "next";
import LandingPage from "./landing-content";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://cloneteacher.com";

export const metadata: Metadata = generateMetadata({
  title:
    "CloneTeacher - Plataforma Educativa con IA | Sistema de Gestión de Aprendizaje",
  description:
    "Plataforma educativa completa con sistema de gestión de aprendizaje (LMS) y capacidades de inteligencia artificial. Ideal para estudiantes, profesores y administradores. Gestión de asignaturas, materiales educativos, chat con IA y sistema de exámenes.",
  path: "/",
  keywords: [
    "plataforma educativa",
    "LMS",
    "sistema de gestión de aprendizaje",
    "inteligencia artificial",
    "educación online",
    "aprendizaje",
    "CloneTeacher",
    "cloneteacher",
    "sistema educativo",
    "plataforma educativa con IA",
    "gestión de asignaturas",
    "materiales educativos",
  ],
});

export default function Page() {
  return <LandingPage />;
}
