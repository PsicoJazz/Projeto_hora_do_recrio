<?php
include("conexao.php");

$email = $_POST['email'];
$senha = $_POST['senha'];

// consulta no banco
$sql = "SELECT * FROM administrador 
        WHERE email = '$email' 
        AND senha = '$senha'";

$result = $conn->query($sql);

if ($result->num_rows > 0) {
    echo "Login realizado com sucesso!";
} else {
    echo "Email ou senha incorretos!";
}
?>