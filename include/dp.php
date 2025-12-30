<?php
function testDBConnection($host, $user, $pass, $db) {
    try {
        $conn = mysqli_connect($host, $user, $pass, $db);
        mysqli_close($conn);
        return true;
    } catch (mysqli_sql_exception $e) {
        return false;
    }
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (testDBConnection($_POST['dbHost'], $_POST['dbUsername'], $_POST['dbPassword'], $_POST['dbName'])) {
        session_start();
        $_SESSION['db'] = [
            'host' => $_POST['dbHost'],
            'user' => $_POST['dbUsername'],
            'pass' => $_POST['dbPassword'],
            'name' => $_POST['dbName']
        ];

        header("Location: ../manegementSystem.html");
    } else {
        header("Location: ../index.php?dbError=1");
    }
    exit;
}

?>
