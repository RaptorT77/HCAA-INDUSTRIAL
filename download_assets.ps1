[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
$targetDir = "c:\HCAA-INDUSTRIAL\site_assets"
if (!(Test-Path $targetDir)) { New-Item -ItemType Directory -Path $targetDir -Force }

$files = @(
    "https://hcaa.com.mx/wp-content/uploads/2025/06/Banner1.png",
    "https://hcaa.com.mx/wp-content/uploads/2025/06/MigMagW.png",
    "https://hcaa.com.mx/wp-content/uploads/2025/06/DisenoElectricoW.png",
    "https://hcaa.com.mx/wp-content/uploads/2025/06/ProgramacionPLCW.png",
    "https://hcaa.com.mx/wp-content/uploads/2025/06/cropped-Icon_HCAA-removebg-preview.png",
    "https://hcaa.com.mx/wp-content/uploads/2025/06/Clientes.png",
    "https://hcaa.com.mx/wp-content/uploads/2025/06/MontajeW.png"
)

foreach ($url in $files) {
    $filename = $url.Split("/")[-1]
    $dest = Join-Path $targetDir $filename
    Write-Output "Downloading $url to $dest..."
    try {
        Invoke-WebRequest -Uri $url -OutFile $dest -UseBasicParsing
    } catch {
        Write-Error "Failed to download $url : $_"
    }
}
