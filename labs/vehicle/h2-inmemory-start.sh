cd db

# Define the database name
DB_NAME="db"

# Define the JDBC URL
JDBC_URL="jdbc:h2:mem:$DB_NAME"

# Define the username and password
USERNAME="app"
PASSWORD="app"

# Start the H2 database in-memory
java -cp h2*.jar org.h2.tools.Server -tcp -tcpAllowOthers -tcpPort 9092 \
-ifNotExists -web -webPort 19999
