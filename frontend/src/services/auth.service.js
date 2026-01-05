import axios from './root.service.js';
import cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';

export async function registerService(datauser) {
    try {
        const response = await ("/auth/register", {
            username: datauser.username,
            email: datauser.email,
            rut: datauser.rut,
            password: datauser.password,
        })

        return response
    } catch (error) {
        // console.error("Error en auth.service");
        return error.response;
    }
}

export async function loginService(datauser) {
    try {
        // console.log(JSON.stringify(axios.defaults));
        const response = await axios.post('/auth/login', {
            email: datauser.email,
            password: datauser.password
        });
        // console.log("LA RESPUESTA: ");
        // console.log(response);

        const { status, data } = response;
        if (status === 200) {
            let parsedToken = data && data.data && data.data.token;
            if (parsedToken) {
                const { username, email, rut, rol } = jwtDecode(parsedToken);
                const userData = { username, email, rut, rol };
                sessionStorage.setItem('usuario', JSON.stringify(userData));
                axios.defaults.headers.common['Authorization'] = `Bearer ${parsedToken}`;
                cookies.set('jwt-auth', parsedToken, { path: '/' });
                return response;
            } else {
                throw new Error("Error al interpretar el token");
            }
        }
    } catch (error) {
        // console.error("Error en auth.service");
        // console.log(error.response);
        return error.response;
    }
}

export async function logout() {
    try {
        await axios.post('/auth/logout');
        sessionStorage.removeItem('usuario');
        cookies.remove('jwt');
        cookies.remove('jwt-auth');
    } catch (error) {
        // console.error('Error al cerrar sesión', error)
    }
}
