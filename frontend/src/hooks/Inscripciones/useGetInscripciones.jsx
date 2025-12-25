"use strict"
import {useState, useCallback} from "react";
import { getInscripciones } from "@services/Inscripcion.service.js";

export const useGetInscripciones = () => {
  const [Inscripciones, setInscripciones] = useState([]);
  const [error, setError] = useState(null);

  const fetchMisInscripciones = useCallback(async () => {
    setError(null);
    try {
      const data = await getInscripciones();
      
      if(Array.isArray(data)) {
        setInscripciones(data);
      } else if(data?.data && Array.isArray(data.data)) {
        setInscripciones(data.data);    
      } else {
        console.warn("Formato de datos inesperado:", data);
        setInscripciones([]);    
      }
    } catch (error) {
      console.error("Error al obtener Inscripciones", error);
      setError(error);
      setInscripciones([]);   
    } 
  }, []);

  return {Inscripciones, fetchMisInscripciones, error};
};

export default useGetInscripciones;