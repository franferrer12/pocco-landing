// Shared legal text for the Aviso Legal (Legal Notice / Terms of Use) —
// same pattern as PrivacyPolicyContent/CookiesPolicyContent: rendered both
// by the standalone /aviso-legal page and by the footer's popup modal (see
// footer.tsx), so the two surfaces can never drift out of sync.
//
// NIF filled in as B23996051 — the source text had it marked
// "[PENDIENTE DE CONFIRMAR]", and this is the same value already confirmed
// live for the Política de Privacidad and Política de Cookies, kept
// consistent across all three documents (a company has exactly one tax
// ID). The source text's "Datos registrales" field (Registro Mercantil,
// tomo, libro, folio, hoja e inscripción) was left out entirely rather than
// publishing it as a visible "[PENDIENTE DE COMPLETAR]" placeholder —
// confirmed live to omit it for now rather than ship an unfilled field.

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

export default function LegalNoticeContent({ heading = true }: { heading?: boolean }) {
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
            Aviso Legal
          </h1>
          <p style={{ fontFamily: BODY, fontSize: 16, color: "rgba(245,245,245,0.6)", margin: "0 0 0.5rem" }}>
            Condiciones de Uso
          </p>
        </>
      )}
      <p style={{ fontFamily: BODY, fontSize: 14, color: "rgba(245,245,245,0.4)", margin: "0 0 2rem" }}>
        Última actualización: septiembre de 2026
      </p>

      <Section number="1" title="Identificación del titular">
        <p style={pStyle}>
          En cumplimiento de lo dispuesto en la Ley 34/2002, de 11 de julio, de Servicios de la Sociedad de la
          Información y del Comercio Electrónico (LSSI-CE), se informa de los siguientes datos relativos al titular
          del sitio web:
        </p>
        <p style={pStyle}>
          <strong style={{ color: "#f5f5f5" }}>Titular:</strong> POCCOCLUB, S.L.
          <br />
          <strong style={{ color: "#f5f5f5" }}>Nombre comercial:</strong> POCCO CLUB
          <br />
          <strong style={{ color: "#f5f5f5" }}>NIF:</strong> B23996051
          <br />
          <strong style={{ color: "#f5f5f5" }}>Domicilio:</strong> Calle Guadassuar, 4, 46600 Alzira (Valencia), España
          <br />
          <strong style={{ color: "#f5f5f5" }}>Correo electrónico:</strong>{" "}
          <a href="mailto:poccotheclub@gmail.com" style={{ color: "#e21212" }}>
            poccotheclub@gmail.com
          </a>
          <br />
          <strong style={{ color: "#f5f5f5" }}>Sitio web:</strong> pocco.club
        </p>
        <p style={pStyle}>
          POCCOCLUB, S.L. es responsable de la gestión del sitio web pocco.club, sin perjuicio de los servicios
          prestados por terceros a través de plataformas externas.
        </p>
      </Section>

      <Section number="2" title="Objeto">
        <p style={pStyle}>
          El presente Aviso Legal regula el acceso, navegación y utilización del sitio web pocco.club, así como las
          responsabilidades derivadas de la utilización de sus contenidos y funcionalidades.
        </p>
        <p style={pStyle}>A través de la web, POCCO CLUB podrá ofrecer, entre otros contenidos:</p>
        <ul style={listStyle}>
          <li>Información sobre eventos y sesiones.</li>
          <li>Información sobre POCCO CLUB y sus instalaciones.</li>
          <li>Acceso a la compra de entradas.</li>
          <li>Reservas de mesas o zonas VIP.</li>
          <li>Listas de invitados.</li>
          <li>Formularios de contacto.</li>
          <li>Promociones.</li>
          <li>Información sobre servicios y actividades.</li>
          <li>Acceso a redes sociales y plataformas externas.</li>
          <li>Contenidos audiovisuales relacionados con POCCO CLUB.</li>
        </ul>
        <p style={pStyle}>
          Determinadas funcionalidades pueden estar sujetas a condiciones particulares que serán comunicadas al
          usuario cuando corresponda.
        </p>
      </Section>

      <Section number="3" title="Acceso y utilización del sitio web">
        <p style={pStyle}>
          El acceso a pocco.club tiene, con carácter general, carácter gratuito, sin perjuicio del coste de conexión
          correspondiente al proveedor de acceso a Internet del usuario y de aquellos servicios, entradas, reservas
          o productos que tengan un precio específico.
        </p>
        <p style={pStyle}>El usuario se compromete a utilizar el sitio web de forma responsable y conforme a:</p>
        <ul style={listStyle}>
          <li>La legislación vigente.</li>
          <li>El presente Aviso Legal.</li>
          <li>La buena fe.</li>
          <li>El orden público.</li>
          <li>Los derechos e intereses de POCCO CLUB y de terceros.</li>
        </ul>
        <p style={pStyle}>
          Queda prohibido utilizar la web para realizar actividades ilícitas o que puedan perjudicar, impedir o
          dificultar su funcionamiento normal.
        </p>
      </Section>

      <Section number="4" title="Conductas prohibidas">
        <p style={pStyle}>En particular, queda prohibido:</p>
        <ul style={listStyle}>
          <li>Utilizar el sitio web con fines fraudulentos o ilícitos.</li>
          <li>Acceder o intentar acceder de forma no autorizada a sistemas, servidores, cuentas o bases de datos.</li>
          <li>Introducir virus, malware, scripts o cualquier tecnología destinada a alterar o dañar los sistemas.</li>
          <li>Intentar eludir las medidas técnicas o de seguridad implantadas.</li>
          <li>
            Utilizar sistemas automatizados de extracción de información de manera que pueda perjudicar al sitio web
            o vulnerar derechos de terceros.
          </li>
          <li>Suplantar la identidad de otra persona.</li>
          <li>Utilizar formularios o sistemas de contacto para enviar comunicaciones abusivas, fraudulentas o no solicitadas.</li>
          <li>Reproducir o explotar contenidos protegidos sin disponer de autorización.</li>
        </ul>
        <p style={pStyle}>
          POCCO CLUB podrá restringir el acceso a determinadas funcionalidades cuando detecte usos fraudulentos,
          abusivos o contrarios a estas condiciones, sin perjuicio de las acciones legales que puedan corresponder.
        </p>
      </Section>

      <Section number="5" title="Disponibilidad y funcionamiento">
        <p style={pStyle}>
          POCCO CLUB procura mantener el sitio web disponible y actualizado. No obstante, no puede garantizar una
          disponibilidad permanente e ininterrumpida. La web podrá sufrir interrupciones como consecuencia de:
        </p>
        <ul style={listStyle}>
          <li>Operaciones de mantenimiento.</li>
          <li>Actualizaciones.</li>
          <li>Incidencias técnicas.</li>
          <li>Fallos de proveedores externos.</li>
          <li>Problemas de conexión.</li>
          <li>Situaciones de fuerza mayor.</li>
          <li>Ataques o incidentes de ciberseguridad.</li>
        </ul>
        <p style={pStyle}>
          POCCO CLUB podrá modificar, actualizar, suspender o retirar temporalmente determinadas funcionalidades
          cuando resulte necesario.
        </p>
        <p style={pStyle}>
          Cuando legalmente corresponda informar previamente al usuario de una modificación que afecte a un servicio
          contratado, se realizará de acuerdo con la normativa aplicable.
        </p>
      </Section>

      <Section number="6" title="Exactitud de la información">
        <p style={pStyle}>
          POCCO CLUB procura que la información publicada en la página web sea correcta y esté actualizada. No
          obstante, pueden producirse errores tipográficos, técnicos o de actualización.
        </p>
        <p style={pStyle}>
          La información relativa a fechas, horarios, artistas, DJs, precios, condiciones de acceso u otras
          características de un evento podrá ser modificada cuando existan causas justificadas, respetando en todo
          caso los derechos que correspondan legalmente a los consumidores y usuarios.
        </p>
        <p style={pStyle}>
          Cuando exista una contradicción entre información meramente promocional y las condiciones particulares
          definitivas de una entrada, reserva o servicio, se estará a la información contractual facilitada al
          usuario, sin perjuicio de los derechos reconocidos legalmente al consumidor.
        </p>
      </Section>

      <Section number="7" title="Propiedad intelectual e industrial">
        <p style={pStyle}>Los contenidos disponibles en pocco.club, incluyendo, entre otros:</p>
        <ul style={listStyle}>
          <li>Marcas.</li>
          <li>Logotipos.</li>
          <li>Nombres comerciales.</li>
          <li>Diseños.</li>
          <li>Fotografías.</li>
          <li>Vídeos.</li>
          <li>Textos.</li>
          <li>Material gráfico.</li>
          <li>Elementos audiovisuales.</li>
          <li>Animaciones.</li>
          <li>Código.</li>
          <li>Estructura y diseño de la página web.</li>
        </ul>
        <p style={pStyle}>están protegidos por la normativa de propiedad intelectual e industrial cuando corresponda.</p>
        <p style={pStyle}>
          Estos elementos podrán ser propiedad de POCCOCLUB, S.L. o utilizarse legítimamente mediante autorización,
          licencia o cualquier otro título válido de terceros.
        </p>
        <p style={pStyle}>El acceso al sitio web no concede al usuario ningún derecho de propiedad sobre dichos contenidos.</p>
        <p style={pStyle}>
          Salvo autorización expresa o supuesto permitido legalmente, queda prohibida su reproducción,
          transformación, distribución, comunicación pública, explotación comercial o utilización de cualquier otra
          forma.
        </p>
        <p style={pStyle}>
          Las marcas, nombres comerciales y signos distintivos de terceros que puedan aparecer en la web pertenecen
          a sus respectivos titulares.
        </p>
      </Section>

      <Section number="8" title="Enlaces y servicios de terceros">
        <p style={pStyle}>La página web puede contener enlaces, integraciones o contenidos pertenecientes a terceros. Entre ellos pueden encontrarse plataformas de:</p>
        <ul style={listStyle}>
          <li>Venta de entradas.</li>
          <li>Reservas.</li>
          <li>Redes sociales.</li>
          <li>Mapas.</li>
          <li>Vídeo.</li>
          <li>Música.</li>
          <li>Gestión de eventos.</li>
          <li>Otros servicios tecnológicos.</li>
        </ul>
        <p style={pStyle}>
          El acceso a dichos servicios puede quedar sujeto a las condiciones y políticas establecidas por sus
          respectivos titulares.
        </p>
        <p style={pStyle}>
          POCCO CLUB no controla de forma general el contenido, funcionamiento o disponibilidad de páginas web
          externas y no asume responsabilidad por actuaciones exclusivamente imputables a dichos terceros.
        </p>
        <p style={pStyle}>
          La existencia de un enlace no implica necesariamente una relación comercial, patrocinio, aprobación o
          asociación entre POCCO CLUB y el titular del sitio enlazado.
        </p>
      </Section>

      <Section number="9" title="Entradas, reservas y servicios">
        <p style={pStyle}>
          POCCO CLUB podrá permitir la contratación o reserva de determinados servicios directamente o mediante
          plataformas externas especializadas.
        </p>
        <p style={pStyle}>
          Cuando la compra se efectúe a través de una plataforma externa, como una plataforma de ticketing, el
          usuario deberá consultar también las condiciones específicas mostradas durante el proceso de compra.
        </p>
        <p style={pStyle}>
          Antes de formalizar una compra deberán mostrarse de forma clara las características esenciales del
          servicio y, cuando resulte aplicable:
        </p>
        <ul style={listStyle}>
          <li>Evento.</li>
          <li>Fecha.</li>
          <li>Horario.</li>
          <li>Precio.</li>
          <li>Gastos o costes adicionales.</li>
          <li>Condiciones de acceso.</li>
          <li>Condiciones de la entrada o reserva.</li>
          <li>Métodos de pago disponibles.</li>
          <li>Condiciones de cancelación o devolución.</li>
          <li>Identidad del empresario con el que se formaliza la contratación.</li>
        </ul>
        <p style={pStyle}>
          La intervención de una plataforma tecnológica externa no eliminará los derechos que legalmente
          correspondan al consumidor frente al organizador, vendedor o prestador que resulte responsable en cada
          caso.
        </p>
      </Section>

      <Section number="10" title="Derecho de desistimiento en entradas de eventos">
        <p style={pStyle}>
          La adquisición de una entrada para un espectáculo, evento, sesión o actividad de ocio prevista para una
          fecha o periodo de ejecución específicos puede encontrarse dentro de las excepciones legales al derecho
          general de desistimiento.
        </p>
        <p style={pStyle}>
          Por tanto, cuando resulte aplicable dicha excepción, la compra de una entrada no podrá cancelarse
          simplemente mediante el ejercicio del derecho de desistimiento de catorce días.
        </p>
        <p style={pStyle}>
          Esto se entiende sin perjuicio de los derechos que correspondan al usuario cuando se produzca, entre otros
          supuestos:
        </p>
        <ul style={listStyle}>
          <li>Cancelación del evento.</li>
          <li>Modificaciones que legalmente generen derecho a devolución.</li>
          <li>Incumplimiento del servicio contratado.</li>
          <li>Cualquier otro supuesto previsto por la legislación aplicable.</li>
        </ul>
        <p style={pStyle}>
          Las condiciones particulares de cada evento podrán establecer información adicional sobre cambios,
          devoluciones y cancelaciones, siempre respetando los derechos legalmente reconocidos a los consumidores.
        </p>
      </Section>

      <Section number="11" title="Acceso a los eventos">
        <p style={pStyle}>
          La adquisición de una entrada no exime del cumplimiento de las normas de acceso y funcionamiento del
          establecimiento.
        </p>
        <p style={pStyle}>El acceso podrá estar sujeto, según el evento, a condiciones relacionadas con:</p>
        <ul style={listStyle}>
          <li>Edad mínima.</li>
          <li>Presentación de documentación válida.</li>
          <li>Validez de la entrada.</li>
          <li>Horarios de acceso.</li>
          <li>Aforo.</li>
          <li>Normativa aplicable a establecimientos públicos y actividades recreativas.</li>
          <li>Condiciones particulares comunicadas para el evento.</li>
        </ul>
        <p style={pStyle}>POCCO CLUB aplicará las normas de admisión y acceso conforme a la legislación vigente.</p>
        <p style={pStyle}>
          La existencia de una entrada no permitirá el acceso cuando el usuario no cumpla requisitos legalmente
          exigibles, como la edad requerida para el evento o la acreditación válida de identidad cuando resulte
          necesaria.
        </p>
      </Section>

      <Section number="12" title="Precios y pagos">
        <p style={pStyle}>
          Los precios correspondientes a entradas, reservas y demás servicios se mostrarán antes de confirmar la
          contratación. Cuando resulte aplicable, se indicarán los impuestos y costes adicionales correspondientes.
        </p>
        <p style={pStyle}>Las plataformas externas de pago o ticketing podrán intervenir técnicamente en la transacción.</p>
        <p style={pStyle}>
          POCCO CLUB no tendrá acceso a los datos completos de medios de pago cuando estos sean tratados
          directamente por una pasarela de pago o proveedor externo.
        </p>
        <p style={pStyle}>
          Las condiciones específicas de cada método de pago serán las establecidas por el proveedor correspondiente,
          sin perjuicio de las obligaciones que correspondan a POCCO CLUB como organizador, vendedor o prestador del
          servicio cuando proceda.
        </p>
      </Section>

      <Section number="13" title="Protección de datos">
        <p style={pStyle}>
          El tratamiento de datos personales realizado por POCCO CLUB se encuentra regulado en su Política de
          Privacidad.
        </p>
        <p style={pStyle}>
          La Política de Privacidad tiene carácter informativo y no se considera aceptada simplemente por navegar
          por el sitio web.
        </p>
        <p style={pStyle}>
          Cuando un tratamiento concreto requiera el consentimiento del interesado, dicho consentimiento se
          solicitará expresamente y de forma diferenciada cuando corresponda.
        </p>
      </Section>

      <Section number="14" title="Cookies">
        <p style={pStyle}>El sitio web utiliza cookies y tecnologías similares conforme a lo establecido en la Política de Cookies.</p>
        <p style={pStyle}>
          Las cookies que requieran consentimiento no se instalarán basándose exclusivamente en el hecho de que el
          usuario acceda, permanezca o continúe navegando por la web.
        </p>
        <p style={pStyle}>
          El usuario podrá gestionar sus preferencias mediante el sistema de configuración de cookies habilitado en
          pocco.club.
        </p>
      </Section>

      <Section number="15" title="Comunicaciones comerciales">
        <p style={pStyle}>
          POCCO CLUB podrá enviar comunicaciones comerciales relacionadas con sus eventos, promociones, actividades
          y servicios cuando exista una base jurídica que lo permita.
        </p>
        <p style={pStyle}>Cuando sea necesario el consentimiento del usuario, este deberá obtenerse específicamente.</p>
        <p style={pStyle}>
          Asimismo, podrán enviarse determinadas comunicaciones a clientes anteriores cuando se cumplan los
          requisitos establecidos por la legislación aplicable.
        </p>
        <p style={pStyle}>
          En todo caso, el destinatario podrá solicitar dejar de recibir comunicaciones comerciales mediante el
          procedimiento de baja habilitado o contactando con{" "}
          <a href="mailto:poccotheclub@gmail.com" style={{ color: "#e21212" }}>
            poccotheclub@gmail.com
          </a>
          .
        </p>
      </Section>

      <Section number="16" title="Responsabilidad">
        <p style={pStyle}>
          POCCO CLUB no será responsable de daños derivados exclusivamente de circunstancias que se encuentren fuera
          de su control razonable, como:
        </p>
        <ul style={listStyle}>
          <li>Fallos de telecomunicaciones.</li>
          <li>Interrupciones de proveedores externos.</li>
          <li>Ataques informáticos inevitables pese a la adopción de medidas razonables de seguridad.</li>
          <li>Problemas provocados por dispositivos o software del usuario.</li>
          <li>Uso ilícito o contrario a estas condiciones realizado por terceros.</li>
        </ul>
        <p style={pStyle}>
          Esta cláusula no limita ni excluye aquellas responsabilidades que legalmente correspondan a POCCO CLUB y
          que no puedan excluirse frente a consumidores y usuarios.
        </p>
      </Section>

      <Section number="17" title="Modificación del Aviso Legal">
        <p style={pStyle}>POCCO CLUB podrá actualizar el presente Aviso Legal para adaptarlo a:</p>
        <ul style={listStyle}>
          <li>Cambios legislativos.</li>
          <li>Modificaciones de la página web.</li>
          <li>Nuevas funcionalidades.</li>
          <li>Cambios en los servicios ofrecidos.</li>
          <li>Cambios en los proveedores utilizados.</li>
        </ul>
        <p style={pStyle}>
          La versión vigente será la publicada en pocco.club e indicará su fecha de última actualización.
        </p>
        <p style={pStyle}>
          Las modificaciones no afectarán retroactivamente a los derechos adquiridos por los consumidores cuando
          legalmente no resulte posible hacerlo.
        </p>
      </Section>

      <Section number="18" title="Legislación aplicable y resolución de controversias">
        <p style={pStyle}>
          El presente Aviso Legal se rige por la legislación española, sin perjuicio de cualquier normativa
          imperativa que resulte aplicable a los consumidores.
        </p>
        <p style={pStyle}>En caso de conflicto, serán competentes los juzgados y tribunales determinados por la normativa aplicable.</p>
        <p style={pStyle}>
          Cuando el usuario tenga la condición de consumidor o usuario, se respetarán en todo caso las normas de
          competencia territorial y protección de consumidores que resulten legalmente aplicables.
        </p>
      </Section>

      <Section number="19" title="Contacto">
        <p style={pStyle}>
          Para cualquier consulta relacionada con el sitio web o el presente Aviso Legal puede contactar con:
        </p>
        <p style={pStyle}>
          POCCOCLUB, S.L.
          <br />
          Calle Guadassuar, 4
          <br />
          46600 Alzira (Valencia), España
          <br />
          <strong style={{ color: "#f5f5f5" }}>Correo electrónico:</strong>{" "}
          <a href="mailto:poccotheclub@gmail.com" style={{ color: "#e21212" }}>
            poccotheclub@gmail.com
          </a>
        </p>
        <p style={{ ...pStyle, color: "rgba(245,245,245,0.4)", fontSize: 13 }}>
          Última actualización: septiembre de 2026
        </p>
      </Section>
    </>
  );
}
