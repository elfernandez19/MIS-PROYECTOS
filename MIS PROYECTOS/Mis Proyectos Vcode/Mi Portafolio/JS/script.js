
function sumar() {
    console.log("Hola, CODFAV");
    // Obtener los valores de los campos de entrada

    var numero1 = document.getElementById("numero1").value;
    var numero2 = document.getElementById("numero2").value;
    // Convertir los valores a números y realizar la suma
    
    var suma = parseFloat(numero1) + parseFloat(numero2);
    // Imprimir el resultado en la consola

    console.log(suma);
    // Mostrar el resultado en la página

    document.getElementById("suma").innerHTML = "La suma es: " + suma;
    // También puedes usar alert para mostrar el resultado
    // alert("La suma es: " + suma);
} 

function limpiar() {

    document.getElementById("numero1").value = "";
    document.getElementById("numero2").value = "";
    document.getElementById("suma").innerHTML = "";
}


    