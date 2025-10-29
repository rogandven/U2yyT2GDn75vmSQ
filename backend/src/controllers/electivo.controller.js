import { AppDataSource } from "../config/configDb.js";
import { ElectivoEntity } from "../entity/electivo.entity.js";

// Repositorio TypeORM
const electivoRepository = AppDataSource.getRepository("Electivo");

// Obtener todos los electivos
export const getElectivos = async (req, res) => {
  try {
    const electivos = await electivoRepository.find();
    res.json({ ok: true, data: electivos });
  } catch (error) {
    console.error("Error al obtener electivos:", error);
    res.status(500).json({ ok: false, message: "Error interno del servidor" });
  }
};

// Crear un nuevo electivo (solo admin)
export const createElectivo = async (req, res) => {
  try {
    const nuevo = electivoRepository.create(req.body);
    const result = await electivoRepository.save(nuevo);
    res.status(201).json({ ok: true, data: result });
  } catch (error) {
    console.error("Error al crear electivo:", error);
    res.status(500).json({ ok: false, message: "Error interno" });
  }
};
