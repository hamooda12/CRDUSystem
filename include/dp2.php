<?php
session_start();

if (!isset($_SESSION['db'])) {
    die("No database connection");
}

$db = $_SESSION['db'];

$conn = mysqli_connect($db['dbHost'], $db['dbUsername'], $db['dbPassword'], $db['dbName']);

if (!$conn) {
    die("DB connection failed");
}
