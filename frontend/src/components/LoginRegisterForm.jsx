import { useForm } from "react-hook-form";

// import "@styles/LoginRegisterForm.css";

const LoginRegisterForm = ({ mode = "login", onSubmit }) => {
  const exists = (value) => {
    return !!value;
  }
  
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
    <div className={"login-register-form"}>
      <h2 className={"form-title"}>
        {mode === "login" ? "Iniciar sesión" : "Registrarse"}
      </h2>
      
      {/* mode === "login" && (Object.values(errors).length > 0 || loginError) && (
        <div className="form-error-container">
          <p>{errors.email?.message || errors.password?.message || loginError}</p>
        </div>
      ) */}

      <form onSubmit={handleSubmit(onFormSubmit)}>
        {mode === "register" && (
          <div className={"form-group"}>
            <label className={""}>Nombre de usuario:</label>
            <input
              className={""}
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
            {exists(errors.username) && (
              <p className={"form-error-container"}>
                {errors.username.message}
              </p>
            )}
          </div>
        )}
        <div className="form-group ">
          <label className={""}>Correo:</label>
          <input
            className={""}
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
          {errors.email && (
            <p className={"form-error-container"}>{errors.email.message}</p>
          )}
        </div>

        {mode === "register" && (
          <div className="form-group">
            <label className={""}>Rut:</label>
            <input
              className={""}
              type="text"
              {...register("rut", {
                required: "El rut es obligatorio",
                pattern: {
                  value: /^\d{2}\.\d{3}\.\d{3}-[\dkK]$/,
                  message: "Formato rut inválido. Debe ser xx.xxx.xxx-x.",
                },
              })}
            />
            {exists(errors.rut) && (
              <p className={"form-error-container"}>{errors.rut.message}</p>
            )}
          </div>
        )}

        <div className="form-group">
          <label className={""}>Contraseña:</label>
          <input
            className={""}
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
          {exists(errors.password) && (
            <p className={"form-error-container"}>
              {errors.password.message}
            </p>
          )}
        </div>

        <button className={""} type="submit">
          {mode === "login" ? "Entrar" : "Registrarse"}
        </button>
      </form>

      <div className={""}>
        {mode === "login" ? (
          <p className={""}>
            ¿No tienes cuenta? <a href="/register" className={""}>Regístrate</a>
          </p>
        ) : (
          <p className={""}>
            ¿Ya tienes cuenta? <a href="/login" className={""}>Inicia sesión</a>
          </p>
        )}
      </div>
    </div>
  );
};

export default LoginRegisterForm;
