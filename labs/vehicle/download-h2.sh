set -e
echo download scripts for quarkus project ...
echo "for jdk 21 run 'download-derbydb-and-jdk.sh java'"
URL=http://edufs.edu.htl-leonding.ac.at/~t.stuetz/download/nvs/scripts/download-h2/
curl -O ${URL}datasource.txt
curl -O ${URL}h2-server-create.sh
curl -O ${URL}h2-server-start.sh
curl -O ${URL}h2-inmemory-start.sh
chmod +x h2*.sh
curl -O ${URL}application.properties
#curl -O ${URL}add-assertj-to-pom.sh
#chmod +x ./add-assertj-to-pom.sh

# when parameter 'java' download jdk
if [ "$1" = "java" ]
  then
    curl -O ${URL}install-local-jdk-21.sh
    curl -O ${URL}set-local-env.sh
    chmod +x install-local-jdk-21.sh
    chmod +x set-local-env.sh
    echo "JDK downloaded"
    echo "run script to download jdk './install-local-jdk-21.sh'"
    #echo "to use this JDK invoke 'source ./set-local-env.sh'"
fi

# add db/ to .gitignore, when db does not exist
if [ ! -d "db" ]; then
  echo "db/" >> .gitignore
fi
./h2-server-create.sh
