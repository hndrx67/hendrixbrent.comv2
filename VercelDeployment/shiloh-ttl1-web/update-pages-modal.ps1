# PowerShell script to update all HTML files to use audio-modal.js

$files = @(
    "learning-objectives.html",
    "morpheme-types.html",
    "examples.html",
    "activity.html",
    "conclusion.html"
)

foreach ($file in $files) {
    $filePath = "c:\Users\User\Documents\Websites\Shiloh\$file"
    
    if (Test-Path $filePath) {
        Write-Host "Updating $file..." -ForegroundColor Green
        
        # Read the file content
        $content = Get-Content $filePath -Raw -Encoding UTF8
        
        # Remove the modal HTML (from line 12 to line 64)
        $pattern = '(?s)<body>\s*<!-- Music Player Modal -->.*?<!-- Loading Screen -->'
        $replacement = '<body>' + [Environment]::NewLine + '    <!-- Loading Screen -->'
        $content = $content -replace $pattern, $replacement
        
        # Remove the audio element
        $audioPattern = '(?s)\s*<audio id="bg-music" loop>.*?</audio>\s*'
        $content = $content -replace $audioPattern, [Environment]::NewLine
        
        # Add audio-modal.js script tag before main.js
        $scriptPattern = '(<script src="\.\/static\/js\/main\.js"><\/script>)'
        $scriptReplacement = '<script src="./static/js/audio-modal.js"></script>' + [Environment]::NewLine + '    $1'
        $content = $content -replace $scriptPattern, $scriptReplacement
        
        # Save the file
        $content | Set-Content $filePath -Encoding UTF8 -NoNewline
        
        Write-Host "  Success - $file updated!" -ForegroundColor Cyan
    }
    else {
        Write-Host "  Error - $file not found!" -ForegroundColor Red
    }
}

Write-Host "`nAll HTML files have been updated!" -ForegroundColor Green
Write-Host "Changes made:" -ForegroundColor Yellow
Write-Host "  1. Removed music modal HTML from all pages" -ForegroundColor White
Write-Host "  2. Removed duplicate audio elements" -ForegroundColor White
Write-Host "  3. Added audio-modal.js script tag" -ForegroundColor White
