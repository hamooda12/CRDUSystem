<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');
session_start();

$db = $_SESSION['db'] ?? null;

if (!$db) {
    echo json_encode([
        'success' => false,
        'message' => 'No database info'
    ]);
    exit;
}


$conn = mysqli_connect(
    $db['host'],
    $db['user'],
    $db['pass'],
    $db['name']
);

if (!$conn) {
    echo json_encode([
        'success' => false,
        'message' => 'DB connection failed'
    ]);
    exit;
}


$input = json_decode(file_get_contents("php://input"), true);

if (!isset($input['table']) || !isset($input['data']) || !isset($input['where'])) {
    echo json_encode(["success" => false, "message" => "Missing parameters"]);
    exit;
}

$table = $input['table'];
$data = $input['data'];
$where = $input['where'];


$setParts = [];
foreach ($data as $col => $val) {
    $val = mysqli_real_escape_string($conn, $val);
    $setParts[] = "`$col` = '$val'";
}
$setSql = implode(", ", $setParts);

$whereParts = [];
foreach ($where as $col => $val) {
    $val = mysqli_real_escape_string($conn, $val);
    $whereParts[] = "`$col` = '$val'";
}
$whereSql = implode(" AND ", $whereParts);


$sql = "UPDATE `$table` SET $setSql WHERE $whereSql";


if (mysqli_query($conn, $sql)) {
    echo json_encode([
        "success" => true,
        "message" => "Updated successfully",
        "query" => $sql
    ]);
} else {
    echo json_encode([
        "success" => false,
        "message" => mysqli_error($conn)
    ]);
}
