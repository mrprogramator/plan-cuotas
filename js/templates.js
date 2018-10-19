function obtenerCreditoItemTemplate(creditoItem){
    return "<div class=\"item-container\" style=\"padding:14px\">"
                + "<table style=\"margin:0px auto\">"
                    + "<tr>"
                        + "<td style=\"vertical-align:middle\">"
                            + "<div class=\"logo-container\">"
                                + "<span class=\"" + creditoItem.icono + " fa-4x\" onclick=\"mostrarDetallesCredito(" + creditoItem.id + ")\"></span>"
                            + "</div>"
                        + "</td>"
                        + "<td style=\"vertical-align:middle;padding-left:14px;color:#022A5B\">"
                            + "<h3 onclick=\"mostrarDetallesCredito(" + creditoItem.id + ")\" style=\"cursor:pointer\">" + creditoItem.descripcion + "</h3>"
                        + "</td>"
                    + "</tr>"
                + "</table>"
            + "</div>";
}

function obtenerDetallesCreditoTemplate(creditoItem){
    return "<div style=\"width:90%;margin:20px auto;border-radius:4px;border:1px solid gray;\">" 
    + "<div style=\"margin:0px;padding:7px;background:#01A8A0;color:#fff\">"
        + "<table>"
            + "<tr>"
                + "<td style=\"vertical-align:middle\">"
                    + "<span onclick=\"mostrarCreditos()\" class=\"fa fa-arrow-left fa-2x\" style=\"cursor:pointer\"></span>"
                + "</td>"
                + "<td style=\"vertical-align:middle\">"
                    + "<div class=\"logo-container-tiny\">"
                        + "<span class=\"" + creditoItem.icono + " fa-2x\"></span>"
                    + "</div>"
                + "</td>"
                + "<td style=\"vertical-align:middle;padding-left:14px;color:#fff\">"
                    + "<h4>" + creditoItem.descripcion + "</h4>"
                + "</td>"
            + "</tr>"
        + "</table>"
    + "</div>"
    + "<div style=\"padding:14px\">"
        + obtenerListadoTemplate({titulo: "Requisitos básicos", listado: creditoItem.requisitosBasicos})
        + obtenerListadoTemplate({titulo: "Documentación legal", listado: creditoItem.documentacionLegal})
        + obtenerTasasTemplate(creditoItem.tasas)
    +"</div>"
    + "<div style=\"padding:14px;text-align:center\">"
        + "<button class=\"btn btn-primary\" onclick=\"mostrarPlanCuotasCredito(" + creditoItem.id + ")\"><span class=\"fa fa-calculator\"></span> Plan de Cuotas</button>"
        + "<button class=\"btn btn-primary\" onclick=\"mostrarCreditos()\"><span class=\"fa fa-arrow-left\"></span> Volver</button> "
    +"</div>"
+"</div>";
}

function obtenerPlanCuotasCreditoTemplate(creditoItem){
    return "<div style=\"width:100%;margin:20px auto;border-radius:4px;border:1px solid gray;\">" 
    + "<div style=\"margin:0px;padding:7px;background:#01A8A0;color:#fff\">"
        + "<table>"
            + "<tr>"
                + "<td style=\"vertical-align:middle\">"
                    + "<span onclick=\"mostrarDetallesCredito(" + creditoItem.id + ")\" class=\"fa fa-arrow-left fa-2x\" style=\"cursor:pointer\"></span>"
                + "</td>"
                + "<td style=\"vertical-align:middle\">"
                    + "<div class=\"logo-container-tiny\">"
                        + "<span class=\"" + creditoItem.icono + " fa-2x\"></span>"
                    + "</div>"
                + "</td>"
                + "<td style=\"vertical-align:middle;padding-left:14px;color:#fff\">"
                    + "<h4>" + creditoItem.descripcion + "</h4>"
                + "</td>"
            + "</tr>"
        + "</table>"
    + "</div>"
    + "<div style=\"padding:14px\">"
        + "<h4 style=\"text-align:center\">PLAN DE CUOTAS</h4>"
        + obtenerTasasSeleccionablesTemplate(creditoItem.tasas)
        + "<div style=\"text-align:center\"\">"
            + "<input id=\"monto\" type=\"number\" step=\"0.01\" class=\"input-control\" placeholder=\"Monto\" autofocus/> "
            + "<select class=\"input-control\" id=\"tipo-moneda\" onchange=\"verificarTipoMoneda(this)\">"
                + "<option value=\"1\" selected>Bs.</option>"
                + "<option value=\"2\">$us</option>"
            + "</select>"
            + "<br><span id=\"monto-msg\"></span>" 
        + "</div>"
    +"</div>"
    + "<div style=\"padding:14px;text-align:center\">"
        + "<button class=\"btn btn-primary\" onclick=\"mostrarCalculoPlanCuotas()\"><span class=\"fa fa-calculator\"></span> Calcular Plan de Cuotas</button>"
        + "<button class=\"btn btn-primary\" onclick=\"mostrarDetallesCredito(" + creditoItem.id + ")\"><span class=\"fa fa-arrow-left\"></span> Volver</button> "
    +"</div>"
    + "<div id=\"plan-cuotas-results\" style=\"text-align:center\"></div>"
+"</div>";
}


