// import "@styles/profile.css";
import profilePic from "@assets/cat_pfp.jpg";


const ProfileCardRow = ({data, label}) => {
  return (
    <label className="input">
      <span className="label">{label}</span>
      <p>{data}</p>
    </label>
  )
}

const ProfileCardList = ({data}) => {
  return (
    <div>
      <ProfileCardRow data={data.username || "ladiesman217"} label={"Nombre de usuario"}></ProfileCardRow>
      <ProfileCardRow data={data.email || "juanito.perez@alumnos.ubiobio.cl"} label={"Correo electrónico"}></ProfileCardRow>
      <ProfileCardRow data={data.role || "ESTUDIANTE"} label={"Rol"}></ProfileCardRow>
      <ProfileCardRow data={data.creditos || 0} label={"Rol"}></ProfileCardRow>
    </div>
  )
}

const Badge = (label, data, color) => {
  /*String((user && (user.carrera)) || "IECI").toUpperCase()*/
  return ( 
    <div className="flex flex-row center items-center content-center self-center">
      <p className="flex flex-row center items-center content-center self-center mb-1"><b>{String(label).toUpperCase()}</b>: 
        <div className={`badge ${String(color)} ml-1`}>{String(data).toUpperCase()}</div>
      </p>
    </div>
  );
}

const ProfileCard = ({ user }) => {
  return (
    <div className="card bg-base-100 w-96 shadow-sm">
      <div className="card-body flex flex-row">
        <div className="avatar avatar-online object-scale-down">
          <div className="w-24 rounded-full object-scale-down">
            <img src={profilePic} />
          </div>
        </div>
        <div className="profile-card-content ml-4">
          <h2 className="card-title">{String((user && (user.fullname || user.username)) || "JUANITO PÉREZ").toUpperCase()}</h2>
          <p><b>APODO</b>: {String((user && (user.username)) || "JUANITOPEREZ123").toUpperCase()}</p>
          <p><b>RUT</b>: {String((user && (user.rut)) || "123456789-0").toUpperCase()}</p>
          <p><b>CORREO</b>: {String((user && (user.email)) || "JUANITOPEREZ123@EMAIL.COM").toUpperCase()}</p>
          <p><b>CRÉDITOS</b>: {(String(user.creditos || "0")).toUpperCase()}</p>
          {Badge("CARRERA", String((user && (user.carrera?.sigla)) || "IECI").toUpperCase(), "badge-primary")}
          {Badge("ROL", String((user && (user.role || user.rol)) || "ESTUDIANTE").toUpperCase().replaceAll("_", " "), "badge-secondary")}
        </div>
      </div>
    </div>
  );

  /* return (
    <div className="profile-card">
      <h1 className="profile-header">Perfil de {user.username}</h1>
      <div className="profile-content">
        <div className="profile-image">
          <img src={profilePic} alt={`${user.username}'s profile`} />
        </div>
        <div className="profile-info">
          <p>
            <strong>Nombre:</strong> {user.username}
          </p>
          <p>
            <strong>Correo:</strong> {user.email}
          </p>
          <p>
            <strong>Rol:</strong> {user.role}
          </p>
        </div>
      </div>
    </div>
  ); */
};

export default ProfileCard;
