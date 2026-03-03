#!/bin/sh

# Make sure npm and python are installed

# Install node modules
npm install

# Python setup
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
