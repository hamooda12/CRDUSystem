<?php
header('Content-Type: application/json');
session_start();

/* =======================
   Check DB Session
======================= */
$db = $_SESSION['db'] ?? null;

if (!$db) {
    echo json_encode([
        'success' => false,
        'message' => 'No database info'
    ]);
    exit;
}

/* =======================
   DB Connection
======================= */
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

/* =======================
   Helper: check unique column
======================= */
function isUniqueColumn($conn, $dbName, $table, $column) {
    $q = "
    SELECT COUNT(*) AS cnt
    FROM INFORMATION_SCHEMA.STATISTICS
    WHERE
        TABLE_SCHEMA = '$dbName'
        AND TABLE_NAME = '$table'
        AND COLUMN_NAME = '$column'
        AND NON_UNIQUE = 0
    ";
    $r = mysqli_query($conn, $q);
    $row = mysqli_fetch_assoc($r);
    return $row['cnt'] > 0;
}

/* =======================
   Tables / Columns / Data
======================= */
$tablesResult = mysqli_query($conn, "SHOW TABLES");
$tables = [];

while ($tableRow = mysqli_fetch_array($tablesResult)) {
    $tableName = $tableRow[0];

    // columns
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

    // data
    $dataResult = mysqli_query($conn, "SELECT * FROM `$tableName`");
    $data = [];

    while ($row = mysqli_fetch_assoc($dataResult)) {
        $data[] = $row;
    }

    $tables[] = [
        'table' => $tableName,
        'columns' => $columns,
        'data' => $data
    ];
}

/* =======================
   Foreign Keys
======================= */
$fkQuery = "
SELECT
    kcu.TABLE_NAME AS table_name,
    kcu.COLUMN_NAME AS column_name,
    kcu.REFERENCED_TABLE_NAME AS referenced_table,
    kcu.REFERENCED_COLUMN_NAME AS referenced_column
FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE kcu
WHERE
    kcu.TABLE_SCHEMA = '{$db['name']}'
    AND kcu.REFERENCED_TABLE_NAME IS NOT NULL
";

$fkResult = mysqli_query($conn, $fkQuery);
$foreignKeys = [];

while ($row = mysqli_fetch_assoc($fkResult)) {
    $foreignKeys[] = $row;
}

/* =======================
   Classify Relations
======================= */
$relations = [
    'one_to_one' => [],
    'one_to_many' => [],
    'many_to_many' => []
];

$tableFKMap = [];

// One-to-One / One-to-Many
foreach ($foreignKeys as $fk) {

    $isUnique = isUniqueColumn(
        $conn,
        $db['name'],
        $fk['table_name'],
        $fk['column_name']
    );

    if ($isUnique) {
        $relations['one_to_one'][] = [
            'table' => $fk['table_name'],
            'column' => $fk['column_name'],
            'references_table' => $fk['referenced_table'],
            'references_column' => $fk['referenced_column']
        ];
    } else {
        $relations['one_to_many'][] = [
            'table' => $fk['table_name'],
            'column' => $fk['column_name'],
            'references_table' => $fk['referenced_table'],
            'references_column' => $fk['referenced_column']
        ];
    }

    $tableFKMap[$fk['table_name']][] = $fk;
}

// Many-to-Many (junction tables)
foreach ($tableFKMap as $table => $fks) {
    if (count($fks) === 2) {
        $relations['many_to_many'][] = [
            'junction_table' => $table,
            'relations' => [
                [
                    'column' => $fks[0]['column_name'],
                    'references_table' => $fks[0]['referenced_table'],
                    'references_column' => $fks[0]['referenced_column']
                ],
                [
                    'column' => $fks[1]['column_name'],
                    'references_table' => $fks[1]['referenced_table'],
                    'references_column' => $fks[1]['referenced_column']
                ]
            ]
        ];
    }
}

/* =======================
   Final Response
======================= */
echo json_encode([
    'success' => true,
    'database' => $db['name'],
    'tables' => $tables,
    'relations' => $relations
], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);

mysqli_close($conn);
