<?php
session_start();
$conexion = new mysqli("localhost", "root", "", "cyber_control");

$data = json_decode(file_get_contents("php://input"));

$usuario = $data->usuario;
$password = hash("sha256", $data->password);

$sql = "SELECT * FROM usuarios WHERE usuario = ? AND password = ?";
$stmt = $conexion->prepare($sql);
$stmt->bind_param("ss", $usuario, $password);
$stmt->execute();
$resultado = $stmt->get_result();

if ($resultado->num_rows == 1) {
    $_SESSION["usuario"] = $usuario;
    echo json_encode(["status" => "success"]);
} else {
    echo json_encode(["status" => "error", "message" => "Usuario o contraseña incorrectos."]);
}
?>
