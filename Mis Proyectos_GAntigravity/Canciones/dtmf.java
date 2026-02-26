import javax.swing.JOptionPane; // Esta clase del paquete javax.swing permite mostrar cuadros de diálogo

public class dtmf {
    public static void main(String[] args) {
        // Delimitados por comas
        String[] letra = {
            "Debí tirar más fotos de cuando te tuve",
            "Debí darte más besos y abrazos las veces que pude",
            "Ey, ojalá que los míos nunca se muden",
            "Y si hoy me emborracho, pues, que me ayuden",
            "Debí tirar más fotos de cuando te tuve",
            "Debí darte más besos y abrazos las veces que pude",
            "Ojalá que los míos nunca se muden",
            "Y si hoy me emborracho, pues, que me ayuden",
            "Ey, hoy vo'a estar con abuelo to el día jugando dominó",
            "Si me pregunta si aún pienso en ti, yo le digo que no",
            "Que mi estadía cerquita de ti ya se terminó",
            "Ya se terminó"
        };
        for (String l : letra) {
            System.out.println(l);
            try {
                Thread.sleep(2000);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
        }
    }       
}   


