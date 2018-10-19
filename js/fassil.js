function makeHTTPRequest(url, method, onSuccess, onError){
    try
    {
        var request = new XMLHttpRequest();

        request.open(method,url, true);

        request.onreadystatechange = function (){
            if (request.readyState == XMLHttpRequest.DONE) {
                onSuccess(request.responseText);
            }
        };

        request.onerror = onError;

        request.send();
    }
    catch(exception)
    {
        onError(exception);
    }
}

function obtenerCreditos(onSuccess, onError){
    makeHTTPRequest('data/creditos.json','GET', function(responseText){
        var response = JSON.parse(responseText);
        window.localStorage.setItem('creditos', responseText);
        onSuccess(response);
    }, function(excep){
        onError(excep);
    });
}

function obtenerDetallesCredito(creditoId){
    var responseText = window.localStorage.getItem('creditos');
    var creditos = JSON.parse(responseText);
    return creditos.filter(function(cred){ return cred.id === creditoId })[0];
}

function calcularPlanCuotas({interes, plazo, monto, tipoMoneda}){
    monto = parseFloat(monto);

    if(tipoMoneda == 2){
        monto *= 6.96;
    }

    var plazoMeses = plazo*12;
    var saldoActual = monto;
    var cuotas = [];
    cuotas.push({
        id:0,
        capital: null,
        intereses: null,
        cuota: null,
        saldo: saldoActual
    });

    var capitalMes = monto/plazoMeses;
    var interesMensual = interes/12;

    var totalCapital = 0;
    var totalIntereses = 0;
    var totalCuotas = 0;

    var i = 1;

    while(i<=plazoMeses){
        var cuotaMes = {id: i, capital: capitalMes, intereses: saldoActual*interesMensual};
        cuotaMes.cuota = cuotaMes.capital + cuotaMes.intereses;
        cuotaMes.saldo = saldoActual - cuotaMes.capital;
        saldoActual = cuotaMes.saldo;
        totalCapital += cuotaMes.capital;
        totalIntereses += cuotaMes.intereses;
        totalCuotas += cuotaMes.cuota;
        cuotas.push(cuotaMes);
        ++i;
    }

    cuotas.push({
        id: 'TOTAL',
        capital: totalCapital,
        intereses:totalIntereses,
        cuota: totalCuotas
    });

    cuotas.forEach(function(c){
        c.capital = redondear(c.capital);
        c.intereses = redondear(c.intereses);
        c.cuota = redondear(c.cuota);
        c.saldo = redondear(c.saldo);
    });

    return {
        plazoMeses,
        interesMensual,
        monto,
        cuotas,
    };
}

function redondear(monto){
    if(monto)
        return monto.toFixed(2);

    return monto;
}