// Shared legal text for the privacy policy — rendered both by the standalone
// /privacidad page (full page, for direct links/SEO/sharing) and by the
// footer's popup modal (see footer.tsx). Kept as one component so the two
// surfaces can never drift out of sync with each other.

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

// `heading` toggles between the two contexts this renders in: the full page
// wants its own big h1 + "LEGAL" kicker above this; the footer popup already
// has a modal title bar (see EventModal's own header pattern in
// events-calendar.tsx) and doesn't need a second, redundant title.
export default function PrivacyPolicyContent({ heading = true }: { heading?: boolean }) {
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
            Política de Privacidad
          </h1>
        </>
      )}
      <p style={{ fontFamily: BODY, fontSize: 14, color: "rgba(245,245,245,0.4)", margin: "0 0 2rem" }}>
        Última actualización: septiembre de 2026
      </p>

      <p style={{ fontFamily: BODY, fontSize: 15, lineHeight: 1.7, color: "rgba(245,245,245,0.75)" }}>
        POCCO CLUB se compromete a proteger la privacidad y los datos personales de sus clientes, asistentes,
        usuarios y visitantes. La presente Política de Privacidad explica qué datos personales podemos tratar, con
        qué finalidad, durante cuánto tiempo y cuáles son los derechos de las personas interesadas.
      </p>

      <Section number="1" title="Responsable del tratamiento">
        <p style={pStyle}>
          <strong style={{ color: "#f5f5f5" }}>Responsable del tratamiento:</strong> POCCOCLUB, S.L.
          <br />
          <strong style={{ color: "#f5f5f5" }}>NIF:</strong> B23996051
          <br />
          <strong style={{ color: "#f5f5f5" }}>Domicilio:</strong> Calle Guadassuar, 4, 46600 Alzira (Valencia), España
          <br />
          <strong style={{ color: "#f5f5f5" }}>Correo electrónico de contacto:</strong>{" "}
          <a href="mailto:poccotheclub@gmail.com" style={{ color: "#e21212" }}>
            poccotheclub@gmail.com
          </a>
          <br />
          <strong style={{ color: "#f5f5f5" }}>Sitio web:</strong> pocco.club
        </p>
        <p style={pStyle}>
          POCCOCLUB, S.L. será responsable del tratamiento de los datos personales tratados directamente en relación
          con la actividad de POCCO CLUB, sin perjuicio de aquellos tratamientos respecto de los cuales determinados
          proveedores puedan actuar como responsables independientes.
        </p>
      </Section>

      <Section number="2" title="Datos personales que podemos tratar">
        <p style={pStyle}>
          Dependiendo de la relación del usuario con POCCO CLUB, podrán tratarse las siguientes categorías de datos:
        </p>
        <ul style={listStyle}>
          <li>Datos identificativos, como nombre y apellidos.</li>
          <li>Datos de contacto, como teléfono, correo electrónico o usuario de redes sociales.</li>
          <li>Datos relacionados con reservas, listas de invitados, entradas, mesas VIP o asistencia a eventos.</li>
          <li>Datos relacionados con la edad cuando sea necesario comprobar el cumplimiento de las condiciones de acceso.</li>
          <li>Información facilitada a través de formularios, encuestas, promociones o programas de fidelización.</li>
          <li>Imágenes y vídeos obtenidos durante eventos.</li>
          <li>Imágenes obtenidas mediante sistemas de videovigilancia.</li>
          <li>Datos técnicos de navegación, cookies, dirección IP, dispositivo e información similar cuando corresponda.</li>
          <li>
            Información derivada de las comunicaciones mantenidas con POCCO CLUB a través de correo electrónico,
            WhatsApp, redes sociales u otros canales.
          </li>
        </ul>
        <p style={pStyle}>
          POCCO CLUB aplicará el principio de minimización y tratará únicamente aquellos datos adecuados y
          necesarios para cada finalidad.
        </p>
      </Section>

      <Section number="3" title="Finalidades del tratamiento">
        <p style={pStyle}>Los datos personales podrán ser tratados para las siguientes finalidades:</p>

        <p style={pStyle}>
          <strong style={{ color: "#f5f5f5" }}>Reservas, entradas y listas de invitados.</strong> Gestionar
          reservas, mesas VIP, entradas, listas de invitados, acreditaciones y demás servicios solicitados por los
          usuarios.
        </p>
        <p style={pStyle}>
          <strong style={{ color: "#f5f5f5" }}>Atención al cliente.</strong> Responder consultas, solicitudes,
          incidencias, reclamaciones o comunicaciones recibidas por cualquier canal habilitado por POCCO CLUB.
        </p>
        <p style={pStyle}>
          <strong style={{ color: "#f5f5f5" }}>Gestión de eventos y control de acceso.</strong> Gestionar la
          asistencia a los eventos, verificar entradas, controlar el acceso y, cuando resulte necesario, comprobar
          el cumplimiento de los requisitos de edad establecidos para cada evento.
        </p>
        <p style={pStyle}>
          <strong style={{ color: "#f5f5f5" }}>Seguridad y videovigilancia.</strong> Preservar la seguridad de las
          personas, bienes e instalaciones mediante sistemas de videovigilancia instalados en el establecimiento.
        </p>
        <p style={pStyle}>
          <strong style={{ color: "#f5f5f5" }}>Comunicaciones comerciales.</strong> Enviar información sobre
          próximos eventos, fiestas, promociones, novedades, descuentos, apertura de reservas o servicios de POCCO
          CLUB mediante correo electrónico, SMS, WhatsApp u otros medios electrónicos cuando exista una base
          jurídica que lo permita. Los usuarios podrán solicitar en cualquier momento dejar de recibir dichas
          comunicaciones.
        </p>
        <p style={pStyle}>
          <strong style={{ color: "#f5f5f5" }}>Promociones y fidelización.</strong> Gestionar sorteos, promociones,
          concursos, programas de fidelización u otras acciones comerciales en las que el usuario decida participar.
        </p>
        <p style={pStyle}>
          <strong style={{ color: "#f5f5f5" }}>Encuestas y valoración del servicio.</strong> Solicitar opiniones
          sobre eventos o servicios con el objetivo de conocer la satisfacción de los asistentes y mejorar la
          actividad del club.
        </p>
        <p style={pStyle}>
          <strong style={{ color: "#f5f5f5" }}>Fotografías y vídeos de eventos.</strong> Realizar contenido
          audiovisual relacionado con los eventos celebrados en POCCO CLUB y, cuando exista una base jurídica
          válida, utilizar dicho contenido en la página web, redes sociales, cartelería, recapitulaciones de eventos
          u otros canales de comunicación del club.
        </p>
        <p style={pStyle}>
          <strong style={{ color: "#f5f5f5" }}>Análisis web.</strong> Analizar el funcionamiento del sitio web y la
          interacción de sus usuarios mediante cookies y tecnologías similares, cuando estas hayan sido aceptadas
          por el usuario.
        </p>
      </Section>

      <Section number="4" title="Bases jurídicas del tratamiento">
        <p style={pStyle}>Los tratamientos realizados por POCCO CLUB podrán basarse, según cada caso, en:</p>
        <ul style={listStyle}>
          <li>
            Ejecución de un contrato o aplicación de medidas precontractuales, especialmente para gestionar
            entradas, reservas, listas, mesas VIP u otros servicios solicitados por el usuario.
          </li>
          <li>Cumplimiento de obligaciones legales aplicables a la actividad del establecimiento.</li>
          <li>
            Interés legítimo, cuando proceda y tras valorar que no prevalezcan los derechos y libertades de los
            interesados, especialmente en determinadas actuaciones relacionadas con la seguridad, prevención del
            fraude, defensa frente a reclamaciones o mejora de los servicios.
          </li>
          <li>
            Consentimiento del interesado, cuando sea necesario para comunicaciones comerciales, determinados
            tratamientos relacionados con imágenes, promociones, encuestas, cookies no necesarias u otras
            finalidades que requieran autorización previa.
          </li>
        </ul>
        <p style={pStyle}>
          Cuando una comunicación comercial electrónica se dirija a un cliente con el que exista una relación
          contractual previa, podrá realizarse en los casos permitidos por la legislación aplicable para
          promocionar servicios propios similares a los contratados anteriormente, ofreciendo siempre un mecanismo
          sencillo y gratuito de oposición o baja.
        </p>
        <p style={pStyle}>
          La retirada del consentimiento no afectará a la licitud de los tratamientos realizados con anterioridad.
        </p>
      </Section>

      <Section number="5" title="Comunicaciones comerciales">
        <p style={pStyle}>
          POCCO CLUB podrá enviar comunicaciones relacionadas con fiestas, eventos, reservas, promociones y
          novedades. Cuando sea necesario obtener consentimiento, la aceptación de comunicaciones comerciales será
          independiente de la aceptación de esta Política de Privacidad.
        </p>
        <p style={pStyle}>
          El usuario podrá darse de baja en cualquier momento utilizando el mecanismo habilitado en cada
          comunicación, escribiendo a{" "}
          <a href="mailto:poccotheclub@gmail.com" style={{ color: "#e21212" }}>
            poccotheclub@gmail.com
          </a>{" "}
          o a través de WhatsApp.
        </p>
        <p style={pStyle}>
          POCCO CLUB podrá conservar los datos mínimos necesarios de las personas que hayan solicitado la baja para
          garantizar que su decisión sea respetada en futuras campañas.
        </p>
      </Section>

      <Section number="6" title="Fotografías y vídeos en eventos">
        <p style={pStyle}>
          Durante los eventos celebrados en POCCO CLUB podrán realizarse fotografías o grabaciones de vídeo con
          finalidad informativa, documental o promocional. POCCO CLUB procurará informar de la existencia de
          captación audiovisual mediante cartelería, información previa al evento u otros mecanismos razonables.
        </p>
        <p style={pStyle}>
          El mero acceso al establecimiento no se considerará automáticamente consentimiento para cualquier
          utilización promocional individualizada de la imagen de una persona. Cuando la utilización de una imagen
          identificable requiera consentimiento conforme a la legislación aplicable, POCCO CLUB recabará la
          autorización correspondiente.
        </p>
        <p style={pStyle}>
          En las imágenes generales del ambiente o del evento, POCCO CLUB aplicará criterios de proporcionalidad y
          evitará usos que puedan resultar invasivos, perjudiciales o incompatibles con los derechos de las personas
          afectadas.
        </p>
        <p style={pStyle}>
          Cualquier persona que considere que aparece en una fotografía o vídeo publicado por POCCO CLUB y desee
          solicitar su retirada podrá escribir a{" "}
          <a href="mailto:poccotheclub@gmail.com" style={{ color: "#e21212" }}>
            poccotheclub@gmail.com
          </a>
          . La solicitud deberá permitir identificar razonablemente el contenido y, siempre que sea posible, indicar
          el evento, fecha o publicación correspondiente.
        </p>
      </Section>

      <Section number="7" title="Menores de edad">
        <p style={pStyle}>
          Algunos eventos organizados por POCCO CLUB pueden admitir la asistencia de menores de edad conforme a la
          normativa y condiciones específicas aplicables a cada evento. En estos casos, POCCO CLUB aplicará medidas
          reforzadas de protección de datos y únicamente solicitará la información necesaria para gestionar la
          actividad y comprobar los requisitos de acceso.
        </p>
        <p style={pStyle}>
          Cuando el tratamiento de datos de un menor se base en el consentimiento, se aplicarán los requisitos
          establecidos por la legislación vigente en función de la edad y del tratamiento concreto. En particular,
          POCCO CLUB extremará las precauciones respecto de la utilización promocional de imágenes en las que
          aparezcan menores claramente identificables y solicitará las autorizaciones que resulten legalmente
          necesarias.
        </p>
      </Section>

      <Section number="8" title="Videovigilancia">
        <p style={pStyle}>
          Las instalaciones de POCCO CLUB disponen de sistemas de videovigilancia destinados exclusivamente a
          garantizar la seguridad de las personas, bienes e instalaciones y, en su caso, investigar incidentes de
          seguridad. Las zonas videovigiladas estarán debidamente señalizadas.
        </p>
        <p style={pStyle}>
          Las cámaras se instalarán procurando captar únicamente las zonas necesarias para la finalidad de seguridad
          y respetando el principio de minimización. Las imágenes obtenidas mediante los sistemas de videovigilancia
          serán conservadas, con carácter general, durante un plazo máximo de un mes desde su captación.
        </p>
        <p style={pStyle}>
          Cuando las imágenes permitan acreditar la comisión de actos que puedan afectar a la integridad de
          personas, bienes o instalaciones, podrán conservarse durante el tiempo necesario para ser puestas a
          disposición de las autoridades competentes conforme a la legislación aplicable.
        </p>
        <p style={pStyle}>
          El acceso a las grabaciones estará limitado al personal o proveedores expresamente autorizados. Las
          imágenes podrán ser comunicadas a las Fuerzas y Cuerpos de Seguridad, juzgados, tribunales u otras
          autoridades cuando exista obligación legal o resulte necesario para investigar un incidente.
        </p>
      </Section>

      <Section number="9" title="Destinatarios y proveedores">
        <p style={pStyle}>
          POCCO CLUB podrá utilizar proveedores externos para prestar determinados servicios. Entre ellos podrán
          encontrarse:
        </p>
        <ul style={listStyle}>
          <li>
            <strong style={{ color: "#f5f5f5" }}>Fourvenues</strong>, para venta, gestión y validación de entradas.
          </li>
          <li>
            <strong style={{ color: "#f5f5f5" }}>Hostinger</strong>, como proveedor tecnológico para alojamiento y
            mantenimiento de la página web.
          </li>
          <li>
            <strong style={{ color: "#f5f5f5" }}>Prosegur</strong>, cuando interviene en la seguridad del
            establecimiento o tiene acceso a sistemas relacionados con dicha actividad.
          </li>
          <li>Proveedores de servicios audiovisuales, fotografía, marketing, comunicación o gestión de redes sociales, cuando sea necesario para desarrollar dichas funciones.</li>
          <li>Administraciones públicas, Fuerzas y Cuerpos de Seguridad, juzgados y tribunales, cuando exista una obligación legal.</li>
        </ul>
        <p style={pStyle}>
          La condición jurídica de cada proveedor dependerá del servicio prestado. Cuando actúe por cuenta de POCCO
          CLUB tendrá la condición de encargado del tratamiento y deberá estar sujeto a las obligaciones
          correspondientes en materia de protección de datos. Cuando un proveedor determine por sí mismo
          determinadas finalidades y medios del tratamiento, podrá actuar como responsable independiente conforme a
          su propia política de privacidad.
        </p>
        <p style={pStyle}>POCCO CLUB no vende los datos personales de sus usuarios.</p>
      </Section>

      <Section number="10" title="Transferencias internacionales">
        <p style={pStyle}>
          Determinados proveedores tecnológicos, plataformas digitales o redes sociales pueden tratar información
          fuera del Espacio Económico Europeo. Cuando se produzcan transferencias internacionales de datos
          personales, POCCO CLUB procurará que se realicen de conformidad con el capítulo V del RGPD y mediante los
          mecanismos y garantías legalmente previstos.
        </p>
        <p style={pStyle}>
          El usuario puede solicitar más información sobre las garantías aplicables escribiendo a{" "}
          <a href="mailto:poccotheclub@gmail.com" style={{ color: "#e21212" }}>
            poccotheclub@gmail.com
          </a>
          .
        </p>
      </Section>

      <Section number="11" title="Conservación de los datos">
        <p style={pStyle}>
          Los datos serán conservados únicamente durante el periodo necesario para cumplir con la finalidad para la
          que fueron recogidos. Con carácter general:
        </p>
        <ul style={listStyle}>
          <li>
            Los datos relacionados con reservas, compras, servicios y relaciones contractuales se conservarán
            mientras resulte necesario para la prestación del servicio y posteriormente durante los plazos legales
            aplicables.
          </li>
          <li>
            Los datos utilizados para comunicaciones comerciales basadas en consentimiento se conservarán hasta que
            el interesado retire dicho consentimiento.
          </li>
          <li>Los datos mínimos necesarios para gestionar una solicitud de baja podrán conservarse con la finalidad de evitar nuevos envíos.</li>
          <li>Las grabaciones de videovigilancia se conservarán durante un máximo de un mes, salvo que deban conservarse por un incidente.</li>
          <li>Los datos relativos a cookies se conservarán durante los periodos indicados en la Política de Cookies.</li>
          <li>
            Las fotografías y vídeos se conservarán mientras resulten necesarios para las finalidades para las que
            fueron obtenidos o hasta que proceda su retirada conforme a la legislación aplicable.
          </li>
        </ul>
        <p style={pStyle}>
          Posteriormente, los datos podrán permanecer bloqueados durante los plazos de prescripción de posibles
          responsabilidades legales.
        </p>
      </Section>

      <Section number="12" title="Cookies y tecnologías similares">
        <p style={pStyle}>
          El sitio web pocco.club puede utilizar cookies propias y de terceros. Las cookies estrictamente
          necesarias podrán utilizarse para permitir el correcto funcionamiento del sitio web.
        </p>
        <p style={pStyle}>
          Las cookies analíticas, publicitarias, de personalización o equivalentes que no resulten necesarias
          únicamente se instalarán cuando exista una base jurídica que lo permita y, cuando sea exigible, después de
          obtener el consentimiento del usuario.
        </p>
        <p style={pStyle}>
          El usuario deberá poder aceptar o rechazar las cookies no necesarias mediante el sistema de gestión
          habilitado en la web. Asimismo, podrá modificar posteriormente sus preferencias.
        </p>
        <p style={pStyle}>
          Puede obtener información detallada sobre las cookies utilizadas, proveedores, finalidad y duración en la
          Política de Cookies de POCCO CLUB.
        </p>
      </Section>

      <Section number="13" title="Decisiones automatizadas y perfilado">
        <p style={pStyle}>
          POCCO CLUB no adopta decisiones exclusivamente automatizadas que produzcan efectos jurídicos sobre los
          usuarios o les afecten significativamente de modo similar.
        </p>
        <p style={pStyle}>
          Cuando se utilicen herramientas de análisis o segmentación comercial, estas podrán utilizar información
          sobre interacciones o preferencias para adaptar determinadas comunicaciones, sin que ello implique la
          adopción de decisiones con efectos jurídicos significativos.
        </p>
        <p style={pStyle}>Cuando dichos tratamientos requieran consentimiento, únicamente se realizarán después de obtenerlo.</p>
      </Section>

      <Section number="14" title="Derechos de los usuarios">
        <p style={pStyle}>
          Los interesados podrán ejercer los derechos reconocidos por la normativa de protección de datos,
          incluyendo:
        </p>
        <ul style={listStyle}>
          <li>Derecho de acceso.</li>
          <li>Derecho de rectificación.</li>
          <li>Derecho de supresión.</li>
          <li>Derecho de oposición.</li>
          <li>Derecho a la limitación del tratamiento.</li>
          <li>Derecho a la portabilidad.</li>
          <li>Derecho a retirar el consentimiento en cualquier momento cuando el tratamiento se base en él.</li>
        </ul>
        <p style={pStyle}>Para ejercer estos derechos puede enviarse una solicitud a:</p>
        <p style={pStyle}>
          POCCOCLUB, S.L.
          <br />
          Calle Guadassuar, 4
          <br />
          46600 Alzira (Valencia)
          <br />
          <a href="mailto:poccotheclub@gmail.com" style={{ color: "#e21212" }}>
            poccotheclub@gmail.com
          </a>
        </p>
        <p style={pStyle}>La solicitud deberá indicar de forma suficiente el derecho que se desea ejercer.</p>
        <p style={pStyle}>
          Cuando existan dudas razonables sobre la identidad del solicitante, POCCO CLUB podrá solicitar información
          adicional estrictamente necesaria para verificarla.
        </p>
        <p style={pStyle}>
          El interesado también tiene derecho a presentar una reclamación ante la Agencia Española de Protección de
          Datos (AEPD) a través de{" "}
          <a href="https://www.aepd.es" target="_blank" rel="noopener noreferrer" style={{ color: "#e21212" }}>
            www.aepd.es
          </a>{" "}
          si considera que el tratamiento de sus datos personales vulnera la normativa aplicable.
        </p>
      </Section>

      <Section number="15" title="Seguridad de los datos">
        <p style={pStyle}>
          POCCO CLUB adoptará medidas técnicas y organizativas apropiadas al nivel de riesgo para proteger los datos
          personales frente a pérdida, destrucción, modificación, divulgación o acceso no autorizado.
        </p>
        <p style={pStyle}>
          El acceso a los datos quedará limitado a las personas y proveedores que necesiten utilizarlos para
          desarrollar sus funciones.
        </p>
      </Section>

      <Section number="16" title="Datos facilitados por terceros">
        <p style={pStyle}>
          Cuando una persona facilite datos personales de otra persona, por ejemplo para incorporarla a una reserva,
          mesa o lista de invitados, deberá asegurarse de que dispone de legitimación para facilitar dichos datos y
          de haber informado al afectado cuando corresponda.
        </p>
        <p style={pStyle}>
          POCCO CLUB únicamente utilizará esos datos para gestionar la finalidad para la que hayan sido facilitados,
          salvo que exista otra base jurídica válida.
        </p>
      </Section>

      <Section number="17" title="Cambios en la Política de Privacidad">
        <p style={pStyle}>
          POCCO CLUB podrá modificar la presente Política de Privacidad para adaptarla a cambios legislativos,
          criterios de las autoridades de control, modificaciones tecnológicas o cambios en sus servicios y
          procedimientos.
        </p>
        <p style={pStyle}>Cuando las modificaciones sean relevantes, se adoptarán medidas razonables para informar a los usuarios.</p>
        <p style={pStyle}>
          La versión vigente estará disponible permanentemente en pocco.club, indicando la fecha de su última
          actualización.
        </p>
        <p style={{ ...pStyle, color: "rgba(245,245,245,0.4)", fontSize: 13 }}>
          Última actualización: septiembre de 2026
        </p>
      </Section>
    </>
  );
}
