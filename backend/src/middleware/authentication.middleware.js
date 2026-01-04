"use strict";
import { SESSION_SECRET } from "../config/configEnv.js";
import jwt from "jsonwebtoken";
import { getMiddlewareResponse } from "./utils/middleware.utils.js";
import { MIDDLEWARE_getUserByIdFromService } from "../service/user.service.js";

// Middleware para autenticar JWT
export async function authenticateJwt(req, res, next) {
  // Conseguir el token del encabezado Authorization
  const authHeader = req.headers.authorization;

  // Verificar si el token está presente y es un Bearer Token
  if (!authHeader || !authHeader.startsWith("Bearer "))
    return res.status(401).json(getMiddlewareResponse("Token no proporcionado"));

  // Extraer el token del encabezado
  const token = authHeader.split(" ")[1];

  try {
    // Verificar y decodificar el token usando la clave secreta
    const decoded = jwt.verify(token, SESSION_SECRET);
    console.log("DECODED: " + JSON.stringify(decoded));
    req.user = decoded;
    const additionalData = await MIDDLEWARE_getUserByIdFromService(req.user.id);
    if (!additionalData) {
      throw new Error("Token inválido o expirado");
    }
    Object.assign(req.user, additionalData);
    next();
    
  } catch (error) {
    return res.status(403).json(getMiddlewareResponse("Token inválido o expirado"));
  }
}