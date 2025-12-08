export const arrayDeStringAArrayDeSQL = (array) => {
    let resultado = "('";
    if (!array || !Array.isArray(array)) {
        throw Error("No se pasó ningún array");
    }
    resultado += array.join("','");
    resultado += "')";
    //console.log(resultado);
    return resultado;
}