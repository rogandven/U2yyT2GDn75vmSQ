import { useForm } from "react-hook-form";
// import "@styles/LoginRegisterForm.css";
import DUErrorAlert from "./DUComponents/DUErrorAlert.jsx";

const LoginRegisterForm = ({ mode = "login", onSubmit, loginError}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onSubmit",
  });

  const onFormSubmit = async (data) => {
    try {
      const payload =
      mode === "login" ? { email: data.email, password: data.password } : data;

      await onSubmit(payload);

    } catch (error) {
      if (error.response) {
        // Error from the backend
        console.error("Error del backend:", error.response.data);
      }
    }
  };

  return (
    <div className="card bg-base-100 w-96 shadow-sm">
      <div className="login-register-form card-body">
        <h2 className="form-title card-title">
          {mode === "login" ? "Iniciar sesión" : "Registrarse"}
        </h2>

        <form onSubmit={handleSubmit(onFormSubmit)}>
          {mode === "register" && (
            <div className="form-group">
              <label className="input">
                <span class="label">Nombre de usuario:</span>
                <input
                  
                  type="text"
                  min={3}
                  {...register("username", {
                    required: "El nombre de usuario es obligatorio",
                    minLength: {
                      value: 3,
                      message:
                        "El nombre de usuario debe tener al menos 3 caracteres",
                    },
                    maxLength: {
                      value: 30,
                      message:
                        "El nombre de usuario debe tener como máximo 30 caracteres",
                    },
                    pattern: {
                      value: /^[a-zA-Z0-9_]+$/,
                      message:
                        "El usuario sólo puede contener letras, números y guiones bajos",
                    },
                  })}
                />
              </label>
              {errors.username && /* (
                  <span className="form-error-container">
                    {errors.username.message}
                  </span>
                ) */ 
                <DUErrorAlert message={errors.username.message}></DUErrorAlert>
              }
            </div>
          )}
          <div className="form-group">
            <label className="input">
              <span class="label">Correo:</span>
              <input
                
                type="email"
                {...register("email", {
                  required: "El correo es obligatorio",
                  minLength: {
                    value: 15,
                    message: "El correo debe tener al menos 15 caracteres",
                  },
                  maxLength: {
                    value: 50,
                    message: "El correo debe tener como máximo 50 caracteres",
                  },
                  pattern: {
                    value: /^[a-zA-Z0-9._%+-]+@gmail\.(com|cl)$/,
                    message:
                      "El correo debe ser un correo de Gmail válido (@gmail.com o @gmail.cl)",
                  },
                })}
              />
            </label>
            {errors.email && (
              /* <span className="form-error-container">{errors.email.message}</span> */
              <DUErrorAlert message={errors.email.message}></DUErrorAlert>
            )}
          </div>

          {mode === "register" && (
            <div className="form-group">
              <label className="input">
                  <span class="label">Rut:</span>
                  <input
                    
                    type="text"
                    {...register("rut", {
                      required: "El rut es obligatorio",
                      pattern: {
                        value: /^\d{2}\.\d{3}\.\d{3}-[\dkK]$/,
                        message: "Formato rut inválido. Debe ser xx.xxx.xxx-x.",
                      },
                    })}
                  />
              </label>
              {errors.rut && (
                <DUErrorAlert message={errors.rut.message}></DUErrorAlert>
                /* <span className="form-error-container">{errors.rut.message}</span> */
              )}
            </div>
          )}

          <div className="form-group">
            <label className="input">     
              <span className="label">Contraseña:</span>
              <input
                
                type="password"
                {...register("password", {
                  required: "La contraseña es obligatoria",
                  minLength: {
                    value: 8,
                    message: "La contraseña debe tener al menos 8 caracteres",
                  },
                  maxLength: {
                    value: 26,
                    message: "La contraseña debe tener como máximo 26 caracteres",
                  },
                })}
              />
            </label>
            {errors.password && (
              <DUErrorAlert message={errors.password.message}></DUErrorAlert>
              /* <span className="form-error-container">
                {errors.password.message}
              </span> */
            )}
          </div>

          <button type="submit" className="btn">
            {mode === "login" ? "Entrar" : "Registrarse"}
          </button>
        </form>

        <div style={{ marginTop: "1rem" }}>
          {mode === "login" ? (
            <p>
              ¿No tienes cuenta? <a href="/register">Regístrate</a>
            </p>
          ) : (
            <p>
              ¿Ya tienes cuenta? <a href="/login">Inicia sesión</a>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginRegisterForm;
