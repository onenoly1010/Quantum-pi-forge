#!/bin/bash
pkill -f "ollama serve" || true
nohup ollama serve >/dev/null 2>&1 &
echo "Ollama restarted"