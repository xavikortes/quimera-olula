import { useContext } from "react";
import { Maestro } from "../../../../componentes/maestro/Maestro.tsx";
import { Contexto } from "../../../comun/contexto.ts";
import { Entidad } from "../../../comun/diseño.ts";
import { AccionesPresupuesto, Presupuesto } from "../diseño.ts";
import {
  accionesPresupuesto,
  camposPresupuestoNuevo,
} from "../infraestructura.ts";
import { DetallePresupuesto } from "./DetallePresupuesto.tsx";

export const MaestroConDetallePresupuesto = () => {
  const context = useContext(Contexto);
  if (!context) {
    throw new Error("Contexto is null");
  }
  const { seleccionada, setSeleccionada, entidades, setEntidades } = context;

  const titulo = (presupuesto: Entidad) =>
    (presupuesto as Presupuesto).codigo as string;

  const onCrearPresupuesto = async (
    presupuesto: Presupuesto
  ): Promise<void> => {
    console.log(presupuesto);
    const objPresupuestoNuevo = {
      cliente: {
        cliente_id: presupuesto.cliente_id,
        direccion_id: presupuesto.direccion_id,
      },
      empresa_id: presupuesto.empresa_id,
    };
    accionesPresupuesto.crearUno(objPresupuestoNuevo).then(() => {
      accionesPresupuesto.obtenerTodos().then((presupuestos) => {
        setEntidades(presupuestos);
      });
    });
  };

  const accionesPresupuestoMaestroConDetalle: AccionesPresupuesto = {
    ...accionesPresupuesto,
    crearUno: onCrearPresupuesto,
  };

  return (
    <div className="MaestroConDetalle" style={{ display: "flex", gap: "2rem" }}>
      <div className="Maestro" style={{ flexBasis: "50%", overflow: "auto" }}>
        <Maestro
          acciones={accionesPresupuestoMaestroConDetalle}
          camposEntidad={camposPresupuestoNuevo}
        />
      </div>
      <div className="Detalle" style={{ flexBasis: "50%", overflow: "auto" }}>
        <DetallePresupuesto
          id={seleccionada?.id}
          acciones={accionesPresupuestoMaestroConDetalle}
          obtenerTitulo={titulo}
        />
      </div>
    </div>
  );
};
