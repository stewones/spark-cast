# Use the official MongoDB community image
FROM mongo:8
LABEL maintainer="Stewan Silva <stewan@intenseloop.com>"

# Create app directory
WORKDIR /app

# Copy the startup script and config files
COPY ./db/config/startup.sh /docker-entrypoint-initdb.d/

# Ensure the scripts have execute permissions
RUN chmod +x /docker-entrypoint-initdb.d/startup.sh

# Expose the default MongoDB port
EXPOSE 27017

# Start MongoDB and cron
CMD ["mongod", "--replSet", "spark-rs0"]
