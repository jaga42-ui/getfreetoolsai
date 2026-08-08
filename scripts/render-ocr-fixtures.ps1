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
