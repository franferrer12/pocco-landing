// Shared legal text for the Política de Cookies — same pattern as
// PrivacyPolicyContent/LegalNoticeContent: rendered both by /cookies and by
// the footer's popup modal (see footer.tsx).
//
// Originally trimmed down from the user's draft (which described Google
// Analytics, Meta Pixel, TikTok Pixel and Nevent as active — none of which
// existed yet at the time) to only what was real then: necessary/technical
// cookies plus Fourvenues' checkout widget. Google Analytics (GA4) and
// Microsoft Clarity were reintroduced when the site migrated from WordPress
// to Next.js (same GA4 property, 475752389/G-REG9BSZ0G1, and same Clarity
// project, vgg76zsg27, the WordPress site already used — see
// cookie-consent.tsx) — this text was updated to match, together with
// actually shipping the consent mechanism this policy had promised
// ("cuando se instalen herramientas de análisis... se habilitará un
// mecanismo de consentimiento previo a su instalación", section 6): GA4 and
// Clarity now only load after the visitor accepts via that banner, never
// unconditionally on page view. Meta Pixel, TikTok Pixel and Nevent are
// still not installed — update this again if/when that changes.

const DISPLAY = "'Inter', 'Helvetica Neue', 'Arial Black', sans-serif";
const BODY = "'Inter', -apple-system, BlinkMacSystemFont, sans-serif";

function Section({ number, title, children }: { number: string; title: string; children: React.ReactNode }) {
  return (
    <section style={{ marginTop: "3rem" }}>
      <h2
        style={{
          fontFamily: DISPLAY,
          fontSize: "clamp(18px, 2.4vw, 24px)",
          fontWeight: 800,
          color: "#f5f5f5",
          margin: "0 0 1rem",
          letterSpacing: "-0.01em",
        }}
      >
        <span style={{ color: "#e21212" }}>{number}.</span> {title}
      </h2>
      <div
        style={{
          fontFamily: BODY,
          fontSize: 15,
          lineHeight: 1.7,
          color: "rgba(245,245,245,0.75)",
        }}
      >
        {children}
      </div>
    </section>
  );
}

const pStyle: React.CSSProperties = { margin: "0 0 1rem" };
const listStyle: React.CSSProperties = { margin: "0 0 1rem", paddingLeft: "1.3rem" };

const tableCellStyle: React.CSSProperties = {
  padding: "10px 12px",
  borderBottom: "1px solid rgba(255,255,255,0.08)",
  textAlign: "left",
  verticalAlign: "top",
};

const tableHeadStyle: React.CSSProperties = {
  ...tableCellStyle,
  color: "#f5f5f5",
  fontWeight: 700,
  fontSize: 13,
  letterSpacing: "0.02em",
};

