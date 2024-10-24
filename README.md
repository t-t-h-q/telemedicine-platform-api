# Telemedicine Platform

## Table of Contents

- [Telemedicine Platform](#telemedicine-platform)
  - [Table of Contents](#table-of-contents)
  - [Introduction](#introduction)
  - [Features](#features)
  - [System Requirements](#system-requirements)
  - [Installation](#installation)
    - [Local Installation](#local-installation)

---

## Introduction

**Telemedicine Platform API** is an API service for a healthcare system built using modern technologies like NestJS, MongoDB, and Docker. The project aims to provide an efficient, scalable platform for managing healthcare data, enabling seamless communication between different system components and ensuring robust data handling for healthcare professionals..

## Features

- [Feature 1: RESTful API for users]
- [Feature 2: Auth]

## System Requirements

- **Node.js**: >= 20.x
- **pnpm**: >= 7.x
- **MongoDB**: >= 8.0
- **Docker** (recommended)
- **Git**

## Installation

### Local Installation

1. **clone the repository**:

    ```bash
    git clone https://github.com/t-t-h-q/telemedicine-platform-api.git
    cd repo
    ```

2. **Install dependencies**:
  pnpm install

3. **Configure environment variables**:
  Copy the .env.example file to .env and configure the necessary values:
  cp .env.example .env

4. **Change env config**:
  Change DATABASE_URL=mongodb://mongo:27017 to DATABASE_URL=mongodb://localhost:27017
  Change MAIL_HOST=maildev to MAIL_HOST=localhost
  
5. **Generate secret keys for access token and refresh token**

    ```console
    node -e "console.log('\nAUTH_JWT_SECRET=' + require('crypto').randomBytes(256).toString('base64') + '\n\nAUTH_REFRESH_SECRET=' + require('crypto').randomBytes(256).toString('base64') + '\n\nAUTH_FORGOT_SECRET=' + require('crypto').randomBytes(256).toString('base64') + '\n\nAUTH_CONFIRM_EMAIL_SECRET=' + require('crypto').randomBytes(256).toString('base64'));"
    ```

6. **Start MongoDB using Docker (if MongoDB is not installed locally)**:
  docker compose -f docker-compose.document.yaml up -d mongo mongo-express maildev

7. **Run the project**:
  pnpm run start:dev
  Open <http://localhost:3000>
