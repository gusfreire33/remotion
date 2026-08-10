# Render final 4K60 do MeuVideo, rodando destacado (sobrevive ao fechamento
# do terminal que o disparou). Log em .\tmp\render.log
#
# Ajustes que fizeram esse render passar nesta máquina:
#  · TEMP em C:\remotion-tmp — a cópia do public/ pro bundle (~1,2 GB) sai do
#    D:, deixando o D: livre pro arquivo final;
#  · --concurrency=2 — com 6 abas decodificando 4K a RAM (16 GB) estourava;
#  · vídeo base com <Video> do @remotion/media (sem cache de frames em disco).
$ErrorActionPreference = "Stop"
Set-Location -LiteralPath "D:\CLAUDECODE-Projetos\PROJETOS - Claude code\[WD] Editor de videos\editor"

$env:TEMP = "C:\remotion-tmp"
$env:TMP = "C:\remotion-tmp"
$env:REMOTION_USE_4K = "1"

$out = ".\Downloads Remo\Ceratocone - Marcelo Dartora - 4K60.mp4"
$log = ".\tmp\render.log"

"INICIO $(Get-Date -Format 'HH:mm:ss')" | Out-File -FilePath $log -Encoding utf8

npx remotion render MeuVideo $out --scale=2 --crf=20 --concurrency=2 *>&1 |
  Out-File -FilePath $log -Encoding utf8 -Append

"FIM exit=$LASTEXITCODE $(Get-Date -Format 'HH:mm:ss')" | Out-File -FilePath $log -Encoding utf8 -Append
