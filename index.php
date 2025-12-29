<?php
$hasDBError = isset($_GET['dbError']) && $_GET['dbError'] == 1;
$message=$hasDBError?"There is no database":"";
?>
<!DOCTYPE html>
<html lang="en" dir="ltr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Database Connection</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&family=Poppins:wght@300;400;500;600&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="assets/css/style.css">
  
</head>
<body>
    <div class="container">
        <header>
            <h1><i class="fas fa-database"></i>Islamic Database Setup</h1>
            <div class="pattern-divider"></div>
            <p class="subtitle">Connect your MySQL database to enable dynamic table creation and data management</p>
        </header>
        
        <div class="explanation-box">
            <p>This website allows you to create dynamic tables and manage your data (Add, Update, Delete) by entering your database connection details. Your information is processed securely on your device.</p>
        </div>
        
        <div class="form-container">
            <h2 class="form-title"><i class="fas fa-server"></i>Database Connection Details</h2>
            
            <!-- Messages will appear here -->
            <div id="successMessage" class="message success-message">
                <i class="fas fa-check-circle"></i> Database connection details saved successfully!
            </div>
            
            <div id="errorMessage" class="message error-message">
                <i class="fas fa-exclamation-circle"></i> <?php echo($message)?>
            </div>
            
            <form id="dbConnectionForm" action="include/dp.php" method="post">
                <div class="form-group">
                    <label for="dbHost">Database Host</label>
                    <div class="input-with-icon">
                        <i class="fas fa-network-wired"></i>
                        <input type="text" id="dbHost" name="dbHost" class="form-control" placeholder="e.g., localhost" required>
                    </div>
                    <div class="hint-text">Typically "localhost" for local development servers</div>
                </div>
                
                <div class="form-group">
                    <label for="dbUsername">Database Username</label>
                    <div class="input-with-icon">
                        <i class="fas fa-user"></i>
                        <input type="text" id="dbUsername" name="dbUsername" class="form-control" placeholder="e.g., root" required>
                    </div>
                    <div class="hint-text">Usually "root" for local development environments</div>
                </div>
                
                <div class="form-group">
                    <label for="dbPassword">Database Password</label>
                    <div class="input-with-icon">
                        <i class="fas fa-lock"></i>
                        <input type="password" id="dbPassword" name="dbPassword" class="form-control" placeholder="Enter your database password">
                    </div>
                    <div class="password-note">
                        <i class="fas fa-info-circle"></i> The password is usually empty in development environments. Leave blank if not required.
                    </div>
                </div>
                
                <div class="form-group">
                    <label for="dbName">Database Name</label>
                    <div class="input-with-icon">
                        <i class="fas fa-database"></i>
                        <input type="text" id="dbName" name="dbName" class="form-control" placeholder="e.g., my_database" required>
                    </div>
                    <div class="hint-text">The name of the database you want to work with</div>
                </div>
                
                <button type="submit" class="submit-btn">
                    <i class="fas fa-plug"></i> Connect to Database
                </button>
            </form>
        </div>
        
        <footer>
            <p>Secure Database Connection Setup</p>
            <p class="footer-note">Your database credentials are processed securely. No data is transmitted to external servers. This page is for configuration purposes only.</p>
        </footer>
    </div>
<script>
    const dbError = <?php echo $hasDBError ? 'true' : 'false'; ?>;
   
</script>
    <script src="assets/javaScript/main.js">
        
    </script>
</body>
</html>