function obtenerListadoTemplate(listadoItem){
    var html = "";
    if(listadoItem.listado){
        html += "<strong>" + listadoItem.titulo + "</strong>"
        + "<ul>";
        listadoItem.listado.forEach(function(element) {
            html += "<li>" + element + "</li><br>";
        });
        html += "</ul>"
    }
    
    html += "</ul>";
    return html;
}

function obtenerTasasTemplate(tasas){
    var html = "";

    if(tasas){
        html += "<div style=\"padding-left:7px\">";
        tasas.forEach(tasa => {
            html += "<strong>" + tasa.descripcion + ": </strong>" + redondear(tasa.interes*100) + "% a " + tasa.plazo + " años<br><br>"; 
        })
        html += "</div>";
    }

    return html;
}

function obtenerTasasSeleccionablesTemplate(tasas){
    var html = "";

    if(tasas){
        tasas.forEach(tasa => {
            html += "<div id=\"tasa-option-" + tasa.id + "\" class=\"tasa-option\" style=\"margin-bottom:14px;padding:7px;border:1px solid gray; border-radius:4px;cursor:pointer;text-align:center\" onclick=\"seleccionarTasa(" + tasa.id + ", " + tasa.interes + "," + tasa.plazo + ")\">"
                +"<input id=\"tasa-radio-" + tasa.id + "\" name=\"tasa\" type=\"radio\"/> <strong>" + tasa.descripcion + ": </strong>" + redondear(tasa.interes*100) + "% a " + tasa.plazo + " años<br><br>"
            + "</div>";
        })
    }

    return html;
}

function seleccionarTasa(tasaId, interes, plazo){
    var tasasDivs = document.getElementsByClassName('tasa-option');

    var i = 0;
    while(tasasDivs[i]){
        tasasDivs[i].setAttribute('class', 'tasa-option');
        ++i;
    }

    document.getElementById('tasa-option-' + tasaId).setAttribute('class', 'tasa-option selected');
    document.getElementById('tasa-radio-' + tasaId).click();
    localStorage.setItem('tasa_seleccionada',JSON.stringify({tasaId, interes, plazo}));
    document.getElementById('plan-cuotas-results').innerHTML = '';
}

function verificarTipoMoneda(caller){
    var msg = "";
    
    if(caller.value == 2){
        msg = "*El tipo de cambio es 6.96 Bs/$us";
    }

    document.getElementById('monto-msg').innerHTML = msg;
}

function obtenerTablaPlanCuotasTemplate(planCuotas){
    var html = "<table class=\"my-table\">"
    + "<tr>"
        + "<th># MES</th>"
        + "<th>CAPITAL</th>"
        + "<th>INTERESES</th>"
        + "<th>CUOTA</th>"
        + "<th>SALDO</th>"
    +"</tr>";

    planCuotas.forEach(function (planCuota){
        if(planCuotas.indexOf(planCuota) !== planCuotas.length - 1)
        {
            html += "<tr>"
            + "<td>" + planCuota.id + "</td>"
            + "<td>" + (planCuota.capital? planCuota.capital: "") + "</td>"
            + "<td>" + (planCuota.intereses? planCuota.intereses: "") + "</td>"
            + "<td>" + (planCuota.cuota? planCuota.cuota: "") + "</td>"
            + "<td>" + (planCuota.saldo !== undefined ? planCuota.saldo: "") + "</td>"
            +"</tr>";
        }
        else
        {
            html += "<tr>"
            + "<th>" + planCuota.id + "</th>"
            + "<th>" + (planCuota.capital? planCuota.capital: "") + "</th>"
            + "<th>" + (planCuota.intereses? planCuota.intereses: "") + "</th>"
            + "<th>" + (planCuota.cuota? planCuota.cuota: "") + "</th>"
            + "<th>" + (planCuota.saldo !== undefined ? planCuota.saldo: "") + "</th>"
            +"</tr>";
        }
    });

    html += "</table>";

    return html;
}
