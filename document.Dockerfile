FROM node:20.17.0-alpine

# Install bash and pnpm
RUN apk add --no-cache bash
RUN npm i -g pnpm @nestjs/cli typescript ts-node

# Copy package.json and pnpm-lock.yaml to the tmp directory
COPY package*.json pnpm-lock.yaml /tmp/app/

# Install dependencies using pnpm
RUN cd /tmp/app && pnpm install

# Copy the entire source code
COPY . /usr/src/app
RUN cp -a /tmp/app/node_modules /usr/src/app

# Add wait-for-it.sh script
COPY ./wait-for-it.sh /opt/wait-for-it.sh
RUN chmod +x /opt/wait-for-it.sh
COPY ./startup.document.dev.sh /opt/startup.document.dev.sh
RUN chmod +x /opt/startup.document.dev.sh

# Remove carriage returns for compatibility
RUN sed -i 's/\r//g' /opt/wait-for-it.sh
RUN sed -i 's/\r//g' /opt/startup.document.dev.sh

# Set working directory
WORKDIR /usr/src/app

# Create .env if it doesn't exist
RUN if [ ! -f .env ]; then cp env-example .env; fi

# Build the application
RUN pnpm run build

# Command to run the application
CMD ["/opt/startup.document.dev.sh"]
