@echo off
REM ---------------------------------------------------------------------------
REM RENDER FINAL EM BLOCOS — "Vídeo 26"
REM
REM POR QUE EM BLOCOS: nesta máquina (16 GB de RAM) o render 4K de uma vez só
REM morre com "Page crashed!" — a memória do Chrome do Remotion vai subindo ao
REM longo dos frames e a aba estoura perto do fim. Aconteceu duas vezes: no
REM frame ~2100 com --concurrency=4 e no frame 3088 com --concurrency=2.
REM
REM Cada bloco abre um Chrome NOVO, então a memória zera a cada ~920 frames e
REM nenhum bloco chega perto do teto. Depois os 4 arquivos são juntados com o
REM demuxer `concat` do ffmpeg, com -c copy: sem reencodar, qualidade idêntica
REM à de um render único.
REM ---------------------------------------------------------------------------
setlocal
set "TMP=D:\remotion-tmp"
set "TEMP=D:\remotion-tmp"
set "TMPDIR=D:\remotion-tmp"
set "REMOTION_USE_4K=1"
set "R=.\node_modules\.bin\remotion.cmd"
set "FF=.\node_modules\@remotion\compositor-win32-x64-msvc\ffmpeg.exe"
set "OUT=Downloads Remo\Video 26 editado.mp4"

if not exist "out\chunks" mkdir "out\chunks"

echo === BLOCO 1/4 (frames 0-919) ===
call %R% render MeuVideo "out\chunks\c1.mp4" --frames=0-919 --scale=2 --port 3421 --concurrency=2 --timeout=180000
if errorlevel 1 goto :erro

echo === BLOCO 2/4 (frames 920-1839) ===
call %R% render MeuVideo "out\chunks\c2.mp4" --frames=920-1839 --scale=2 --port 3422 --concurrency=2 --timeout=180000
if errorlevel 1 goto :erro

echo === BLOCO 3/4 (frames 1840-2759) ===
call %R% render MeuVideo "out\chunks\c3.mp4" --frames=1840-2759 --scale=2 --port 3423 --concurrency=2 --timeout=180000
if errorlevel 1 goto :erro

echo === BLOCO 4/4 (frames 2760-3677) ===
call %R% render MeuVideo "out\chunks\c4.mp4" --frames=2760-3677 --scale=2 --port 3424 --concurrency=2 --timeout=180000
if errorlevel 1 goto :erro

echo === JUNTANDO OS 4 BLOCOS (sem reencodar) ===
> "out\chunks\lista.txt" echo file 'c1.mp4'
>> "out\chunks\lista.txt" echo file 'c2.mp4'
>> "out\chunks\lista.txt" echo file 'c3.mp4'
>> "out\chunks\lista.txt" echo file 'c4.mp4'
%FF% -y -f concat -safe 0 -i "out\chunks\lista.txt" -c copy "%OUT%"
if errorlevel 1 goto :erro

echo === COPIANDO PRA DOWNLOADS ===
copy /Y "%OUT%" "%USERPROFILE%\Downloads\Video 26 editado.mp4"

echo TUDO PRONTO
exit /b 0

:erro
echo FALHOU
exit /b 1
