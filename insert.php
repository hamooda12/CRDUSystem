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

if (!isset($input['table']) || !isset($input['data'])) {
    echo json_encode(["success" => false, "message" => "Missing parameters"]);
    exit;
}

$table = $input['table'];
$data  = $input['data'];

/* تجهيز الأعمدة والقيم */
$columns = [];
$values  = [];

foreach ($data as $col => $val) {
    $columns[] = "`$col`";
    $val = mysqli_real_escape_string($conn, $val);
    $values[] = "'$val'";
}

$columnsSql = implode(", ", $columns);
$valuesSql  = implode(", ", $values);

/* بناء الاستعلام */
$sql = "INSERT INTO `$table` ($columnsSql) VALUES ($valuesSql)";

/* التنفيذ */
if (mysqli_query($conn, $sql)) {
    echo json_encode([
        "success" => true,
        "message" => "Inserted successfully",
        "insert_id" => mysqli_insert_id($conn),
        "query" => $sql
    ]);
} else {
    echo json_encode([
        "success" => false,
        "message" => mysqli_error($conn)
    ]);
}
