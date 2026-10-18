Add-Type -AssemblyName System.Drawing

$srcPath = Join-Path $PSScriptRoot "..\public\images\running_man_logo.png"
$dstPath = Join-Path $PSScriptRoot "..\public\images\running_man_logo_transparent.png"

$src = [System.Drawing.Bitmap]::new($srcPath)
$width = $src.Width
$height = $src.Height

$dst = New-Object System.Drawing.Bitmap($width, $height, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)

for ($y = 0; $y -lt $height; $y++) {
    for ($x = 0; $x -lt $width; $x++) {
        $c = $src.GetPixel($x, $y)
        $r = [int]$c.R
        $g = [int]$c.G
        $b = [int]$c.B
        $minRgb = [Math]::Min($r, [Math]::Min($g, $b))
        
        # Nếu là nền trắng tinh hoặc gần trắng
        if ($minRgb -ge 248) {
            $dst.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(0, 0, 0, 0))
        } elseif ($minRgb -ge 215) {
            # Vùng viền chuyển tiếp mượt mà chống răng cưa
            $alpha = [int](255 * (248 - $minRgb) / (248 - 215))
            if ($alpha -lt 0) { $alpha = 0 }
            if ($alpha -gt 255) { $alpha = 255 }
            $dst.SetPixel($x, $y, [System.Drawing.Color]::FromArgb($alpha, $r, $g, $b))
        } else {
            $dst.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(255, $r, $g, $b))
        }
    }
}

$dst.Save($dstPath, [System.Drawing.Imaging.ImageFormat]::Png)
$src.Dispose()
$dst.Dispose()

Write-Host "✅ Đã tạo thành công logo nền trong suốt tại: $dstPath"
