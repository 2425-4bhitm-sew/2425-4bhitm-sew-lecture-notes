#!/bin/bash
set -e

cd db

# Define the database name and path
DB_PATH="./db"

# Define the JDBC URL
JDBC_URL="jdbc:h2:$DB_PATH"

# Define the username and password
USERNAME="app"
PASSWORD="app"

# Create the database using the H2 Shell and show db-version
java -cp h2*.jar org.h2.tools.Shell -url $JDBC_URL \
                                    -user $USERNAME \
                                    -password $PASSWORD \
                                    -sql "select 'h2 version: ' || setting_value from information_schema.settings where setting_name = 'info.VERSION';"
#-sql "CREATE TABLE IF NOT EXISTS test(id INT PRIMARY KEY, name VARCHAR(255));"

echo ++++++++++++++++++++++++++++++++++++++++
echo  JDBC URL: jdbc:h2:tcp://localhost:9092/db
echo  Username: $USERNAME
echo  Password: $PASSWORD
echo ++++++++++++++++++++++++++++++++++++++++


# Start the H2 database server
java -cp h2*.jar org.h2.tools.Server -tcp \
                                     -tcpAllowOthers \
                                     -tcpPort 9092 \
                                     -ifNotExists \
                                     -web \
                                     -webPort 19999 \
                                     -baseDir .
