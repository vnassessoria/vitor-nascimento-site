@echo off
title Vitor Nascimento - Servidor do Site
set "PATH=%PATH%;C:\Program Files\nodejs"
cd /d "%~dp0server"

where node >nul 2>nul
if errorlevel 1 (
  echo ERRO: Node.js nao foi encontrado neste computador.
  echo Reinstale o Node.js ou avise o suporte tecnico.
  pause
  exit /b 1
)

echo Iniciando o servidor do site...
echo NAO FECHE esta janela enquanto estiver usando o site ou o painel.
echo.
start "" http://localhost:3000/
node server.js
echo.
echo O servidor foi encerrado.
pause
