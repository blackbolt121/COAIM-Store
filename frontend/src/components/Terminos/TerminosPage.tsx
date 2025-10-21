import TerminosSection from "./TerminosSection.tsx";


interface Paragraph {
    id: number;
    title: string;
    content: string;
}

const TerminosPage = () => {

    const contenidoTerminos: Paragraph[] = [
        {
            id: 0,
            title: 'TÉRMINOS Y CONDICIONES DE USO DE SUFERRE DEL BAJÍO',
            content: `**Fecha de última actualización:** 26 de julio de 2025.

Al ingresar y utilizar el sitio web www.mercadourrea.com, propiedad de Suferre del Bajío, el Usuario acepta en forma expresa y plena estos Términos y Condiciones, así como las políticas y avisos contenidos en el sitio. El uso del sitio implica la aceptación de las presentes condiciones, en conformidad con las leyes vigentes aplicables.

El Usuario reconoce que estos Términos y Condiciones constituyen un acuerdo vinculante entre él y Suferre del Bajío, y que cualquier modificación futura será publicada en este mismo apartado.`
        },
        {
            id: 1,
            title: '1. Condiciones de Uso del Sitio Web',
            content: `Para utilizar el sitio web, el Usuario debe contar con al menos 18 años o actuar bajo la supervisión de un tutor legal. Queda prohibido el uso del sitio para fines ilícitos, fraudulentos o que violen derechos de terceros.

Se concede una licencia no exclusiva, intransferible y revocable para acceder y utilizar la plataforma de acuerdo con estos Términos. Queda prohibido copiar, modificar, distribuir, vender, divulgar o usar el contenido del sitio con fines comerciales sin autorización expresa.

El Usuario será responsable de mantener la confidencialidad de sus datos de acceso. Cualquier actividad realizada con su cuenta será de su exclusiva responsabilidad.

La plataforma puede requerir registro o suscripción para acceder a ciertos servicios. La información proporcionada por el Usuario debe ser veraz y actualizada.

Suferre del Bajío podrá bloquear o cancelar cuentas que violen estas condiciones o que tengan un comportamiento fraudulento o abusivo.`
        },
        {
            id: 2,
            title: '2. Compra y Procesamiento de Productos',
            content: `Las compras se realizan mediante el sistema en línea del sitio. El Usuario podrá seleccionar productos, realizar pagos y coordinar envíos, siempre dentro del territorio de México.

Los precios de los productos incluyen impuestos aplicables, pero los gastos de envío serán calculados y mostrados antes de confirmar la compra.

Los productos están sujetos a disponibilidad en inventario. En caso de agotarse, se informará al Usuario y podrá cancelarse o reprogramarse la venta.

La confirmación de compra llegará por correo electrónico. La entrega será realizada por transportistas autorizados, en un plazo estimado. El Usuario acepta que podrá recibir los productos en la dirección proporcionada, en un horario acordado y en las condiciones del servicio de envío.

El Usuario tiene **5 días naturales desde la recepción** para presentar reclamaciones relacionadas con daños o errores en el envío, acompañadas de **fotos** y **ticket de compra**. De no hacerlo en este plazo, no podrá reclamar.`
        },
        {
            id: 3,
            title: '3. Garantías, Devoluciones y Reclamos',
            content: `La garantía de los productos será aquella ofrecida por el fabricante, y se detallará en la página del producto.

Para hacer efectiva cualquier reclamación o devolución por defectos o vicios ocultos, el Usuario debe solicitarlo dentro de los **5 días** posteriores a la recepción. La reclamación deberá presentarse con **fotos** del producto y **ticket de compra**.

Las devoluciones por productos defectuosos o entregados en mal estado deberán realizarse en las condiciones originales, con empaques y etiquetado intacto, y mediante la misma vía de envío acordada.

Los reembolsos se realizarán siguiendo el método original de pago, en un plazo no mayor a 15 días hábiles, previa revisión y aceptación del estado del producto devuelto.`
        },
        {
            id: 4,
            title: '4. Propiedad Intelectual',
            content: `Todo el contenido del sitio, incluyendo textos, imágenes, logotipos, marcas y software, es propiedad de Suferre del Bajío o de sus respectivos titulares, y está protegido por leyes nacionales e internacionales de propiedad intelectual.

Se prohíbe la reproducción, distribución, modificación o uso comercial sin autorización expresa.`
        },
        {
            id: 5,
            title: '5. Responsabilidades del Usuario',
            content: `El Usuario se obliga a usar el sitio y los servicios de forma responsable, sin infringir derechos de terceros, ni realizar actividades ilícitas. Queda prohibido:
- Intentar acceder a datos o sistemas sin autorización.
- Transmitir virus, malware o archivos dañinos.
- Violentar la seguridad del sitio o de terceros.
- Realizar spam, acoso u ofensas.
Cualquier violación puede dar lugar a acciones legales y a la suspensión de la cuenta.`
        },
        {
            id: 6,
            title: '6. Enlaces a Terceros',
            content: 'El sitio puede contener vínculos a páginas externas. Suferre del Bajío no se responsabiliza por el contenido, disponibilidad o prácticas de dichas páginas.'
        },
        {
            id: 7,
            title: '7. Material Publicitario y Promociones',
            content: `El sitio podrá contener anuncios, promociones y material publicitario de terceros, que son responsabilidad exclusiva de los anunciantes. Suferre del Bajío no se hace responsable por errores, inexactitudes o incumplimientos en ese material.

Las promociones y descuentos tendrán términos y condiciones específicos que serán publicados en cada caso en el sitio. Los cupones de descuento no serán acumulables con otras promociones, salvo indicación expresa.`
        },
        {
            id: 8,
            title: '8. Disponibilidad y Cancelaciones',
            content: `Los productos ofrecidos están sujetos a disponibilidad en inventario. En caso de agotarse, se informará al Usuario para cancelar o reprogramar la compra.

Suferre del Bajío podrá cancelar o rechazar cualquier pedido por errores en el precio, falta de mercancía, sospechas de fraude u otras causas justificadas, sin obligación a indemnizar.`
        },
        {
            id: 9,
            title: 'Ley Aplicable y Jurisdicción',
            content: 'Estos Términos y Condiciones de Uso se interpretarán y regirán por las leyes vigentes en México, renunciando expresamente a la aplicación de la Convención de las Naciones Unidas sobre los Contratos de Compraventa Internacional de Mercaderías, en caso de que sea aplicable.'
        },
        {
            id: 10,
            title: 'Indemnización',
            content: `El Usuario acepta indemnizar y mantener indemne a Suferre del Bajío, sus afiliados, proveedores, vendedores y asesores, de cualquier reclamación, acción, demanda o procedimiento que surja por incumplimiento de estos Términos, o por hechos que deriven, entre otros, de:
- El uso del Sitio o los servicios ofrecidos.
- La información contenida o disponible en el Sitio.
- La violación de derechos de autor, marcas, patentes o derechos de propiedad intelectual.
- La violación de leyes, reglamentos o tratados internacionales aplicables.`
        },
        {
            id: 11,
            title: 'Otros',
            content: `Si alguna cláusula o disposición de estos Términos es ilegal, inválida o de imposible ejecución en alguna jurisdicción, ello no afectará la validez del resto del contrato, que seguirá siendo válido y vinculante en la medida permitida por la ley.

Estos Términos y Condiciones, junto con el Aviso de Privacidad, constituyen el acuerdo total entre el Usuario y Suferre del Bajío en relación con la prestación de servicios y el uso del sitio web, sustituyendo cualquier acuerdo previo, ya sea verbal o escrito.`
        }
    ];


    return <>
        <main className={"max-w-4xl mx-auto py-10 px-6 md:py-16 md:px-8"}>
            {contenidoTerminos.length > 0
                && contenidoTerminos
                    .map(
                        (termino: Paragraph, index: number) =>
                        <TerminosSection id={termino.id} title={termino.title} content={termino.content} isFirst={index === 0}/>
                    )
            }
        </main>
    </>
}

export default TerminosPage;