import { useContext, useEffect, useState } from "react";
import { Contexto } from "../../contextos/comun/contexto.ts";
import {
  Acciones,
  Criteria,
  Entidad,
  Filtro,
  Orden,
} from "../../contextos/comun/diseño.ts";
import { CampoFormularioGenerico } from "../detalle/FormularioGenerico.tsx";
import { expandirEntidad, formatearClave } from "../detalle/helpers.tsx";
import { SinDatos } from "../SinDatos/SinDatos.tsx";
import { Tabla } from "../wrappers/tabla.tsx";
import { MaestroAcciones } from "./maestroAcciones/MaestroAcciones.tsx";
import { filtrarEntidad } from "./maestroFiltros/filtro.ts";
import { MaestroFiltros } from "./maestroFiltros/MaestroFiltros.tsx";

const obtenerCampos = (entidad: Entidad | null): string[] => {
  if (!entidad) return [];

  return expandirEntidad(entidad).map(([clave]) => clave);
};

/* eslint-disable  @typescript-eslint/no-explicit-any */
export type MaestroProps<T extends Entidad> = {
  acciones: Acciones<T>;
  Acciones?: any;
  camposEntidad: CampoFormularioGenerico[];
  criteria?: Criteria;
};

export const Maestro = <T extends Entidad>({
  acciones,
  Acciones = null,
  camposEntidad,
  criteria = { filtro: {}, orden: { id: "DESC" } },
}: MaestroProps<T>) => {
  const { obtenerTodos } = acciones;
  const [cargando, setCargando] = useState(true);
  const [filtro, setFiltro] = useState<Filtro>(criteria.filtro);
  const [orden, setOrden] = useState<Orden>(criteria.orden);

  const context = useContext(Contexto);
  if (!context) {
    throw new Error("Contexto nulo");
  }
  const { entidades, setEntidades, seleccionada, setSeleccionada } = context;

  useEffect(() => {
    let hecho = false;
    setCargando(true);

    obtenerTodos(filtro, orden).then((entidades) => {
      if (hecho) return;

      setEntidades(entidades as T[]);
      setCargando(false);
    });

    return () => {
      hecho = true;
    };
  }, [filtro, orden, obtenerTodos, setEntidades]);

  const entidadesFiltradas = entidades.filter((entidad) =>
    filtrarEntidad(entidad, filtro)
  );

  const cabeceras = entidadesFiltradas.length
    ? (Object.fromEntries(
        expandirEntidad(entidadesFiltradas[0]).map(([clave]) => [
          formatearClave(clave),
          clave,
        ])
      ) as Record<string, string>)
    : {};

  const renderEntidades = () => {
    if (entidadesFiltradas.length === 0) return <SinDatos />;

    return (
      <Tabla
        cabeceras={cabeceras}
        datos={entidadesFiltradas}
        cargando={cargando}
        seleccionadaId={seleccionada?.id}
        onSeleccion={setSeleccionada}
        orden={orden}
        onOrdenar={(clave) =>
          setOrden({ [clave]: orden[clave] === "ASC" ? "DESC" : "ASC" })
        }
      />
    );
  };

  return (
    <div className="Maestro">
      {Acciones ? (
        <Acciones acciones={acciones} camposEntidad={camposEntidad} />
      ) : (
        <MaestroAcciones acciones={acciones} camposEntidad={camposEntidad} />
      )}
      <MaestroFiltros
        campos={obtenerCampos(entidades[0])}
        filtro={filtro}
        cambiarFiltro={(clave, valor) =>
          setFiltro({ ...filtro, [clave]: { LIKE: valor } })
        }
        borrarFiltro={(clave) => {
          const { [clave]: _, ...resto } = filtro;
          setFiltro(resto);
        }}
        resetearFiltro={() => setFiltro(criteria.filtro)}
      />
      {renderEntidades()}
    </div>
  );
};
