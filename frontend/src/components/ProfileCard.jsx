import "@styles/profile.css";
import profilePic from "@assets/profilePic.jpg";

const parseRole = (role) => {
  if (!role || typeof(role) !== "string") {
    return "Rol desconocido";
  }
  return role.toUpperCase().replaceAll("_", " ");
}

const ProfileCard = ({ user }) => {
  return (
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
            <strong>Rol:</strong> {parseRole(user.role)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
