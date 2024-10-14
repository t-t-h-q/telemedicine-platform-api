# This script is used to start the telemedicine-platform-api in a development environment.
# It performs the following steps:
# 1. Waits for the MongoDB service to be available on port 27017.
# 2. Displays the contents of the .env file.
# 3. Runs the database seed scripts.
# 4. Starts the application in production mode.
#!/usr/bin/env bash
set -e

/opt/wait-for-it.sh mongo:27017
cat .env
# pnpm run seed:run:document // seed script is not available
pnpm run start:prod
