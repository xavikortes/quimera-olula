import { useEffect } from "react";
import { QBoton } from "../../../../../../componentes/atomos/qboton.tsx";
import { QInput } from "../../../../../../componentes/atomos/qinput.tsx";
import { useModelo } from "../../../../../comun/useModelo.ts";
import { Articulo } from "../../../../comun/componentes/articulo.tsx";
import { GrupoIvaProducto } from "../../../../comun/componentes/grupo_iva_producto.tsx";
import { LineaPedido } from "../../../diseño.ts";
import { metaLineaPedido } from "../../../dominio.ts";
import "./EdicionLinea.css";
export const EdicionLinea = ({
  lineaInicial,
  emitir,
}: {
  lineaInicial: LineaPedido;
  emitir: (evento: string, payload: unknown) => void;
}) => {
  const { modelo, uiProps, valido, init } = useModelo(
    metaLineaPedido,
    lineaInicial
  );

  useEffect(() => {
    init(lineaInicial);
  }, [lineaInicial, init]);

  return (
    <div className="EdicionLinea">
      <h2>Edición de línea</h2>
      <quimera-formulario>
        <Articulo {...uiProps("referencia", "descripcion")} />
        <QInput label="Cantidad" {...uiProps("cantidad")} />
        <GrupoIvaProducto {...uiProps("grupo_iva_producto_id")} />
        <QInput label="Precio" {...uiProps("pvp_unitario")} />
        <QInput label="% Descuento" {...uiProps("dto_porcentual")} />
      </quimera-formulario>
      <div className="botones maestro-botones ">
        <QBoton
          onClick={() => emitir("EDICION_LISTA", modelo)}
          deshabilitado={!valido}
        >
          Guardar
        </QBoton>
      </div>
    </div>
  );
};
