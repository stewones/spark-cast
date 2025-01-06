#!/bin/bash

CONFIG_FILE="/config/access"
LOG_FILE="/config/log"

echo "🛠️ Starting mongo setup..." >> "$LOG_FILE"

# Read user and password from a file
source "$CONFIG_FILE"

echo "👮 Sourced config..." >> "$LOG_FILE"

# Check if INSTA_USER and INSTA_PASSWORD are set
if [ -z "$DB_USER" ] || [ -z "$DB_PASSWORD" ]; then
    echo "🚨 DB_USER or DB_PASSWORD is not set. Exiting." >> "$LOG_FILE"
    exit 1
fi

# Connect to MongoDB and configure
echo "👮 Creating user $DB_USER..." >> "$LOG_FILE"
mongosh <<EOF
    use admin
    disableTelemetry()
    rs.initiate()
    use $DB_NAME
    db.createUser({
        user: "$DB_USER",
        pwd: "$DB_PASSWORD",
        roles: [
            "readWrite",
            "dbAdmin"
        ]
    })
    rs.status()
EOF

echo "✅ Finished mongo setup!" >> "$LOG_FILE"