@echo off
echo Iniciando Sistema de Redes Sociais...

REM Iniciar Backend
echo Iniciando Backend...
cd backend
if not exist venv (
    python -m venv venv
)
call venv\Scripts\activate
pip install -r requirements.txt
start /B python main.py
cd ..

REM Iniciar Frontend
echo Iniciando Frontend...
cd frontend
call npm install
start /B npm run dev
cd ..

echo Sistema iniciado!
echo Backend: http://localhost:8001
echo Frontend: http://localhost:5173
echo Pressione Ctrl+C para parar

pause
