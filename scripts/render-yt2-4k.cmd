@echo off
REM ---------------------------------------------------------------------------
REM RENDER FINAL 4K EM BLOCOS - "Video 2 YT" (12/09/2026), composicao Yt2.
REM 14306 frames em 28 blocos de 520. --concurrency=2 + cache 1,5 GB (ver
REM memoria render-4k-matte-no-frame-found). Juncao: video puro (-an) + audio
REM mixado fora do Remotion (scripts/mix-audio-yt2.py) - evita os micro-
REM congelamentos do concat com AAC por bloco.
REM ---------------------------------------------------------------------------
setlocal enabledelayedexpansion
set "TMP=D:\remotion-tmp"
set "TEMP=D:\remotion-tmp"
set "TMPDIR=D:\remotion-tmp"
set "R=.\node_modules\.bin\remotion.cmd"
set "FF=.\node_modules\@remotion\compositor-win32-x64-msvc\ffmpeg.exe"
set "OUT=out\yt2\Video 2 YT - editado 4K.mp4"
set "DEST=C:\Users\Gustavo\Downloads\Video 2 YT - editado 4K.mp4"
set "OPTS=--scale=2 --crf=18 --gl=angle --concurrency=2 --offthreadvideo-cache-size-in-bytes=1500000000 --timeout=180000 --log=error"
if not exist "D:\remotion-tmp" mkdir "D:\remotion-tmp"
if not exist "out\yt2\chunks" mkdir "out\yt2\chunks"
echo INICIO %DATE% %TIME%

set /a N=0
set /a PORT=3450
for /L %%S in (0,520,14305) do (
  set /a N+=1
  set /a E=%%S+519
  if !E! GTR 14305 set /a E=14305
  set /a PORT+=1
  set "NN=0!N!"
  set "NN=!NN:~-2!"
  if exist "out\yt2\chunks\c!NN!.mp4" (
    echo === BLOCO !N! ja existe, pulando ===
  ) else (
    echo === BLOCO !N!/28 ^(frames %%S-!E!^) !TIME! ===
    call %R% render Yt2 "out\yt2\chunks\c!NN!.mp4" --frames=%%S-!E! --port !PORT! %OPTS%
    if errorlevel 1 goto :erro
  )
)

echo === JUNTANDO OS BLOCOS ^(so video^) !TIME! ===
del /Q "out\yt2\chunks\lista.txt" 2>nul
for /L %%I in (1,1,28) do (
  set "NN=0%%I"
  set "NN=!NN:~-2!"
  %FF% -y -loglevel error -i "out\yt2\chunks\c!NN!.mp4" -an -c copy "out\yt2\chunks\v!NN!.mp4"
  if errorlevel 1 goto :erro
  >> "out\yt2\chunks\lista.txt" echo file 'v!NN!.mp4'
)
%FF% -y -loglevel error -f concat -safe 0 -i "out\yt2\chunks\lista.txt" -c copy "out\yt2\chunks\video-only.mp4"
if errorlevel 1 goto :erro

echo === MIXANDO AUDIO !TIME! ===
node scripts\export-sfx-cues-yt2.cjs
if errorlevel 1 goto :erro
python scripts\mix-audio-yt2.py out\yt2\voz48.wav 476.8667
if errorlevel 1 goto :erro
%FF% -y -loglevel error -i "out\yt2\chunks\video-only.mp4" -i "out\yt2\mix48.wav" -map 0:v -map 1:a -c:v copy -c:a aac -b:a 256k -shortest "%OUT%"
if errorlevel 1 goto :erro

echo === COPIANDO PRA Downloads ===
copy /Y "%OUT%" "%DEST%"
if errorlevel 1 goto :erro
echo TUDO PRONTO %DATE% %TIME%
exit /b 0

:erro
echo FALHOU %DATE% %TIME%
exit /b 1
