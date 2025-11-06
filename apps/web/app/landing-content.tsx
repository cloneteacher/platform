"use client";

import { Button } from "@workspace/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Badge } from "@workspace/ui/components/badge";
import Link from "next/link";
import { useAuthNavigation } from "@/hooks/use-auth-navigation";
import { useEffect, useState } from "react";
import {
  Bot,
  BookOpen,
  Users,
  GraduationCap,
  FileText,
  LayoutDashboard,
  CheckCircle2,
  Mail,
  Sparkles,
  Award,
  Settings,
  Globe,
  Menu,
  X,
} from "lucide-react";
import Image from "next/image";
import { LoadingScreen } from "@/components/loading";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://cloneteacher.com";

// Structured Data JSON-LD para SEO
const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${baseUrl}#organization`,
      name: "CloneTeacher",
      url: baseUrl,
      logo: `${baseUrl}/logo.png`,
      description:
        "Plataforma educativa completa con sistema de gestión de aprendizaje (LMS) y capacidades de inteligencia artificial para estudiantes, profesores y administradores.",
      contactPoint: {
        "@type": "ContactPoint",
        email: "contacto@cloneteacher.com",
        contactType: "customer service",
        availableLanguage: ["Spanish", "es"],
      },
      sameAs: [],
    },
    {
      "@type": "WebSite",
      "@id": `${baseUrl}#website`,
      url: baseUrl,
      name: "CloneTeacher",
      description:
        "Plataforma educativa completa con sistema de gestión de aprendizaje (LMS) y capacidades de inteligencia artificial.",
      publisher: {
        "@id": `${baseUrl}#organization`,
      },
      inLanguage: "es",
    },
    {
      "@type": "SoftwareApplication",
      "@id": `${baseUrl}#software`,
      name: "CloneTeacher",
      applicationCategory: "EducationalApplication",
      operatingSystem: "Web",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "EUR",
      },
      description:
        "Plataforma educativa completa con sistema de gestión de aprendizaje (LMS) y capacidades de inteligencia artificial. Incluye gestión de asignaturas, materiales educativos, chat con IA y sistema de exámenes.",
      featureList: [
        "Chat con inteligencia artificial",
        "Gestión de asignaturas y temas",
        "Materiales educativos",
        "Sistema de exámenes",
        "Dashboard para profesores",
        "Dashboard para estudiantes",
        "Dashboard para administradores",
      ],
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: "4.9",
        ratingCount: "200",
      },
    },
    {
      "@type": "FAQPage",
      "@id": `${baseUrl}#faq`,
      mainEntity: [
        {
          "@type": "Question",
          name: "¿Qué es CloneTeacher?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "CloneTeacher es una plataforma educativa completa con sistema de gestión de aprendizaje (LMS) y capacidades de inteligencia artificial. Permite a profesores crear asignaturas, gestionar materiales educativos y asignar estudiantes, mientras que los estudiantes pueden acceder a sus asignaturas, utilizar el chat con IA para resolver dudas y realizar exámenes.",
          },
        },
        {
          "@type": "Question",
          name: "¿Cómo funciona CloneTeacher?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "CloneTeacher funciona con tres roles principales: Administradores gestionan profesores y estadísticas, Profesores crean asignaturas y temas, suben materiales y asignan estudiantes, y Estudiantes acceden a sus asignaturas asignadas, descargan materiales, utilizan el chat con IA y realizan exámenes. Todo desde un dashboard intuitivo.",
          },
        },
        {
          "@type": "Question",
          name: "¿Qué tipos de instituciones pueden usar CloneTeacher?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "CloneTeacher es perfecto para escuelas, universidades, academias, centros de formación, profesores particulares y cualquier institución educativa que necesite gestionar el aprendizaje de manera eficiente con el apoyo de inteligencia artificial.",
          },
        },
        {
          "@type": "Question",
          name: "¿Necesito tarjeta de crédito para empezar?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "No, puedes empezar a usar CloneTeacher sin necesidad de tarjeta de crédito. Regístrate como estudiante o contacta con un administrador para obtener acceso como profesor.",
          },
        },
      ],
    },
  ],
};

