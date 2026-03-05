@echo off

REM Make sure npm and python are installed

REM Install node modules
npm install

REM Python setup
python -m venv venv
call venv/Scripts/activate.bat
pip install -r requirements.txt
