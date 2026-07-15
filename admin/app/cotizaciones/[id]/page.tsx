import { ModulePlaceholder } from "@/components/module-placeholder";

export default function CotizacionDetallePage() {
  return (
    <ModulePlaceholder
      title="Detalle de cotización"
      description="Vista de consulta y seguimiento para una cotización individual."
      bullets={[
        "Productos cotizados",
        "Totales y vigencia",
        "Estado de envío",
      ]}
    />
  );
}
