// import "@styles/profile.css";
import profilePic from "@assets/profilePic.jpg";

const ProfileCardRow = ({data, label}) => {
  console.log(data);
  return (
      <li className="list-row">
        <div>
          <div>{String(data)}</div>
          <div className="text-xs uppercase font-semibold opacity-60">{String(label)}</div>
        </div>
      </li>
  )
}

const ProfileCardList = ({data}) => {
  console.log(data);
  return (
    <div>
      <h1 className="card-title">Información de usuario</h1>
      <ul className="list">
        <ProfileCardRow data={data.username || "ladiesman217"} label={"Nombre de usuario"}></ProfileCardRow>
        <ProfileCardRow data={data.email || "juanito.perez"} label={"Correo electrónico"}></ProfileCardRow>
        <ProfileCardRow data={data.role || "juanito.perez"} label={"Rol"}></ProfileCardRow>
      </ul>
    </div>
  )
}

const ProfileCard = ({ user }) => {
  console.log(user);
  return (
      <div className="profile-card w-xl">
        <div className="card card-side bg-base-100 shadow-sm">
            <figure>
              <div className="avatar">
                <div className="w-max">
                  <img className="justify-stretch w-max" src="https://img.daisyui.com/images/profile/demo/yellingwoman@192.webp" />
                </div>
              </div>
            </figure>
            <div className="card-body">
              <ProfileCardList data={user}></ProfileCardList>
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
