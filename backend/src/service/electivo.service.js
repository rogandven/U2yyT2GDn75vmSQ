const electivoRepo = AppDataSource.getRepository(ElectivoEntity);

export async function getElectivosFromService(req, res) {
  try {
    const { filtro, area, apertura, cierre } = req.query;

    let query = electivoRepo.createQueryBuilder("electivo");

    if (filtro) {
      query = query.andWhere(
        "(electivo.nombre ILIKE :filtro OR electivo.descripcion ILIKE :filtro)",
        { filtro: `%${filtro}%` }
      );
    }

    if (area) query = query.andWhere("electivo.area ILIKE :area", { area });
    if (apertura)
      query = query.andWhere("DATE(electivo.apertura) = :apertura", {
        apertura,
      });
    if (cierre)
      query = query.andWhere("DATE(electivo.cierre) = :cierre", { cierre });

    const resultados = await query.getMany();

    res.status(200).json({
      message: "Electivos obtenidos correctamente",
      data: resultados,
    });
  } catch (error) {
    console.error("Error al listar electivos:", error);
    res.status(500).json({ message: "Error al listar electivos" });
  }
}