export default function LandingPage() {
  const { authStatus, redirectToCorrectPage } = useAuthNavigation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Only redirect if user is authenticated
    // Don't redirect unauthenticated users - let them see the landing page
    if (authStatus === "authenticated") {
      redirectToCorrectPage();
    }
  }, [authStatus, redirectToCorrectPage]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // If user is authenticated, show loading while redirecting
  if (authStatus === "authenticated") {
    return <LoadingScreen message="Redirigiendo..." />;
  }

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />

      {/* Topbar */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled || isMobileMenuOpen
            ? "bg-background/80 backdrop-blur-lg border-b border-border/50 shadow-sm"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="flex items-center gap-2 transition-opacity hover:opacity-80"
            >
              <Image
                src="/logo.png"
                alt="CloneTeacher"
                width={32}
                height={32}
                className="w-8 h-8"
              />
              <span className="text-xl md:text-2xl font-semibold">
                Clone<span className="text-primary">Teacher</span>
              </span>
            </button>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              <button
                onClick={() => scrollToSection("features")}
                className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
              >
                Características
              </button>
              <button
                onClick={() => scrollToSection("how-it-works")}
                className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
              >
                Cómo Funciona
              </button>
              <button
                onClick={() => scrollToSection("use-cases")}
                className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
              >
                Casos de Uso
              </button>
              <button
                onClick={() => scrollToSection("testimonials")}
                className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
              >
                Testimonios
              </button>
            </div>

            {/* Desktop CTA Buttons */}
            <div className="hidden md:flex items-center gap-3">
              <Link href="/sign-in">
                <Button variant="ghost" size="sm">
                  Iniciar Sesión
                </Button>
              </Link>
              <Link href="/sign-up">
                <Button size="sm" className="rounded-full">
                  Registrarse
                </Button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-foreground/80 hover:text-foreground transition-colors"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden py-4 space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
              <button
                onClick={() => scrollToSection("features")}
                className="block w-full text-left px-4 py-2 text-sm font-medium text-foreground/80 hover:text-foreground hover:bg-muted/50 rounded-lg transition-colors"
              >
                Características
              </button>
              <button
                onClick={() => scrollToSection("how-it-works")}
                className="block w-full text-left px-4 py-2 text-sm font-medium text-foreground/80 hover:text-foreground hover:bg-muted/50 rounded-lg transition-colors"
              >
                Cómo Funciona
              </button>
              <button
                onClick={() => scrollToSection("use-cases")}
                className="block w-full text-left px-4 py-2 text-sm font-medium text-foreground/80 hover:text-foreground hover:bg-muted/50 rounded-lg transition-colors"
              >
                Casos de Uso
              </button>
              <button
                onClick={() => scrollToSection("testimonials")}
                className="block w-full text-left px-4 py-2 text-sm font-medium text-foreground/80 hover:text-foreground hover:bg-muted/50 rounded-lg transition-colors"
              >
                Testimonios
              </button>
              <div className="flex flex-col gap-2 px-4 pt-4 border-t border-border/50">
                <Link href="/sign-in" className="w-full">
                  <Button variant="outline" size="sm" className="w-full">
                    Iniciar Sesión
                  </Button>
                </Link>
                <Link href="/sign-up" className="w-full">
                  <Button size="sm" className="w-full rounded-full">
                    Registrarse
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </nav>

      <div className="min-h-svh bg-background">
        {/* Hero Section - Full Viewport */}
        <section
          id="home"
          className="relative flex items-center justify-center min-h-screen px-4 py-20 overflow-hidden"
        >
          {/* Video Background */}
          <video
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            className="absolute top-0 left-0 w-full h-full object-cover z-0"
            style={{ objectFit: "cover", minHeight: "100%", minWidth: "100%" }}
          >
            <source
              src="https://videos.pexels.com/video-files/5734826/5734826-hd_1920_1080_30fps.mp4"
              type="video/mp4"
            />
            Tu navegador no soporta videos.
          </video>

          {/* Overlay for readability - muy sutil */}
          <div className="absolute inset-0 bg-white/70 z-[1]" />

          <div className="max-w-6xl mx-auto text-center space-y-12 relative z-10">
            {/* Logo */}
            <div className="flex justify-center mb-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
              <div className="relative">
                <Image
                  src="/logo.png"
                  alt="CloneTeacher Logo"
                  width={240}
                  height={240}
                  className="w-24 h-24 md:w-32 md:h-32 lg:w-40 lg:h-40 drop-shadow-2xl"
                  priority
                />
                <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl -z-10 scale-150" />
              </div>
            </div>

            {/* Main Heading */}
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-300">
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-light tracking-tight text-foreground drop-shadow-lg">
                Clone
                <span className="font-semibold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent drop-shadow-lg">
                  Teacher
                </span>
              </h1>
              <p className="text-lg md:text-xl lg:text-2xl text-foreground/90 max-w-2xl mx-auto font-light leading-relaxed drop-shadow-md">
                Plataforma Educativa con Inteligencia Artificial
              </p>
            </div>

            {/* CTA Buttons - Glassmorphism */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-500">
              <Link href="/sign-in">
                <Button
                  size="lg"
                  className="text-base cursor-pointer md:text-lg px-8 md:px-10 h-12 md:h-14 rounded-full bg-background/20 backdrop-blur-md border border-white/20 text-foreground hover:bg-background/30 hover:border-white/30 transition-all duration-300 shadow-xl"
                >
                  Iniciar Sesión
                </Button>
              </Link>
              <Link href="/sign-up">
                <Button
                  size="lg"
                  className="text-base cursor-pointer md:text-lg px-8 md:px-10 h-12 md:h-14 rounded-full bg-background/20 backdrop-blur-md border border-white/20 text-foreground hover:bg-background/30 hover:border-white/30 transition-all duration-300 shadow-xl"
                >
                  Registrarse
                </Button>
              </Link>
            </div>

            {/* Scroll indicator */}
            <div className="absolute bottom-[-20vh] left-1/2 -translate-x-1/2 animate-bounce">
              <div className="w-6 h-10 border-2 border-muted-foreground/30 rounded-full flex items-start justify-center p-2">
                <div className="w-1.5 h-1.5 bg-muted-foreground/50 rounded-full animate-pulse" />
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section
          id="features"
          className="py-24 md:py-32 px-4 bg-gradient-to-b from-background to-muted/20"
        >
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-20 space-y-4">
              <h2 className="text-3xl md:text-5xl lg:text-6xl font-light tracking-tight mb-4">
                Todo lo que necesitas
              </h2>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto font-light">
                Todo lo que necesitas para gestionar el aprendizaje: dashboard
                completo, chat con IA, materiales educativos y más
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card className="border-0 shadow-sm hover:shadow-md transition-all duration-300 bg-background/50 backdrop-blur-sm">
                <CardHeader className="pb-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center mb-6">
                    <Bot className="w-7 h-7 text-primary" />
                  </div>
                  <CardTitle className="text-xl font-medium mb-2">
                    Chat con IA
                  </CardTitle>
                  <CardDescription className="text-base leading-relaxed">
                    Asistente inteligente que responde dudas sobre tus
                    materiales educativos 24/7 con respuestas precisas y
                    contextualizadas
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card className="border-0 shadow-sm hover:shadow-md transition-all duration-300 bg-background/50 backdrop-blur-sm">
                <CardHeader className="pb-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center mb-6">
                    <LayoutDashboard className="w-7 h-7 text-primary" />
                  </div>
                  <CardTitle className="text-xl font-medium mb-2">
                    Dashboard Completo
                  </CardTitle>
                  <CardDescription className="text-base leading-relaxed">
                    Control total de asignaturas, temas y estudiantes con un
                    panel intuitivo para gestionar todo desde un solo lugar
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card className="border-0 shadow-sm hover:shadow-md transition-all duration-300 bg-background/50 backdrop-blur-sm">
                <CardHeader className="pb-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center mb-6">
                    <BookOpen className="w-7 h-7 text-primary" />
                  </div>
                  <CardTitle className="text-xl font-medium mb-2">
                    Gestión de Asignaturas
                  </CardTitle>
                  <CardDescription className="text-base leading-relaxed">
                    Crea y organiza asignaturas y temas de manera eficiente.
                    Estructura tu contenido educativo fácilmente
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card className="border-0 shadow-sm hover:shadow-md transition-all duration-300 bg-background/50 backdrop-blur-sm">
                <CardHeader className="pb-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center mb-6">
                    <FileText className="w-7 h-7 text-primary" />
                  </div>
                  <CardTitle className="text-xl font-medium mb-2">
                    Materiales Educativos
                  </CardTitle>
                  <CardDescription className="text-base leading-relaxed">
                    Sube y gestiona archivos educativos (PDF, Word, Excel,
                    PowerPoint) para tus estudiantes
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card className="border-0 shadow-sm hover:shadow-md transition-all duration-300 bg-background/50 backdrop-blur-sm">
                <CardHeader className="pb-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center mb-6">
                    <Award className="w-7 h-7 text-primary" />
                  </div>
                  <CardTitle className="text-xl font-medium mb-2">
                    Sistema de Exámenes
                  </CardTitle>
                  <CardDescription className="text-base leading-relaxed">
                    Crea y realiza exámenes interactivos. Evalúa el progreso de
                    tus estudiantes de manera eficiente
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card className="border-0 shadow-sm hover:shadow-md transition-all duration-300 bg-background/50 backdrop-blur-sm">
                <CardHeader className="pb-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center mb-6">
                    <Users className="w-7 h-7 text-primary" />
                  </div>
                  <CardTitle className="text-xl font-medium mb-2">
                    Gestión de Estudiantes
                  </CardTitle>
                  <CardDescription className="text-base leading-relaxed">
                    Asigna estudiantes a asignaturas, supervisa su progreso y
                    gestiona el acceso de manera centralizada
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </section>

        {/* Cómo Funciona Section */}
        <section id="how-it-works" className="py-24 md:py-32 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-20 space-y-4">
              <h2 className="text-3xl md:text-5xl lg:text-6xl font-light tracking-tight mb-4">
                Cómo Funciona
              </h2>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto font-light">
                En solo 3 pasos estarás gestionando el aprendizaje de manera
                eficiente
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-12">
              <div className="flex flex-col items-center text-center space-y-6 group">
                <div className="relative mb-4">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-primary/80 text-primary-foreground flex items-center justify-center text-4xl font-medium shadow-xl">
                    1
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-12 h-12 rounded-xl bg-background border-2 border-primary/20 flex items-center justify-center shadow-lg">
                    <Settings className="w-6 h-6 text-primary" />
                  </div>
                </div>
                <div className="space-y-3">
                  <h3 className="text-2xl font-medium">Crea tu cuenta</h3>
                  <p className="text-muted-foreground leading-relaxed max-w-xs font-light">
                    Regístrate como estudiante o contacta con un administrador
                    para obtener acceso como profesor o administrador
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-center text-center space-y-6 group">
                <div className="relative mb-4">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-primary/80 text-primary-foreground flex items-center justify-center text-4xl font-medium shadow-xl">
                    2
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-12 h-12 rounded-xl bg-background border-2 border-primary/20 flex items-center justify-center shadow-lg">
                    <BookOpen className="w-6 h-6 text-primary" />
                  </div>
                </div>
                <div className="space-y-3">
                  <h3 className="text-2xl font-medium">
                    Organiza tu contenido
                  </h3>
                  <p className="text-muted-foreground leading-relaxed max-w-xs font-light">
                    Los profesores crean asignaturas y temas, suben materiales
                    educativos y asignan estudiantes a sus cursos
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-center text-center space-y-6 group">
                <div className="relative mb-4">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-primary/80 text-primary-foreground flex items-center justify-center text-4xl font-medium shadow-xl">
                    3
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-12 h-12 rounded-xl bg-background border-2 border-primary/20 flex items-center justify-center shadow-lg">
                    <GraduationCap className="w-6 h-6 text-primary" />
                  </div>
                </div>
                <div className="space-y-3">
                  <h3 className="text-2xl font-medium">Aprende y enseña</h3>
                  <p className="text-muted-foreground leading-relaxed max-w-xs font-light">
                    Los estudiantes acceden a sus asignaturas, utilizan el chat
                    con IA, descargan materiales y realizan exámenes
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Casos de Uso Section */}
        <section
          id="use-cases"
          className="py-24 md:py-32 px-4 bg-gradient-to-b from-muted/20 to-background"
        >
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-20 space-y-4">
              <h2 className="text-3xl md:text-5xl lg:text-6xl font-light tracking-tight mb-4">
                Perfecto para tu institución
              </h2>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto font-light">
                CloneTeacher se adapta a cualquier tipo de institución educativa
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-3">
              <Badge
                variant="secondary"
                className="px-6 py-4 text-base h-auto flex items-center gap-3 rounded-full border-0 bg-muted/50 hover:bg-muted transition-colors duration-300 shadow-sm"
              >
                <GraduationCap className="w-5 h-5" />
                Universidades
              </Badge>
              <Badge
                variant="secondary"
                className="px-6 py-4 text-base h-auto flex items-center gap-3 rounded-full border-0 bg-muted/50 hover:bg-muted transition-colors duration-300 shadow-sm"
              >
                <BookOpen className="w-5 h-5" />
                Escuelas
              </Badge>
              <Badge
                variant="secondary"
                className="px-6 py-4 text-base h-auto flex items-center gap-3 rounded-full border-0 bg-muted/50 hover:bg-muted transition-colors duration-300 shadow-sm"
              >
                <Award className="w-5 h-5" />
                Academias
              </Badge>
              <Badge
                variant="secondary"
                className="px-6 py-4 text-base h-auto flex items-center gap-3 rounded-full border-0 bg-muted/50 hover:bg-muted transition-colors duration-300 shadow-sm"
              >
                <Users className="w-5 h-5" />
                Centros de Formación
              </Badge>
              <Badge
                variant="secondary"
                className="px-6 py-4 text-base h-auto flex items-center gap-3 rounded-full border-0 bg-muted/50 hover:bg-muted transition-colors duration-300 shadow-sm"
              >
                <Sparkles className="w-5 h-5" />
                Profesores Particulares
              </Badge>
              <Badge
                variant="secondary"
                className="px-6 py-4 text-base h-auto flex items-center gap-3 rounded-full border-0 bg-muted/50 hover:bg-muted transition-colors duration-300 shadow-sm"
              >
                <Globe className="w-5 h-5" />
                Educación Online
              </Badge>
            </div>
          </div>
        </section>

        {/* Testimonios/Social Proof Section */}
        <section id="testimonials" className="py-24 md:py-32 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-20 space-y-4">
              <h2 className="text-3xl md:text-5xl lg:text-6xl font-light tracking-tight mb-4">
                Confiado por educadores
              </h2>
              <div className="mt-12 mb-16">
                <p className="text-6xl md:text-7xl font-light text-primary mb-3 tracking-tight">
                  5,000+
                </p>
                <p className="text-lg md:text-xl text-muted-foreground font-light">
                  estudiantes activos aprendiendo
                </p>
              </div>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="border-0 shadow-sm hover:shadow-md transition-all duration-300 bg-background/50 backdrop-blur-sm">
                <CardHeader>
                  <CardDescription className="text-base leading-relaxed">
                    "CloneTeacher transformó nuestra forma de enseñar. El chat
                    con IA ayuda a los estudiantes a resolver dudas
                    instantáneamente, y la gestión de materiales es mucho más
                    eficiente."
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="font-medium">Prof. María González</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Universidad Tecnológica
                  </p>
                </CardContent>
              </Card>
              <Card className="border-0 shadow-sm hover:shadow-md transition-all duration-300 bg-background/50 backdrop-blur-sm">
                <CardHeader>
                  <CardDescription className="text-base leading-relaxed">
                    "La plataforma es intuitiva y fácil de usar. Mis estudiantes
                    pueden acceder a todos los materiales desde un solo lugar y
                    el sistema de exámenes funciona perfectamente."
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="font-medium">Dr. Carlos Ruiz</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Instituto de Educación Superior
                  </p>
                </CardContent>
              </Card>
              <Card className="border-0 shadow-sm hover:shadow-md transition-all duration-300 bg-background/50 backdrop-blur-sm">
                <CardHeader>
                  <CardDescription className="text-base leading-relaxed">
                    "Como estudiante, el chat con IA me ayuda muchísimo. Puedo
                    hacer preguntas sobre los materiales en cualquier momento y
                    obtener respuestas claras. Es como tener un tutor disponible
                    24/7."
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="font-medium">Ana Martínez</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Estudiante de Ingeniería
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Final */}
        <section className="relative py-24 md:py-32 px-4 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/95 to-primary/90" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_50%)]" />
          <div className="max-w-4xl mx-auto text-center space-y-10 relative z-10">
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-light tracking-tight text-primary-foreground">
              ¿Listo para transformar la educación?
            </h2>
            <p className="text-lg md:text-xl text-primary-foreground/90 max-w-2xl mx-auto font-light">
              Únete a cientos de instituciones que ya confían en CloneTeacher
              para gestionar el aprendizaje
            </p>
            <div className="space-y-4">
              <Button
                asChild
                size="lg"
                variant="secondary"
                className="text-lg px-10 h-14 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300"
              >
                <Link href="/sign-up">Empezar gratis ahora</Link>
              </Button>
              <p className="text-sm text-primary-foreground/80 flex items-center justify-center gap-2 font-light">
                <CheckCircle2 className="w-4 h-4" />
                Sin tarjeta de crédito requerida
              </p>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-24 md:py-32 px-4 bg-gradient-to-b from-background to-muted/20">
          <div className="max-w-2xl mx-auto text-center space-y-6">
            <h2 className="text-3xl md:text-4xl font-light tracking-tight">
              ¿Tienes preguntas?
            </h2>
            <p className="text-lg text-muted-foreground font-light">
              Contáctanos y te responderemos lo antes posible
            </p>
            <div className="flex items-center justify-center gap-3">
              <Mail className="w-5 h-5 text-primary" />
              <a
                href="mailto:contacto@cloneteacher.com"
                className="text-lg font-medium text-foreground hover:text-primary transition-colors"
              >
                contacto@cloneteacher.com
              </a>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t bg-background py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-3 gap-12 mb-12">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Image
                    src="/logo.png"
                    alt="CloneTeacher"
                    width={32}
                    height={32}
                    className="w-8 h-8"
                  />
                  <h3 className="text-2xl font-medium">CloneTeacher</h3>
                </div>
                <p className="text-muted-foreground font-light leading-relaxed">
                  Tu plataforma educativa con IA. Gestiona el aprendizaje de
                  manera eficiente y moderna.
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-6">Legal</h4>
                <ul className="space-y-3">
                  <li>
                    <Link
                      href="/terms"
                      className="text-muted-foreground hover:text-foreground transition-colors font-light"
                    >
                      Términos y Condiciones
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/privacy"
                      className="text-muted-foreground hover:text-foreground transition-colors font-light"
                    >
                      Política de Privacidad
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-6">Cuenta</h4>
                <ul className="space-y-3">
                  <li>
                    <Link
                      href="/sign-in"
                      className="text-muted-foreground hover:text-foreground transition-colors font-light"
                    >
                      Iniciar Sesión
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/sign-up"
                      className="text-muted-foreground hover:text-foreground transition-colors font-light"
                    >
                      Registrarse
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
            <div className="border-t pt-8 text-center text-sm text-muted-foreground font-light">
              <p>
                © {new Date().getFullYear()} CloneTeacher. Todos los derechos
                reservados.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
