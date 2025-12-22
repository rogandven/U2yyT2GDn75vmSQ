// https://cesarg.cl/validador-de-rut-chileno-con-javascript/
const Fn = {
	// Valida el rut con su cadena completa "XXXXXXXX-X"
	validaRut : function (rutCompleto) {
		if (!/^[0-9]+[-|‐]{1}[0-9kK]{1}$/.test( rutCompleto ))
			return false;
		var tmp 	= rutCompleto.split('-');
		var digv	= tmp[1]; 
		var rut 	= tmp[0];
		if ( digv == 'k' ) digv = 'K' ;
		return (Fn.dv(rut) == digv );
	},
	dv : function(T){
		var M=0,S=1;
		for(;T;T=Math.floor(T/10))
			S=(S+T%10*(9-M++%6))%11;
		return S?S-1:'K';
	}
}

export const rutValidationFunction = (value, helpers) => {
    if (!value) {
        return helpers.message('RUT no proporcionado');
    }
    if (!Fn.validaRut(value)){
        return helpers.message('El RUT ingresado no es válido. Debe estar en formato XXXXXXXX-X.');
    }
    return true;
}
