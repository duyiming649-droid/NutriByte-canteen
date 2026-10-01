@echo off
cd /d %~dp0
echo GREENBOX 3D prototype: http://localhost:8137
start "" http://localhost:8137
py -3 -m http.server 8137 2>nul || python -m http.server 8137
