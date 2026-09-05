@echo off
REM ---------------------------------------------------------------------------
REM RENDER FINAL 4K EM BLOCOS - "VSLL Wonne V4" (05/09/2026)
REM 16 GB de RAM: render 4K de uma vez morre com "Page crashed!" (videos 23/26).
REM Cada bloco abre um Chrome novo (memoria zera); depois concat sem reencodar.
REM --gl=angle usa a GPU (RTX 3050). --concurrency=2 + cache de 1,5 GB: com 4 abas
REM o cache do OffthreadVideo descartava frames do matte ("No frame found", bloco 9).
REM ---------------------------------------------------------------------------
setlocal
set "TMP=D:\remotion-tmp"
set "TEMP=D:\remotion-tmp"
set "TMPDIR=D:\remotion-tmp"
set "R=.\node_modules\.bin\remotion.cmd"
set "FF=.\node_modules\@remotion\compositor-win32-x64-msvc\ffmpeg.exe"
set "OUT=out\VSLL Wonne V4 - editado 4K.mp4"
set "DEST=D:\Downloads 2\VSLL Wonne V4 - editado 4K.mp4"
set "OPTS=--scale=2 --crf=18 --gl=angle --concurrency=2 --offthreadvideo-cache-size-in-bytes=1500000000 --timeout=180000 --log=error"
if not exist "out\chunks" mkdir "out\chunks"
echo INICIO %DATE% %TIME%

echo === BLOCO 10/16 (frames 4680-5199) %TIME% ===
call %R% render MeuVideo "out\chunks\c10.mp4" --frames=4680-5199 --port 3440 %OPTS%
if errorlevel 1 goto :erro
echo === BLOCO 11/16 (frames 5200-5719) %TIME% ===
call %R% render MeuVideo "out\chunks\c11.mp4" --frames=5200-5719 --port 3441 %OPTS%
if errorlevel 1 goto :erro
echo === BLOCO 12/16 (frames 5720-6239) %TIME% ===
call %R% render MeuVideo "out\chunks\c12.mp4" --frames=5720-6239 --port 3442 %OPTS%
if errorlevel 1 goto :erro
echo === BLOCO 13/16 (frames 6240-6759) %TIME% ===
call %R% render MeuVideo "out\chunks\c13.mp4" --frames=6240-6759 --port 3443 %OPTS%
if errorlevel 1 goto :erro
echo === BLOCO 14/16 (frames 6760-7279) %TIME% ===
call %R% render MeuVideo "out\chunks\c14.mp4" --frames=6760-7279 --port 3444 %OPTS%
if errorlevel 1 goto :erro
echo === BLOCO 15/16 (frames 7280-7799) %TIME% ===
call %R% render MeuVideo "out\chunks\c15.mp4" --frames=7280-7799 --port 3445 %OPTS%
if errorlevel 1 goto :erro
echo === BLOCO 16/16 (frames 7800-8103) %TIME% ===
call %R% render MeuVideo "out\chunks\c16.mp4" --frames=7800-8103 --port 3446 %OPTS%
if errorlevel 1 goto :erro

echo === JUNTANDO OS 16 BLOCOS (sem reencodar) %TIME% ===
> "out\chunks\lista.txt" echo file 'c01.mp4'
>> "out\chunks\lista.txt" echo file 'c02.mp4'
>> "out\chunks\lista.txt" echo file 'c03.mp4'
>> "out\chunks\lista.txt" echo file 'c04.mp4'
>> "out\chunks\lista.txt" echo file 'c05.mp4'
>> "out\chunks\lista.txt" echo file 'c06.mp4'
>> "out\chunks\lista.txt" echo file 'c07.mp4'
>> "out\chunks\lista.txt" echo file 'c08.mp4'
>> "out\chunks\lista.txt" echo file 'c09.mp4'
>> "out\chunks\lista.txt" echo file 'c10.mp4'
>> "out\chunks\lista.txt" echo file 'c11.mp4'
>> "out\chunks\lista.txt" echo file 'c12.mp4'
>> "out\chunks\lista.txt" echo file 'c13.mp4'
>> "out\chunks\lista.txt" echo file 'c14.mp4'
>> "out\chunks\lista.txt" echo file 'c15.mp4'
>> "out\chunks\lista.txt" echo file 'c16.mp4'
%FF% -y -f concat -safe 0 -i "out\chunks\lista.txt" -c copy "%OUT%"
if errorlevel 1 goto :erro

echo === COPIANDO PRA D:\Downloads 2 ===
copy /Y "%OUT%" "%DEST%"
if errorlevel 1 goto :erro
echo TUDO PRONTO %DATE% %TIME%
exit /b 0

:erro
echo FALHOU %DATE% %TIME%
exit /b 1

