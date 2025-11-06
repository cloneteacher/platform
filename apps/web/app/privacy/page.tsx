import { generateMetadata } from "@/lib/utils/metadata";
import type { Metadata } from "next";

export const metadata: Metadata = generateMetadata({
  title: "Política de Privacidad - CloneTeacher",
  description:
    "Política de privacidad de CloneTeacher. Conoce cómo recopilamos, usamos y protegemos tu información personal conforme al RGPD.",
  path: "/privacy",
  keywords: ["política de privacidad", "protección de datos", "RGPD", "privacidad", "CloneTeacher"],
});

export default function PrivacyPage() {
  const lastUpdated = "2024-12-19";

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="prose prose-slate dark:prose-invert max-w-none">
          <h1 className="text-4xl font-bold mb-2">Política de Privacidad</h1>
          <p className="text-muted-foreground mb-8">
            Última actualización: {lastUpdated}
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">1. Introducción</h2>
            <p>
              En CloneTeacher, operado bajo el dominio <strong>cloneteacher.com</strong>, nos comprometemos a proteger su
              privacidad y sus datos personales. Esta Política de Privacidad explica cómo recopilamos, usamos,
              almacenamos y protegemos su información personal cuando utiliza nuestra plataforma educativa.
            </p>
            <p>
              Al utilizar nuestro servicio, usted acepta las prácticas descritas en esta política. Si no está de
              acuerdo con esta política, por favor no utilice nuestro servicio.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">2. Información que Recopilamos</h2>
            <h3 className="text-xl font-semibold mb-3">2.1 Información de Cuenta</h3>
            <p>Recopilamos la siguiente información cuando crea una cuenta:</p>
            <ul>
              <li>Nombre y apellidos</li>
              <li>Dirección de correo electrónico</li>
              <li>Rol asignado (Administrador, Profesor o Estudiante)</li>
              <li>Información de autenticación proporcionada por Clerk</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3">2.2 Información de Uso</h3>
            <p>Recopilamos información sobre cómo utiliza nuestro servicio:</p>
            <ul>
              <li>Actividad en la plataforma (asignaturas, temas, archivos)</li>
              <li>Interacciones con el sistema de chat con IA</li>
              <li>Resultados de exámenes y evaluaciones</li>
              <li>Registros de acceso y actividad</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3">2.3 Información Técnica</h3>
            <p>Recopilamos automáticamente cierta información técnica:</p>
            <ul>
              <li>Dirección IP</li>
              <li>Tipo de navegador y versión</li>
              <li>Sistema operativo</li>
              <li>Información del dispositivo</li>
              <li>Cookies y tecnologías similares</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3">2.4 Contenido Subido</h3>
            <p>
              Los archivos y contenido que sube a la plataforma (documentos, imágenes, etc.) se almacenan en nuestros
              servidores para proporcionar el servicio educativo.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">3. Cómo Utilizamos su Información</h2>
            <p>Utilizamos su información personal para:</p>
            <ul>
              <li>
                <strong>Proporcionar el servicio:</strong> Gestionar su cuenta, asignaturas, materiales y evaluaciones
              </li>
              <li>
                <strong>Autenticación y seguridad:</strong> Verificar su identidad y proteger su cuenta
              </li>
              <li>
                <strong>Mejorar el servicio:</strong> Analizar el uso para mejorar nuestras funcionalidades
              </li>
              <li>
                <strong>Comunicación:</strong> Enviarle notificaciones importantes sobre el servicio
              </li>
              <li>
                <strong>Cumplimiento legal:</strong> Cumplir con obligaciones legales y resolver disputas
              </li>
              <li>
                <strong>Asistencia con IA:</strong> Procesar sus consultas y proporcionar respuestas contextualizadas
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">4. Compartir Información con Terceros</h2>
            <h3 className="text-xl font-semibold mb-3">4.1 Proveedores de Servicios</h3>
            <p>Compartimos información con los siguientes proveedores de servicios:</p>
            <ul>
              <li>
                <strong>Clerk:</strong> Para autenticación y gestión de usuarios. Su política de privacidad está
                disponible en{" "}
                <a
                  href="https://clerk.com/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  clerk.com/privacy
                </a>
              </li>
              <li>
                <strong>Convex:</strong> Para almacenamiento de datos y procesamiento backend. Su política de
                privacidad está disponible en{" "}
                <a
                  href="https://www.convex.dev/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  convex.dev/privacy
                </a>
              </li>
            </ul>

            <h3 className="text-xl font-semibold mb-3">4.2 No Vendemos Datos</h3>
            <p>
              No vendemos, alquilamos ni comercializamos su información personal a terceros con fines comerciales.
            </p>

            <h3 className="text-xl font-semibold mb-3">4.3 Requerimientos Legales</h3>
            <p>
              Podemos divulgar su información si es requerido por ley, orden judicial o proceso legal, o para proteger
              nuestros derechos, propiedad o seguridad.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">5. Cookies y Tecnologías Similares</h2>
            <p>
              Utilizamos cookies y tecnologías similares para mejorar su experiencia, analizar el uso del servicio y
              personalizar el contenido. Las cookies son pequeños archivos de texto que se almacenan en su dispositivo.
            </p>
            <p>Tipos de cookies que utilizamos:</p>
            <ul>
              <li>
                <strong>Cookies esenciales:</strong> Necesarias para el funcionamiento básico del servicio
              </li>
              <li>
                <strong>Cookies de autenticación:</strong> Para mantener su sesión activa
              </li>
              <li>
                <strong>Cookies de preferencias:</strong> Para recordar sus configuraciones
              </li>
            </ul>
            <p>
              Puede controlar las cookies a través de la configuración de su navegador, pero esto puede afectar la
              funcionalidad del servicio.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">6. Seguridad de los Datos</h2>
            <p>
              Implementamos medidas de seguridad técnicas y organizativas apropiadas para proteger su información
              personal contra acceso no autorizado, alteración, divulgación o destrucción:
            </p>
            <ul>
              <li>Cifrado de datos en tránsito (HTTPS/TLS)</li>
              <li>Autenticación segura mediante Clerk</li>
              <li>Almacenamiento seguro en Convex</li>
              <li>Acceso restringido a datos personales</li>
              <li>Monitoreo regular de seguridad</li>
            </ul>
            <p>
              Sin embargo, ningún método de transmisión por Internet o almacenamiento electrónico es 100% seguro. No
              podemos garantizar la seguridad absoluta de sus datos.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">7. Sus Derechos (Conforme al RGPD)</h2>
            <p>
              Si reside en el Espacio Económico Europeo (EEE) o en otras jurisdicciones con leyes de protección de
              datos similares, tiene los siguientes derechos:
            </p>
            <ul>
              <li>
                <strong>Derecho de acceso:</strong> Puede solicitar una copia de sus datos personales
              </li>
              <li>
                <strong>Derecho de rectificación:</strong> Puede corregir información inexacta o incompleta
              </li>
              <li>
                <strong>Derecho de supresión:</strong> Puede solicitar la eliminación de sus datos personales
              </li>
              <li>
                <strong>Derecho de oposición:</strong> Puede oponerse al procesamiento de sus datos
              </li>
              <li>
                <strong>Derecho de portabilidad:</strong> Puede solicitar la transferencia de sus datos
              </li>
              <li>
                <strong>Derecho de limitación:</strong> Puede solicitar la limitación del procesamiento
              </li>
            </ul>
            <p>
              Para ejercer estos derechos, puede contactarnos en{" "}
              <a href="mailto:contacto@cloneteacher.com" className="text-primary hover:underline">
                contacto@cloneteacher.com
              </a>
              .
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">8. Retención de Datos</h2>
            <p>
              Conservamos su información personal durante el tiempo necesario para proporcionar el servicio y cumplir
              con nuestras obligaciones legales. Los criterios para determinar el período de retención incluyen:
            </p>
            <ul>
              <li>La duración de su cuenta activa</li>
              <li>Obligaciones legales y reglamentarias</li>
              <li>Resolución de disputas y aplicación de acuerdos</li>
            </ul>
            <p>
              Cuando elimine su cuenta, eliminaremos o anonimizaremos su información personal, excepto cuando la ley
              requiera que la conservemos.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">9. Transferencias Internacionales</h2>
            <p>
              Su información puede ser transferida y procesada en países fuera de su país de residencia. Estos países
              pueden tener leyes de protección de datos diferentes. Al utilizar nuestro servicio, usted consiente estas
              transferencias.
            </p>
            <p>
              Nos aseguramos de que las transferencias internacionales cumplan con las leyes aplicables de protección de
              datos.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">10. Privacidad de Menores</h2>
            <p>
              Nuestro servicio está dirigido a usuarios mayores de 13 años. No recopilamos intencionalmente información
              personal de menores de 13 años sin el consentimiento de los padres. Si descubrimos que hemos recopilado
              información de un menor sin consentimiento, tomaremos medidas para eliminar esa información.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">11. Cambios a esta Política</h2>
            <p>
              Podemos actualizar esta Política de Privacidad ocasionalmente. Le notificaremos sobre cambios
              significativos publicando la nueva política en esta página y actualizando la fecha de "Última
              actualización".
            </p>
            <p>
              Le recomendamos que revise esta política periódicamente para mantenerse informado sobre cómo protegemos
              su información.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">12. Contacto</h2>
            <p>
              Si tiene preguntas, inquietudes o solicitudes relacionadas con esta Política de Privacidad o el
              procesamiento de sus datos personales, puede contactarnos:
            </p>
            <ul>
              <li>
                <strong>Email:</strong>{" "}
                <a href="mailto:contacto@cloneteacher.com" className="text-primary hover:underline">
                  contacto@cloneteacher.com
                </a>
              </li>
              <li>
                <strong>Sitio web:</strong>{" "}
                <a href="https://cloneteacher.com" className="text-primary hover:underline">
                  cloneteacher.com
                </a>
              </li>
            </ul>
            <p>
              También tiene derecho a presentar una queja ante la autoridad de protección de datos de su jurisdicción
              si considera que el procesamiento de sus datos personales viola las leyes aplicables.
            </p>
          </section>

          <div className="mt-12 pt-8 border-t border-border">
            <p className="text-sm text-muted-foreground">
              Esta Política de Privacidad forma parte de nuestros{" "}
              <a href="/terms" className="text-primary hover:underline">
                Términos y Condiciones
              </a>
              . Al utilizar CloneTeacher, usted acepta esta Política de Privacidad.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

