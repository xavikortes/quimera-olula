import { useContext } from "react";
import { Detalle } from "../../../../componentes/detalle/Detalle.tsx";
import { CampoFormularioGenerico } from "../../../../componentes/detalle/FormularioGenerico.tsx";
import { Maestro } from "../../../../componentes/maestro/Maestro.tsx";
import { Contexto } from "../../../comun/contexto.ts";
import { Cliente, ClienteConDirecciones } from "../diseño.ts";
import { accionesCliente } from "../infraestructura.ts";
import { MaestroDirecciones } from "./MaestroDirecciones.tsx";

export const MaestroConDetalleCliente = () => {
  const context = useContext(Contexto);
  if (!context) {
    throw new Error("Contexto is null");
  }
  const { seleccionada, entidades, setEntidades } = context;

  const titulo = (cliente: Cliente) => cliente.nombre;

  const camposCliente: CampoFormularioGenerico[] = [
    {
      nombre: "id",
      etiqueta: "Código",
      tipo: "text",
      oculto: true,
    },
    { nombre: "nombre", etiqueta: "Nombre", tipo: "text", ancho: "100%" },
    { nombre: "id_fiscal", etiqueta: "CIF/NIF", tipo: "text" },
    { nombre: "agente_id", etiqueta: "Agente", tipo: "text" },
    { nombre: "divisa_id", etiqueta: "Divisa", tipo: "label" },
    { nombre: "tipo_id_fiscal", etiqueta: "Tipo ID Fiscal", tipo: "text" },
    { nombre: "serie_id", etiqueta: "Serie", tipo: "label" },
    { nombre: "forma_pago_id", etiqueta: "Forma de Pago", tipo: "text" },
    {
      nombre: "grupo_iva_negocio_id",
      etiqueta: "Grupo IVA Negocio",
      tipo: "text",
    },
    { nombre: "eventos", etiqueta: "Eventos", tipo: "text", oculto: true },
    { nombre: "espacio", etiqueta: "", tipo: "space" },
  ];

  const actualizarCliente = (cliente: Cliente) => {
    setEntidades([
      ...entidades.map((c) => (c.id !== cliente.id ? c : cliente)),
    ]);
  };

  const obtenerUno = async () => {
    return seleccionada as ClienteConDirecciones;
  };

  const AccionesClienteMaestroConDetalle = {
    ...accionesCliente,
    obtenerUno,
  };

  return (
    <div className="MaestroConDetalle" style={{ display: "flex", gap: "2rem" }}>
      <div className="Maestro" style={{ flexBasis: "50%", overflow: "auto" }}>
        <Maestro
          acciones={AccionesClienteMaestroConDetalle}
          camposEntidad={camposCliente}
        />
      </div>
      <div className="Detalle" style={{ flexBasis: "50%", overflow: "auto" }}>
        <Detalle
          id={seleccionada?.id ?? "0"}
          camposEntidad={camposCliente}
          acciones={{
            ...accionesCliente,
            actualizarUno: async (id, cliente) => {
              accionesCliente.actualizarUno(id, cliente).then(() => {
                if (!cliente.id) {
                  accionesCliente.obtenerUno(id).then((cliente) => {
                    actualizarCliente(cliente);
                  });
                }
              });
            },
            crearUno: async (cliente) => {
              accionesCliente.crearUno(cliente).then(() => {
                accionesCliente.obtenerUno(cliente.id).then((cliente) => {
                  actualizarCliente(cliente);
                });
              });
            },
          }}
          obtenerTitulo={titulo}
        >
          <h2>Direcciones</h2>
          <MaestroDirecciones id={seleccionada?.id} />
        </Detalle>
      </div>
    </div>
  );
};
