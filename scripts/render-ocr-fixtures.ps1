# Renders OCR test fixtures with System.Drawing (Windows, no extra dependencies).
#
# The output lives in scripts/fixtures/, which is gitignored — these are
# regenerable inputs, not source. Run this before the opt-in real-OCR test:
#
#   powershell -NoProfile -File scripts/render-ocr-fixtures.ps1
#   OCR_REAL=1 npx vitest run tests/ocrRealDocument.test.ts
#
# Why a rendered fixture rather than a checked-in scan: it is deterministic,
# tiny, and its ground truth is known exactly, so a reading-order assertion can
# be precise instead of fuzzy.

Add-Type -AssemblyName System.Drawing

$outDir = Join-Path $PSScriptRoot 'fixtures'
if (-not (Test-Path $outDir)) { New-Item -ItemType Directory -Path $outDir | Out-Null }

function New-Page {
    param([int]$Width, [int]$Height)
    $bmp = New-Object System.Drawing.Bitmap $Width, $Height
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.Clear([System.Drawing.Color]::White)
    $g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit
    return @{ Bitmap = $bmp; Graphics = $g }
}

# --- two-column.png -------------------------------------------------------
# Paragraph markers (ALPHA..FOXTROT) make reading order verifiable: correct
# output is all three left paragraphs, then all three right. Interleaved
# output would read ALPHA DELTA BRAVO ECHO CHARLIE FOXTROT.
$page = New-Page -Width 1240 -Height 900
$font = New-Object System.Drawing.Font('Arial', 20)
$brush = [System.Drawing.Brushes]::Black

$left = @(
    'ALPHA the quick brown fox jumps',
    'over the lazy dog and then it runs',
    'far away into the deep dark forest',
    '',
    'BRAVO a second paragraph begins',
    'here with several more words that',
    'continue across multiple lines now',
    '',
    'CHARLIE the third paragraph also',
    'has enough words to look like real',
    'body copy on a printed page here'
)
$right = @(
    'DELTA the right hand column starts',
    'with its own separate paragraph of',
    'text that flows independently now',
    '',
    'ECHO the second right paragraph',
    'continues with more running text',
    'to fill out the measure properly',
    '',
    'FOXTROT the final paragraph sits',
    'at the bottom of the right column',
    'with sufficient words to be prose'
)

$y = 80.0
foreach ($l in $left) { if ($l) { $page.Graphics.DrawString($l, $font, $brush, 70.0, $y) }; $y += 36.0 }
$y = 80.0
foreach ($l in $right) { if ($l) { $page.Graphics.DrawString($l, $font, $brush, 680.0, $y) }; $y += 36.0 }

$page.Graphics.Dispose()
$page.Bitmap.Save((Join-Path $outDir 'two-column.png'), [System.Drawing.Imaging.ImageFormat]::Png)
$page.Bitmap.Dispose()
Write-Output 'wrote two-column.png'

# --- invoice-table.png ----------------------------------------------------
# Short cells in aligned rows — the shape table detection must recognise, and
# must NOT confuse with a two-column text layout.
$page = New-Page -Width 1000 -Height 640
$bold = New-Object System.Drawing.Font('Arial', 20, [System.Drawing.FontStyle]::Bold)

$page.Graphics.DrawString('INVOICE', $bold, $brush, 60.0, 50.0)
$rows = @(
    @('Item', 'Qty', 'Price'),
    @('Widget', '12', '9.99'),
    @('Gadget', '7', '24.50'),
    @('Doohickey', '3', '5.00'),
    @('Bolt', '40', '0.25')
)
$y = 140.0
foreach ($r in $rows) {
    $page.Graphics.DrawString($r[0], $font, $brush, 60.0, $y)
    $page.Graphics.DrawString($r[1], $font, $brush, 460.0, $y)
    $page.Graphics.DrawString($r[2], $font, $brush, 700.0, $y)
    $y += 48.0
}
$page.Graphics.Dispose()
$page.Bitmap.Save((Join-Path $outDir 'invoice-table.png'), [System.Drawing.Imaging.ImageFormat]::Png)
$page.Bitmap.Dispose()
Write-Output 'wrote invoice-table.png'

# --- skewed-noisy.png -----------------------------------------------------
# A deliberately degraded page: rotated ~4 degrees, low contrast (grey ink on
# grey paper), and salt-and-pepper speckle. This is the fixture that measures
# whether preprocessing actually earns its cost, rather than assuming it does.
$page = New-Page -Width 1000 -Height 700
$font2 = New-Object System.Drawing.Font('Arial', 22)

# Rotate about the centre before drawing, so the text itself is skewed.
$page.Graphics.TranslateTransform(500.0, 350.0)
$page.Graphics.RotateTransform(4.0)
$page.Graphics.TranslateTransform(-500.0, -350.0)

