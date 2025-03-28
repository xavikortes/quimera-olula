import { useState } from "react";
import { Listado } from "../../../../componentes/maestro/Listado.tsx";
import { Entidad } from "../../../../contextos/comun/diseño.ts";
import { actualizarEntidadEnLista } from "../../../comun/dominio.ts";
import { Cliente } from "../diseño.ts";
import { deleteCliente, getClientes } from "../infraestructura.ts";
import { AltaCliente } from "./AltaCliente.tsx";
import { DetalleCliente } from "./DetalleCliente.tsx";

const metaTablaCliente = [
  { id: "id", cabecera: "Id" },
  { id: "nombre", cabecera: "Nombre" },
  {
    id: "id_fiscal",
    cabecera: "Id Fiscal",
    render: (entidad: Entidad) =>
      `${entidad.tipo_id_fiscal}: ${entidad.id_fiscal}`,
  },
];

export const MaestroConDetalleCliente = () => {
  const [entidades, setEntidades] = useState<Cliente[]>([]);
  const [seleccionada, setSeleccionada] = useState<Cliente | null>(null);
  const [mostrarModal, setMostrarModal] = useState(false); // Estado para controlar el modal

  const actualizarEntidad = (entidad: Cliente) => {
    setEntidades(actualizarEntidadEnLista<Cliente>(entidades, entidad));
  };

  const onCrearCliente = () => {
    setMostrarModal(true);
  };

  const onClienteCreado = (nuevoCliente: Cliente) => {
    setEntidades([...entidades, nuevoCliente]);
    setMostrarModal(false);
  };

  const onCancelar = () => {
    setMostrarModal(false);
  };

  const onBorrarCliente = async () => {
    if (!seleccionada) {
      return;
    }
    await deleteCliente(seleccionada.id);
    setEntidades(entidades.filter((e) => e.id !== seleccionada.id));
    setSeleccionada(null);
  };

  return (
    <>
      <div
        className="Maestro"
        style={{
          width: "50%",
          overflowX: "hidden",
        }}
      >
        <h2>Clientes</h2>
        <button onClick={onCrearCliente}> Nuevo</button>
        <button disabled={!seleccionada} onClick={onBorrarCliente}>
          {" "}
          Borrar
        </button>
        <Listado
          metaTabla={metaTablaCliente}
          entidades={entidades}
          setEntidades={setEntidades}
          seleccionada={seleccionada}
          setSeleccionada={setSeleccionada}
          cargar={getClientes}
        />
      </div>
      <div className="Detalle" style={{ width: "50%", overflowX: "hidden" }}>
        <DetalleCliente
          clienteInicial={seleccionada}
          onEntidadActualizada={actualizarEntidad}
        />
      </div>

      {mostrarModal && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={onCancelar}>
              &times;
            </span>
            <AltaCliente
              onClienteCreado={onClienteCreado}
              onCancelar={onCancelar}
            />
          </div>
        </div>
      )}
    </>
  );
};
