<?php
if (isset($_GET["pc"])) {
    $pc = $_GET["pc"];
    
    // Comando SSH para apagar la PC
    $comando = "ssh usuario@" . $pc . " 'shutdown -s -t 0'";
    shell_exec($comando);
    
    echo "Se envió la orden de apagado a " . $pc;
} else {
    echo "Error: No se especificó una PC.";
}
?>