# Grey ink on light-grey paper -> a narrow contrast range.
$page.Graphics.Clear([System.Drawing.Color]::FromArgb(215, 215, 215))
$greyBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(105, 105, 105))
$body = @(
    'The quick brown fox jumps over the lazy dog',
    'Pack my box with five dozen liquor jugs',
    'How vexingly quick daft zebras jump',
    'Sphinx of black quartz judge my vow',
    'The five boxing wizards jump quickly',
    'Bright vixens jump dozy fowl quack'
)
$y = 120.0
foreach ($l in $body) { $page.Graphics.DrawString($l, $font2, $greyBrush, 120.0, $y); $y += 60.0 }
$page.Graphics.ResetTransform()
$page.Graphics.Dispose()

# Add speckle after drawing so it is not rotated with the text.
$bmp = $page.Bitmap
$rand = New-Object System.Random 12345
for ($i = 0; $i -lt 4000; $i++) {
    $px = $rand.Next(0, $bmp.Width)
    $py = $rand.Next(0, $bmp.Height)
    $v = if ($rand.Next(0, 2) -eq 0) { 0 } else { 255 }
    $bmp.SetPixel($px, $py, [System.Drawing.Color]::FromArgb($v, $v, $v))
}
$bmp.Save((Join-Path $outDir 'skewed-noisy.png'), [System.Drawing.Imaging.ImageFormat]::Png)

# Also emit a raw RGBA dump so tests can build a Raster without a PNG decoder.
$w = $bmp.Width; $h = $bmp.Height
$bytes = New-Object 'System.Byte[]' ($w * $h * 4)
for ($py = 0; $py -lt $h; $py++) {
    for ($px = 0; $px -lt $w; $px++) {
        $c = $bmp.GetPixel($px, $py)
        $o = (($py * $w) + $px) * 4
        $bytes[$o] = $c.R; $bytes[$o + 1] = $c.G; $bytes[$o + 2] = $c.B; $bytes[$o + 3] = 255
    }
}
[System.IO.File]::WriteAllBytes((Join-Path $outDir 'skewed-noisy.raw'), $bytes)
"$w x $h" | Out-File -FilePath (Join-Path $outDir 'skewed-noisy.dim') -Encoding ascii
$bmp.Dispose()
Write-Output 'wrote skewed-noisy.png + .raw'

# --- figure-page ----------------------------------------------------------
# Text with a photograph and a signature-like scrawl. Exercises non-text region
# detection: the figure must be found, and the body text must NOT be.
$page = New-Page -Width 900 -Height 1200
$font3 = New-Object System.Drawing.Font('Arial', 20)
$body3 = @(
    'This report contains a photograph below',
    'along with several lines of ordinary text',
    'that must not be mistaken for an image',
    'by the non-text region detector at all'
)
$y = 80.0
foreach ($l in $body3) { $page.Graphics.DrawString($l, $font3, $brush, 70.0, $y); $y += 40.0 }

# A "photograph": a filled block with internal variation.
$rand2 = New-Object System.Random 777
for ($by = 320; $by -lt 720; $by += 8) {
    for ($bx = 120; $bx -lt 720; $bx += 8) {
        $g = $rand2.Next(20, 120)
        $sb = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb($g, $g, $g))
        $page.Graphics.FillRectangle($sb, $bx, $by, 8, 8)
        $sb.Dispose()
    }
}

# More text below the figure.
$y = 780.0
foreach ($l in @('Figure 1 shows the assembled unit', 'as described in the section above')) {
    $page.Graphics.DrawString($l, $font3, $brush, 70.0, $y); $y += 40.0
}

# A signature-like scrawl, low and wide.
$pen = New-Object System.Drawing.Pen ([System.Drawing.Color]::Black), 3
for ($i = 0; $i -lt 40; $i++) {
    $x1 = 520 + $i * 8
    $y1 = 1060 + [Math]::Sin($i / 3.0) * 22
    $x2 = 520 + ($i + 1) * 8
    $y2 = 1060 + [Math]::Sin(($i + 1) / 3.0) * 22
    $page.Graphics.DrawLine($pen, [float]$x1, [float]$y1, [float]$x2, [float]$y2)
}
$pen.Dispose()
$page.Graphics.Dispose()

$bmp2 = $page.Bitmap
$bmp2.Save((Join-Path $outDir 'figure-page.png'), [System.Drawing.Imaging.ImageFormat]::Png)
$w2 = $bmp2.Width; $h2 = $bmp2.Height
$bytes2 = New-Object 'System.Byte[]' ($w2 * $h2 * 4)
for ($py = 0; $py -lt $h2; $py++) {
    for ($px = 0; $px -lt $w2; $px++) {
        $c = $bmp2.GetPixel($px, $py)
        $o = (($py * $w2) + $px) * 4
        $bytes2[$o] = $c.R; $bytes2[$o + 1] = $c.G; $bytes2[$o + 2] = $c.B; $bytes2[$o + 3] = 255
    }
}
[System.IO.File]::WriteAllBytes((Join-Path $outDir 'figure-page.raw'), $bytes2)
"$w2 x $h2" | Out-File -FilePath (Join-Path $outDir 'figure-page.dim') -Encoding ascii
$bmp2.Dispose()
Write-Output 'wrote figure-page.png + .raw'
