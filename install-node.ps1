$url = "https://nodejs.org/dist/v20.18.0/node-v20.18.0-x64.msi"
$output = "$env:TEMP\nodejs_install.msi"

Write-Host "Downloading Node.js v20.18.0 LTS..."
Invoke-WebRequest -Uri $url -OutFile $output

Write-Host "Installing Node.js..."
Start-Process msiexec.exe -ArgumentList "/i", $output, "/quiet", "/norestart" -Wait

Write-Host "Done! Refreshing PATH..."
$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")

Write-Host "Checking installation:"
& node --version
& npm --version
