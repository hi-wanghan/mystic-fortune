# create snapshot file
Get-ChildItem -Recurse -File -Exclude node_modules,*.log,.next | 
    Where-Object { $_.Extension -in '.ts','.tsx','.js','.json','.css','.sql','.md' } | 
    ForEach-Object { 
        "`n========== $($_.FullName.Replace($PWD.Path, '')) ==========`n"
        Get-Content $_.FullName -Raw 
    } | Out-File project-snapshot.txt -Encoding UTF8

Write-Host "✅ Snapshot saved to: project-snapshot.txt"