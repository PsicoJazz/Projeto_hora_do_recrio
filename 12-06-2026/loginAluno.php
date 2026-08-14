<?php
include("conexao.php");

$ra = $_POST['ra'];
$senha = $_POST['senha'];

// Consulta no banco
$sql = "SELECT * FROM alunos WHERE ra = '$ra' AND senha = '$senha'";

$result = $conn->query($sql);

if ($result->num_rows > 0) {
    // login correto
    header("Location: indexAl.html");
    exit();
} else {
    echo "RA ou senha incorretos!";
}
?>