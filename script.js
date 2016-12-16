//la función para añadir los listeners a td.celda
window.onload = function () {
    var celdas = document.querySelectorAll('#tabla-sudoku .celda');
    for (var i=0; i < celdas.length; i++)
    {
        var celda = celdas[i];
        if (0 == celda.id.indexOf("cel-"))
        {
            celda.onclick = function() { celdaActive(this) };
        }
    }
}

//la función para activar la tecla cuando pinchamos con raton
function celdaActive(obj) {
    if(document.querySelector(".active"))
    {   
        document.querySelector(".active").classList.remove("active");
        if (!obj.classList.contains("active")) obj.classList.add("active");
        
        //para ver si existen los mismos valores
        //!!! lo comento, quizás no sea necesario procesar de aquí !!!
        //procesarCeldas(obj);
    }          
}

//añadir el listener de teclado a toda la página
addEventListener("keydown", tecladoListener);

//la función moverse por sudoku por las flechas, se ejecuta de la funcíon tecladoListener(ev)
function celdaActiveTeclado(obj, curso) {
    if(document.querySelector(".active"))
    {   
        var letras = ["A", "B", "C", "D", "E", "F", "G", "H", "I"];
        
        //veremos de donde venimos
        var nombreClaseArray = obj.id.split("-");
        var letra = nombreClaseArray[1];
        var numero = parseInt(nombreClaseArray[2]);

//aquí en cada case existen los trucos para aparecerse de otro lado de la tabla
        switch (curso) {
            //si se mueve a la izquerda
            case 1:
                var numeroNuevo = numero - 1;
                if (numeroNuevo == 0) numeroNuevo = 9;
                nombreClaseArray[2] = numeroNuevo;
                break;
            //si se mueve arriba
            case 2:
                if (letras.indexOf(letra) == 0) {
                    var letraNueva = letras[8];
                }
                else {
                    var letraNueva = letras[letras.indexOf(letra) - 1]; 
                }
                nombreClaseArray[1] = letraNueva;
                break;
            //si se mueve a la derecha                
            case 3:
                var numeroNuevo = numero + 1;
                if (numeroNuevo == 10) numeroNuevo = 1;
                nombreClaseArray[2] = numeroNuevo;
                break;
            //si se mueve abajo                
            case 4:
                if (letras.indexOf(letra) == 8) {
                    var letraNueva = letras[0];
                }
                else {
                    var letraNueva = letras[letras.indexOf(letra) + 1]; 
                }
                nombreClaseArray[1] = letraNueva;
                break;       
        }
        
        //movemos a nueva celda
        nombreClaseArray = nombreClaseArray.join("-");
        var objNuevo = document.getElementById(nombreClaseArray);
        obj.classList.remove("active");
        if (!objNuevo.classList.contains("active")) objNuevo.classList.add("active");
    }          
}

//la función de escuchar cuando se pincha una tecla
function tecladoListener(ev) {
    ev = ev || event;
    var clase = document.querySelector(".active");
    if(clase)
    {
        var keyValor = ev.key;
        var keyCodigo = ev.keyCode;
        
        //está prohibido usar teclas controles
        if (ev.ctrlKey || ev.altKey || ev.shiftKey) return;
        
        //para los números digitales
        if ((keyCodigo >= 49 && keyCodigo <= 57) || (keyCodigo >= 97 && keyCodigo <= 105))
        {
            //para ver si quedan celdas con los mismos valores, antes que cambiar el valor antigua y procesarlas
            procesarCeldasEliminar(clase, keyValor);
            //para ver si existen los mismos valores
            procesarCeldas(clase);
        }
        
        //para vaciar todo sudoku
        else if (keyCodigo == 67)
        {
            var celdas = document.querySelectorAll('#tabla-sudoku .celda');
            for (var i=0; i < celdas.length; i++)
            {
                celdas[i].innerHTML="";
                if (celdas[i].classList.contains("error"))
                {
                    celdas[i].classList.remove("error");    
                }
            }
        }
        
        //para teclas del y backspace
        else if (keyCodigo == 8 || keyCodigo == 46)
        {
            //para ver si quedan los mismos valores, antes que borrar el valor antigua
            //y enviamos nuevo valor "" para cambiar
            procesarCeldasEliminar(clase, "");
            if (clase.classList.contains("error")) clase.classList.remove("error");
            //negamos las teclaspor defecto
            ev.preventDefault();
            ev.stopPropagation();
        }
        
        //tecla a la izquerda
        else if (keyCodigo == 37)
        {
            celdaActiveTeclado(clase,1);
            ev.preventDefault();
            ev.stopPropagation();
        }
                
        //tecla arriba
        else if (keyCodigo == 38)
        {
            celdaActiveTeclado(clase,2);
            ev.preventDefault();
            ev.stopPropagation();
        }     
        
        //tecla a la derecha
        else if (keyCodigo == 39)
        {
            celdaActiveTeclado(clase,3);
            ev.preventDefault(); 
            ev.stopPropagation();
        }        
        
        //tecla abajo
        else if (keyCodigo == 40)
        {
            celdaActiveTeclado(clase,4);
            ev.preventDefault();
            ev.stopPropagation();
        }
        else return;
    }
}

