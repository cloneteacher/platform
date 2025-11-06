import { generateMetadata } from "@/lib/utils/metadata";
import type { Metadata } from "next";

export const metadata: Metadata = generateMetadata({
  title: "Términos y Condiciones - CloneTeacher",
  description:
    "Términos y condiciones de uso de CloneTeacher, plataforma educativa con IA. Conoce nuestras políticas de uso del servicio.",
  path: "/terms",
  keywords: [
    "términos y condiciones",
    "política de uso",
    "CloneTeacher",
    "plataforma educativa",
  ],
});

export default function TermsPage() {
  const lastUpdated = "2024-12-19";

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="prose prose-slate dark:prose-invert max-w-none">
          <h1 className="text-4xl font-bold mb-2">Términos y Condiciones</h1>
          <p className="text-muted-foreground mb-8">
            Última actualización: {lastUpdated}
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">
              1. Información General
            </h2>
            <p>
              Bienvenido a CloneTeacher ("nosotros", "nuestro", "la
              plataforma"), operado bajo el dominio{" "}
              <strong>cloneteacher.com</strong>. Estos Términos y Condiciones
              ("Términos") rigen su acceso y uso de nuestra plataforma educativa
              con capacidades de inteligencia artificial.
            </p>
            <p>
              Al acceder o utilizar nuestro servicio, usted acepta estar sujeto
              a estos Términos. Si no está de acuerdo con alguna parte de estos
              términos, no debe utilizar nuestro servicio.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">
              2. Descripción del Servicio
            </h2>
            <p>
              CloneTeacher es una plataforma educativa completa que ofrece un
              sistema de gestión de aprendizaje (LMS) con capacidades de
              inteligencia artificial. Nuestro servicio permite:
            </p>
            <ul>
              <li>
                <strong>Para Administradores:</strong> Gestión de profesores y
                estadísticas del sistema
              </li>
              <li>
                <strong>Para Profesores:</strong> Creación de asignaturas y
                temas, gestión de archivos, y asignación de estudiantes
              </li>
              <li>
                <strong>Para Estudiantes:</strong> Acceso a asignaturas
                asignadas, materiales educativos, chat con IA para asistencia en
                el estudio, y sistema de exámenes
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">
              3. Cuentas de Usuario
            </h2>
            <h3 className="text-xl font-semibold mb-3">3.1 Registro</h3>
            <p>
              Para utilizar nuestro servicio, debe crear una cuenta
              proporcionando información precisa y completa. Usted es
              responsable de mantener la confidencialidad de su cuenta y
              contraseña.
            </p>

            <h3 className="text-xl font-semibold mb-3">3.2 Roles de Usuario</h3>
            <p>
              Nuestra plataforma opera con tres tipos de roles: Administrador,
              Profesor y Estudiante. El acceso a ciertas funcionalidades está
              determinado por su rol asignado.
            </p>

            <h3 className="text-xl font-semibold mb-3">
              3.3 Responsabilidades del Usuario
            </h3>
            <p>Usted se compromete a:</p>
            <ul>
              <li>Proporcionar información veraz y actualizada</li>
              <li>Mantener la seguridad de su cuenta</li>
              <li>
                Notificarnos inmediatamente de cualquier uso no autorizado
              </li>
              <li>Utilizar el servicio de manera legal y ética</li>
              <li>No compartir su cuenta con terceros</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">4. Uso Aceptable</h2>
            <p>Está prohibido:</p>
            <ul>
              <li>Utilizar el servicio para fines ilegales o no autorizados</li>
              <li>Intentar acceder a áreas restringidas del sistema</li>
              <li>Interferir con el funcionamiento del servicio</li>
              <li>Subir contenido malicioso, virus o código dañino</li>
              <li>Violar derechos de propiedad intelectual de terceros</li>
              <li>Suplantar la identidad de otra persona</li>
              <li>
                Realizar ingeniería inversa o intentar extraer código fuente
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">
              5. Contenido del Usuario
            </h2>
            <h3 className="text-xl font-semibold mb-3">
              5.1 Propiedad del Contenido
            </h3>
            <p>
              Usted conserva todos los derechos sobre el contenido que sube a
              nuestra plataforma. Al subir contenido, nos otorga una licencia no
              exclusiva para almacenar, procesar y mostrar dicho contenido en el
              contexto de nuestro servicio.
            </p>

            <h3 className="text-xl font-semibold mb-3">
              5.2 Responsabilidad del Contenido
            </h3>
            <p>
              Usted es el único responsable del contenido que publica. Nos
              reservamos el derecho de eliminar cualquier contenido que
              consideremos inapropiado, ilegal o que viole estos Términos.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">
              6. Propiedad Intelectual
            </h2>
            <p>
              Todos los derechos de propiedad intelectual sobre la plataforma,
              incluyendo pero no limitado a software, diseño, logotipos, textos
              y gráficos, son propiedad de CloneTeacher o sus licenciantes.
              Estos Términos no le otorgan ningún derecho sobre nuestra
              propiedad intelectual.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">
              7. Limitación de Responsabilidad
            </h2>
            <p>
              En la máxima medida permitida por la ley, CloneTeacher no será
              responsable de:
            </p>
            <ul>
              <li>Daños indirectos, incidentales o consecuentes</li>
              <li>Pérdida de datos o información</li>
              <li>Interrupciones del servicio</li>
              <li>Errores en el contenido generado por IA</li>
              <li>
                Decisiones tomadas basándose en información proporcionada por la
                plataforma
              </li>
            </ul>
            <p>
              Nuestro servicio se proporciona "tal cual" sin garantías de ningún
              tipo, expresas o implícitas.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">8. Privacidad</h2>
            <p>
              Su uso de nuestro servicio también está sujeto a nuestra Política
              de Privacidad, que describe cómo recopilamos, usamos y protegemos
              su información personal. Por favor, revise nuestra{" "}
              <a href="/privacy" className="text-primary hover:underline">
                Política de Privacidad
              </a>{" "}
              para obtener más información.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">
              9. Modificaciones de los Términos
            </h2>
            <p>
              Nos reservamos el derecho de modificar estos Términos en cualquier
              momento. Las modificaciones entrarán en vigor inmediatamente
              después de su publicación en la plataforma. Su uso continuado del
              servicio después de cualquier modificación constituye su
              aceptación de los nuevos Términos.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">10. Terminación</h2>
            <p>
              Podemos suspender o terminar su acceso al servicio en cualquier
              momento, con o sin causa, con o sin previo aviso, por cualquier
              motivo, incluyendo pero no limitado a la violación de estos
              Términos.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">11. Ley Aplicable</h2>
            <p>
              Estos Términos se regirán e interpretarán de acuerdo con las leyes
              aplicables, sin tener en cuenta sus disposiciones sobre conflictos
              de leyes.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">12. Contacto</h2>
            <p>
              Si tiene preguntas sobre estos Términos y Condiciones, puede
              contactarnos a través de:
            </p>
            <ul>
              <li>
                <strong>Email:</strong> contacto@cloneteacher.com
              </li>
              <li>
                <strong>Sitio web:</strong>{" "}
                <a
                  href="https://cloneteacher.com"
                  className="text-primary hover:underline"
                >
                  cloneteacher.com
                </a>
              </li>
            </ul>
          </section>

          <div className="mt-12 pt-8 border-t border-border">
            <p className="text-sm text-muted-foreground">
              Al utilizar CloneTeacher, usted reconoce que ha leído, entendido y
              acepta estar sujeto a estos Términos y Condiciones.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
