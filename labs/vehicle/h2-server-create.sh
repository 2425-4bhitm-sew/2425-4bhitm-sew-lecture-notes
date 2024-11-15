#!/bin/bash
set -e

DIR="./db"
if [ -d "$DIR" ]; then
  echo "${DIR} already exists, the installation has exited ..."
  exit 1
fi
echo "Installing h2-database in ${DIR} ..."
mkdir db
cd db
curl -L https://search.maven.org/remotecontent?filepath=com/h2database/h2/2.3.232/h2-2.3.232.jar -o h2.jar

ls -l
#unzip derbydb.zip
