import { ImCheckmark } from "react-icons/im";
import { TiTimes } from "react-icons/ti";
import { BsClockFill } from "react-icons/bs";

const estadoIcon = (estado) => {
  if (estado === "aceptada") return <ImCheckmark />;
  if (estado === "rechazada") return <TiTimes />;
  return <BsClockFill />;
};

export const DUSolicitudTable = ({
  solicitudes,
  isJefe,
  handleChangeSolicitudStatus
}) => {
  let numero = 1;

  return (
    <div className="overflow-x-auto rounded-box border bg-base-100 m-3">
      <table className="table">
        <thead>
          <tr>
            <th></th>
            <th>Tipo</th>
            <th>Electivo</th>
            <th>Créditos</th>
            <th>Estado</th>
            <th>Motivo Rechazo</th>
            {isJefe && <th>Acciones</th>}
          </tr>
        </thead>
        <tbody>
          {solicitudes.map((s) => (
            <tr key={`SOL-${numero}`}>
              <th>{numero++}</th>
              <td>{s.tipo}</td>
              <td>{s.id_electivo || "-"}</td>
              <td>{s.creditos_solicitados || "-"}</td>
              <td>{estadoIcon(s.estado)}</td>
              <td>{s.motivo_rechazo || "-"}</td>
              {isJefe && (
                <td>
                  <button
                    className="btn btn-success m-1"
                    onClick={() =>
                      handleChangeSolicitudStatus(s.id, true, isJefe)
                    }
                  >
                    <ImCheckmark />
                  </button>
                  <button
                    className="btn btn-error m-1"
                    onClick={() =>
                      handleChangeSolicitudStatus(s.id, false, isJefe)
                    }
                  >
                    <TiTimes />
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DUSolicitudTable;
