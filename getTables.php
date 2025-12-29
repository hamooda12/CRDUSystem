<?php
header('Content-Type: application/json');
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

$tablesResult = mysqli_query($conn, "SHOW TABLES");

$response = [];

while ($tableRow = mysqli_fetch_array($tablesResult)) {
    $tableName = $tableRow[0];


    $columnsResult = mysqli_query($conn, "DESCRIBE `$tableName`");
    $columns = [];

    while ($col = mysqli_fetch_assoc($columnsResult)) {
        $columns[] = [
            'name' => $col['Field'],
            'type' => $col['Type'],
            'null' => $col['Null'],
            'key'  => $col['Key'],
            'default' => $col['Default'],
            'extra' => $col['Extra']
        ];
    }

 
    $dataResult = mysqli_query($conn, "SELECT * FROM `$tableName`");
    $data = [];

    while ($row = mysqli_fetch_assoc($dataResult)) {
        $data[] = $row;
    }

 
    $response[] = [
        'table' => $tableName,
        'columns' => $columns,
        'data' => $data
    ];
}

echo json_encode([
    'success' => true,
    'database' => $db['name'],
    'tables' => $response
], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);

mysqli_close($conn);
