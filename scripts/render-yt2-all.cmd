@echo off
REM Render final do "Video 2 YT": 1080p inteiro primeiro (entrega rapida em
REM Downloads), depois o 4K em blocos (render-yt2-4k.cmd).
setlocal
set "TMP=D:\remotion-tmp"
set "TEMP=D:\remotion-tmp"
set "TMPDIR=D:\remotion-tmp"
set "R=.\node_modules\.bin\remotion.cmd"
set "OUT=out\yt2\Video 2 YT - editado 1080p.mp4"
set "DEST=C:\Users\Gustavo\Downloads\Video 2 YT - editado 1080p.mp4"
if not exist "D:\remotion-tmp" mkdir "D:\remotion-tmp"
if not exist "out\yt2" mkdir "out\yt2"
echo INICIO 1080p %DATE% %TIME%
call %R% render Yt2 "%OUT%" --crf=18 --gl=angle --concurrency=3 --offthreadvideo-cache-size-in-bytes=1500000000 --port 3408 --timeout=180000 --log=error
if errorlevel 1 goto :erro
copy /Y "%OUT%" "%DEST%"
if errorlevel 1 goto :erro
echo 1080p PRONTO %DATE% %TIME%

echo INICIO 4K %DATE% %TIME%
call scripts\render-yt2-4k.cmd
if errorlevel 1 goto :erro
echo TUDO PRONTO %DATE% %TIME%
exit /b 0

:erro
echo FALHOU %DATE% %TIME%
exit /b 1