export default function CookiesPolicyContent({ heading = true }: { heading?: boolean }) {
  return (
    <>
      {heading && (
        <>
          <p
            style={{
              fontFamily: DISPLAY,
              fontSize: "clamp(12px, 1.4vw, 14px)",
              fontWeight: 700,
              letterSpacing: "0.12em",
              color: "#e21212",
              margin: "0 0 0.6rem",
            }}
          >
            LEGAL
          </p>
          <h1
            style={{
              fontFamily: DISPLAY,
              fontSize: "clamp(32px, 5vw, 48px)",
              fontWeight: 900,
              color: "#f5f5f5",
              margin: "0 0 0.5rem",
              lineHeight: 1.05,
              letterSpacing: "-0.02em",
            }}
          >
            Política de Cookies
          </h1>
        </>
      )}
      <p style={{ fontFamily: BODY, fontSize: 14, color: "rgba(245,245,245,0.4)", margin: "0 0 2rem" }}>
        Última actualización: septiembre de 2026
      </p>

      <p style={{ fontFamily: BODY, fontSize: 15, lineHeight: 1.7, color: "rgba(245,245,245,0.75)" }}>
        Esta Política de Cookies explica qué son las cookies y tecnologías similares, para qué se utilizan en{" "}
        <strong style={{ color: "#f5f5f5" }}>pocco.club</strong>, quién puede utilizarlas y cómo puede el usuario
        gestionar sus preferencias.
      </p>

      <Section number="1" title="Qué son las cookies">
        <p style={pStyle}>
          Las cookies son pequeños archivos o dispositivos de almacenamiento que pueden descargarse en el
          dispositivo del usuario cuando visita una página web.
        </p>
        <p style={pStyle}>
          Permiten, entre otras funciones, garantizar el funcionamiento técnico del sitio, recordar determinadas
          preferencias u obtener información estadística sobre la utilización de la web.
        </p>
        <p style={pStyle}>
          También pueden utilizarse tecnologías similares, como almacenamiento local u otros identificadores.
          Cuando en esta política se utiliza el término «cookies», se incluyen también estas tecnologías cuando
          resulte aplicable.
        </p>
      </Section>

      <Section number="2" title="Quién utiliza las cookies">
        <p style={pStyle}>El responsable del sitio web pocco.club es:</p>
        <p style={pStyle}>
          <strong style={{ color: "#f5f5f5" }}>POCCOCLUB, S.L.</strong>
          <br />
          <strong style={{ color: "#f5f5f5" }}>NIF:</strong> B23996051
          <br />
          <strong style={{ color: "#f5f5f5" }}>Domicilio:</strong> Calle Guadassuar, 4, 46600 Alzira (Valencia), España
          <br />
          <strong style={{ color: "#f5f5f5" }}>Correo electrónico:</strong>{" "}
          <a href="mailto:poccotheclub@gmail.com" style={{ color: "#e21212" }}>
            poccotheclub@gmail.com
          </a>
        </p>
        <p style={pStyle}>
          En la web pueden utilizarse cookies propias de POCCO CLUB y cookies pertenecientes a proveedores externos
          cuando el sitio integre sus servicios (ver apartado 4).
        </p>
      </Section>

      <Section number="3" title="Tipos de cookies utilizadas">
        <p style={pStyle}>
          <strong style={{ color: "#f5f5f5" }}>Cookies técnicas o necesarias.</strong> Son aquellas necesarias para
          permitir el funcionamiento básico de la página web y la prestación de los servicios solicitados por el
          usuario, por ejemplo para mantener la seguridad del sitio, gestionar técnicamente la navegación o permitir
          procesos necesarios para reservas o compras. Estas cookies no requieren consentimiento cuando resultan
          estrictamente necesarias para prestar el servicio solicitado por el usuario.
        </p>
        <p style={pStyle}>
          <strong style={{ color: "#f5f5f5" }}>Cookies de terceros integrados en el sitio.</strong> Cuando el
          usuario interactúa con un servicio de un tercero embebido en la web — por ejemplo el checkout de compra
          de entradas — ese proveedor puede instalar sus propias cookies bajo su propia política. Ver el apartado 4
          para más detalle.
        </p>
        <p style={pStyle}>
          <strong style={{ color: "#f5f5f5" }}>Cookies de análisis.</strong> POCCO CLUB utiliza cookies de análisis
          (Google Analytics y Microsoft Clarity) para conocer cómo los usuarios interactúan con pocco.club. Estas
          cookies no son estrictamente necesarias y solo se instalan si el usuario da su consentimiento a través del
          panel de cookies que aparece al visitar el sitio (ver apartado 6).
        </p>
      </Section>

      <Section number="4" title="Cookies de terceros">
        <p style={pStyle}>
          Dependiendo de la configuración existente en cada momento, POCCO CLUB podrá utilizar servicios
          tecnológicos proporcionados por terceros. Actualmente:
        </p>
        <p style={pStyle}>
          <strong style={{ color: "#f5f5f5" }}>Fourvenues.</strong> La compra de entradas y la gestión de reservas
          se realiza a través de un widget de Fourvenues embebido directamente en la web. Al utilizar esta
          funcionalidad, Fourvenues puede instalar sus propias cookies conforme a su propia política de privacidad y
          cookies, necesarias para el funcionamiento del proceso de compra.
        </p>
        <p style={pStyle}>
          <strong style={{ color: "#f5f5f5" }}>Google Analytics (Google LLC).</strong> Herramienta de analítica web
          que permite conocer el número de visitantes, las páginas más visitadas y el comportamiento general de
          navegación en pocco.club, de forma agregada. Solo se activa si el usuario acepta las cookies de análisis.
          Más información en la{" "}
          <a
            href="https://policies.google.com/privacy"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "#e21212" }}
          >
            política de privacidad de Google
          </a>
          .
        </p>
        <p style={pStyle}>
          <strong style={{ color: "#f5f5f5" }}>Microsoft Clarity (Microsoft Corporation).</strong> Herramienta de
          analítica que registra de forma anonimizada cómo los usuarios navegan por la web (mapas de calor,
          grabaciones de sesión) para ayudar a mejorar la experiencia de uso. Solo se activa si el usuario acepta las
          cookies de análisis. Más información en la{" "}
          <a
            href="https://privacy.microsoft.com/es-es/privacystatement"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "#e21212" }}
          >
            política de privacidad de Microsoft
          </a>
          .
        </p>
        <p style={pStyle}>
          La utilización concreta de proveedores adicionales dependerá de las herramientas que se encuentren activas
          en cada momento, y esta política se actualizará para reflejarlo.
        </p>
      </Section>

      <Section number="5" title="Relación de cookies utilizadas">
        <p style={pStyle}>La relación de cookies y tecnologías activas en pocco.club es, actualmente:</p>
        <div style={{ overflowX: "auto", margin: "0 0 1rem" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr>
                <th style={tableHeadStyle}>Cookie / tecnología</th>
                <th style={tableHeadStyle}>Proveedor</th>
                <th style={tableHeadStyle}>Finalidad</th>
                <th style={tableHeadStyle}>Tipo</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={tableCellStyle}>Cookies necesarias</td>
                <td style={tableCellStyle}>POCCO CLUB / proveedor de hosting</td>
                <td style={tableCellStyle}>Funcionamiento técnico del sitio</td>
                <td style={tableCellStyle}>Necesaria</td>
              </tr>
              <tr>
                <td style={tableCellStyle}>Cookies de checkout</td>
                <td style={tableCellStyle}>Fourvenues</td>
                <td style={tableCellStyle}>Compra de entradas y gestión de reservas</td>
                <td style={tableCellStyle}>Necesaria (funcional)</td>
              </tr>
              <tr>
                <td style={tableCellStyle}>_ga, _ga_*</td>
                <td style={tableCellStyle}>Google Analytics</td>
                <td style={tableCellStyle}>Estadísticas de uso y navegación</td>
                <td style={tableCellStyle}>Análisis (requiere consentimiento)</td>
              </tr>
              <tr>
                <td style={tableCellStyle}>_clck, _clsk</td>
                <td style={tableCellStyle}>Microsoft Clarity</td>
                <td style={tableCellStyle}>Mapas de calor y grabación de sesiones</td>
                <td style={tableCellStyle}>Análisis (requiere consentimiento)</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p style={pStyle}>Esta relación se actualizará cuando se incorporen nuevas herramientas o proveedores.</p>
      </Section>

      <Section number="6" title="Consentimiento">
        <p style={pStyle}>
          Las cookies técnicas o estrictamente necesarias, y las instaladas por Fourvenues al utilizar su checkout
          para comprar una entrada o gestionar una reserva, se activan sin necesidad de consentimiento adicional,
          al ser imprescindibles para prestar el servicio solicitado por el usuario en ese momento.
        </p>
        <p style={pStyle}>
          Las cookies de análisis (Google Analytics y Microsoft Clarity) no son necesarias y solo se instalan si el
          usuario pulsa «Aceptar» en el panel de cookies que aparece al visitar pocco.club por primera vez. Si el
          usuario pulsa «Rechazar», estas cookies no se instalan y la navegación continúa con normalidad.
        </p>
      </Section>

      <Section number="7" title="Configuración de las preferencias">
        <p style={pStyle}>
          El usuario puede aceptar o rechazar las cookies de análisis desde el panel que aparece al visitar
          pocco.club. Su elección se recuerda en el navegador utilizado, de modo que el panel no vuelve a mostrarse
          en visitas posteriores desde el mismo dispositivo y navegador.
        </p>
        <p style={pStyle}>
          Para cambiar una elección ya realizada, el usuario puede borrar los datos de navegación almacenados por
          este sitio (almacenamiento local) desde la configuración de su navegador, lo que hará que el panel de
          cookies vuelva a mostrarse en la siguiente visita. También puede eliminar o bloquear las cookies existentes
          en su dispositivo desde la configuración de su propio navegador (ver apartado 10).
        </p>
      </Section>

      <Section number="8" title="Duración de las cookies">
        <p style={pStyle}>
          Cada cookie tiene un periodo de conservación determinado en función de su finalidad y de la configuración
          establecida por POCCO CLUB o por el proveedor correspondiente (actualmente, Fourvenues para el proceso de
          compra).
        </p>
        <p style={pStyle}>
          POCCO CLUB procurará utilizar cookies persistentes únicamente durante el periodo necesario para cumplir su
          finalidad. La duración concreta de cada cookie de terceros está sujeta a la política del proveedor
          correspondiente.
        </p>
      </Section>

      <Section number="9" title="Transferencias internacionales">
        <p style={pStyle}>
          Algunos proveedores tecnológicos utilizados por POCCO CLUB pueden estar establecidos fuera del Espacio
          Económico Europeo o tratar información desde otros países.
        </p>
        <p style={pStyle}>
          Cuando se produzcan transferencias internacionales de datos, estas deberán realizarse de conformidad con
          el Reglamento General de Protección de Datos y mediante alguno de los mecanismos legalmente previstos.
        </p>
        <p style={pStyle}>
          Cuando las transferencias sean realizadas directamente por proveedores externos, puede consultarse
          información adicional en las correspondientes políticas de privacidad de dichos proveedores.
        </p>
      </Section>

      <Section number="10" title="Configuración del navegador">
        <p style={pStyle}>
          El usuario puede eliminar o bloquear cookies desde la configuración de su navegador. Los principales
          navegadores permiten gestionar estas opciones, entre ellos:
        </p>
        <ul style={listStyle}>
          <li>Google Chrome.</li>
          <li>Safari.</li>
          <li>Mozilla Firefox.</li>
          <li>Microsoft Edge.</li>
        </ul>
        <p style={pStyle}>
          La eliminación o bloqueo de determinadas cookies técnicas puede provocar que algunas funcionalidades de la
          web, como la compra de entradas, no estén disponibles o no funcionen correctamente.
        </p>
      </Section>

      <Section number="11" title="Datos personales">
        <p style={pStyle}>
          Algunas cookies pueden implicar el tratamiento de datos personales, como identificadores online,
          información del dispositivo, dirección IP, comportamiento de navegación o interacciones realizadas en la
          página web.
        </p>
        <p style={pStyle}>
          Para obtener información sobre el responsable del tratamiento, bases jurídicas, destinatarios, derechos
          del usuario y demás información relativa al tratamiento de datos personales puede consultarse la Política
          de Privacidad de POCCO CLUB.
        </p>
      </Section>

      <Section number="12" title="Modificaciones de esta política">
        <p style={pStyle}>POCCO CLUB podrá actualizar esta Política de Cookies cuando:</p>
        <ul style={listStyle}>
          <li>Se incorporen nuevas tecnologías o proveedores.</li>
          <li>Cambien las finalidades de las cookies utilizadas.</li>
          <li>Se modifique la configuración del sitio web.</li>
          <li>Se produzcan cambios normativos o en los criterios de las autoridades competentes.</li>
        </ul>
        <p style={pStyle}>
          La versión vigente estará disponible permanentemente en pocco.club con indicación de la fecha de la
          última actualización.
        </p>
        <p style={{ ...pStyle, color: "rgba(245,245,245,0.4)", fontSize: 13 }}>
          Última actualización: septiembre de 2026
        </p>
      </Section>
    </>
  );
}