//la función para comprobar si existen en las celdas "relacionadas" los mismos valores para ponerlos a ".error"
function procesarCeldas(obj) {
    var claseValor = obj.innerHTML;

    if (claseValor) {

        //rompemos el nombre de la clase, para obtener parametro "fila" y "columno"
        //o bien se puede obtener las filas y los columnos usando id (p.e. "cel-A-3") y por la mascara en bucle encontrar todos (p.e. document.getElementById("cel-"+VARIABLE+"-3") nos da todos elementos del columno 3, habrá que pasar al bucle un array de [A,B,C,D,E,F,G,H,I]) o bien (p.e. document.getElementById("cel-A-"+VARIABLE) nos da todos elementos de la fila A, habrá que procesar del 1 a 9)
        var nombreClaseArray = obj.className;
        var filaActualClase = "." + nombreClaseArray.split(" ")[1];
        var columnoActualClase = "." + nombreClaseArray.split(" ")[2];

        var igualesCantidad = 0;
        
        //validamos la tabla de vecinos 3x3
        var vecinosArray = obj.parentNode.parentNode.querySelectorAll(".celda");
        validation(vecinosArray);
        
        //validamos la fila donde esta la celda activada
        vecinosArray = document.querySelectorAll(filaActualClase);
        validation(vecinosArray);
        
        //validamos el columno donde está la celda activada
        vecinosArray = document.querySelectorAll(columnoActualClase);
        validation(vecinosArray);
      
        //esta función común para validar los grupos de celdas
        function validation(vecinosArray){
            
            for (var i=0; i < vecinosArray.length; i++)
            {
                var vecino = vecinosArray[i];
        
                if ((vecino.innerHTML == claseValor) && (vecino.id != obj.id) && (vecino.innerHTML != ""))
                {
                    //si las celdas tienen los mismos valores los ponemos la clase "error"
                    if (!obj.classList.contains("error")) obj.classList.add("error");
                    if (!vecino.classList.contains("error")) vecino.classList.add("error");
                    igualesCantidad++;
                }
            }  
        }
        
        //si no existen más los mismos valores, borramos a carateristica error a esta celda
        //en caso si la celda tenía "error" antes
        if (igualesCantidad == 0)
        {
            if (obj.classList.contains("error")) obj.classList.remove("error");
        }
    }
}

//la función para comprobar si quedan en las celdas "relacionadas" los mismos valores, hay que hacerlo antes de cambiar el valor antigua a nuevo valor
function procesarCeldasEliminar(obj, valorNuevo) {
    //cogemos el valor antigua
    var claseValor = obj.innerHTML;

    //cambiamos valor a nuevo
    obj.innerHTML = valorNuevo;

    //aray para las celdas con valor que borramos para manejar las celdas con este valor
    var arrayDublicates = [];
    
    //rompemos el nombre de la clase, para obtener parametro "fila" y "columno"
    //o bien se puede obtener las filas y los columnos usando id (p.e. "cel-A-3") y por la mascara en bucle encontrar todos (p.e. document.getElementById("cel-"+VARIABLE+"-3") nos da todos elementos del columno 3, habrá que pasar al bucle un array de [A,B,C,D,E,F,G,H,I]) o bien (p.e. document.getElementById("cel-A-"+VARIABLE) nos da todos elementos de la fila A, habrá que procesar del 1 a 9)
    var nombreClaseArray = obj.className;
    var filaActualClase = "." + nombreClaseArray.split(" ")[1];
    var columnoActualClase = "." + nombreClaseArray.split(" ")[2];
    
    //validamos la tabla de vecinos 3x3
    var vecinosArray = obj.parentNode.parentNode.querySelectorAll(".celda");
    validation(vecinosArray);
    
    //validamos la fila donde esta la celda activada
    vecinosArray = document.querySelectorAll(filaActualClase);
    validation(vecinosArray);

    
    //validamos la fila donde esta la celda activada
    vecinosArray = document.querySelectorAll(columnoActualClase);
    validation(vecinosArray);
    
    //esta función común para validar los grupos de celdas
    function validation(vecinosArray){  
        for (var i=0; i < vecinosArray.length; i++)
        {
            var vecino = vecinosArray[i];
        
            if ((vecino.innerHTML == claseValor) && (vecino.id != obj.id) && (vecino.innerHTML != ""))
            {
                //si las celdas tienen los mismos valores los cogemos a un array para procesar
                arrayDublicates.push(vecino);
            }
        }
    }
    
    //cogemos array de iguales celdas que debemos procesar para saber que borramos las relaciones antiguas, borramos duplicates y procesamos las celdas
    var arrayParaProcessar = getUnique(arrayDublicates);
    for (var i=0; i<arrayParaProcessar.length; i++)
    {
        procesarCeldas(arrayParaProcessar[i]);
        
    }
}

//la funciñon elimina los duplicates del array
getUnique = function (arr) {
    var current,
    length = arr.length,
    unique = [];
    for (var i = 0; i < length; i++) {
      current = arr[i];
      if (!~unique.indexOf(current)) {
        unique.push(current);
      }
    }
    return unique;
  };