#!/bin/bash

echo "Iniciando Sistema de Redes Sociais..."

# Iniciar Backend
echo "Iniciando Backend..."
cd backend
source venv/bin/activate 2>/dev/null || python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
python main.py &
BACKEND_PID=$!
cd ..

# Iniciar Frontend
echo "Iniciando Frontend..."
cd frontend
npm install
npm run dev &
FRONTEND_PID=$!
cd ..

echo "Sistema iniciado!"
echo "Backend: http://localhost:8001"
echo "Frontend: http://localhost:5173"
echo "Pressione Ctrl+C para parar"

# Wait for both processes
wait $BACKEND_PID $FRONTEND_PID
