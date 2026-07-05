#!/bin/zsh


# Script à lancer quand on modifie les fichiers de backend et 
# frontend pour que l'application soit aussitôt updatée.


CUR_DIR="$(cd "$(dirname "$0")" && pwd)"

cp -R $CUR_DIR/frontend/* "$CUR_DIR/Board.app/Contents/Resources/frontend/"
cp -R $CUR_DIR/backend/* "$CUR_DIR/Board.app/Contents/Resources/backend/"


