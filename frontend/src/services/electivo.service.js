import axios from "@services/root.service.js";

export async function getElectivos() {
  try {
    const response = await axios.get("/electivos");
    return response.data.data;
  } catch (error) {
    console.error("Error al obtener electivos:", error);
    return [];
  }
}
