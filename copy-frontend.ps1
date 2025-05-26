$sourceDir = "C:\Users\hackw\Desktop\HIRESENSEAI FINAL\Hackhazards-Final-Project"
$targetDir = "C:\Users\hackw\Desktop\HireSenseAI"

# Function to copy a directory with overwrite
function Copy-DirectoryWithOverwrite {
    param (
        [string]$Source,
        [string]$Destination
    )
    
    if (-not (Test-Path -Path $Destination)) {
        New-Item -ItemType Directory -Path $Destination -Force | Out-Null
    }
    
    Get-ChildItem -Path $Source -Recurse | ForEach-Object {
        $targetPath = $_.FullName.Replace($Source, $Destination)
        
        if ($_.PSIsContainer) {
            if (-not (Test-Path -Path $targetPath)) {
                New-Item -ItemType Directory -Path $targetPath -Force | Out-Null
            }
        } else {
            Copy-Item -Path $_.FullName -Destination $targetPath -Force
        }
    }
}

# Directories to copy
$directories = @(
    "app",
    "components",
    "public",
    "styles"
)

# Copy each directory
foreach ($dir in $directories) {
    $sourcePath = Join-Path -Path $sourceDir -ChildPath $dir
    $targetPath = Join-Path -Path $targetDir -ChildPath $dir
    
    if (Test-Path -Path $sourcePath) {
        Write-Host "Copying $dir directory..."
        Copy-DirectoryWithOverwrite -Source $sourcePath -Destination $targetPath
    } else {
        Write-Host "Source directory $dir not found, skipping..."
    }
}

# Copy configuration files
$configFiles = @(
    "next.config.mjs",
    "tailwind.config.ts",
    "components.json",
    "postcss.config.mjs"
)

foreach ($file in $configFiles) {
    $sourceFile = Join-Path -Path $sourceDir -ChildPath $file
    $targetFile = Join-Path -Path $targetDir -ChildPath $file
    
    if (Test-Path -Path $sourceFile) {
        Write-Host "Copying $file..."
        Copy-Item -Path $sourceFile -Destination $targetFile -Force
    } else {
        Write-Host "Source file $file not found, skipping..."
    }
}

Write-Host "Frontend files copied successfully!" 