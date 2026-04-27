# Smart Water Billing System

A modern, microservices-based application for managing water consumption and billing in apartment societies.

## Project Structure

- `frontend/`: Angular 17+ Application (Standalone components, Material UI, NgCharts)
- `api-gateway/`: Node.js + Express API Gateway (MongoDB, JWT Auth, Mongoose)
- `billing-service/`: Spring Boot Billing Microservice (Slab-based calculation, H2/PostgreSQL)

## Prerequisites

- [Node.js v20+](https://nodejs.org/)
- [Java 17 JDK](https://adoptium.net/) (for Billing Service)
- [Maven](https://maven.apache.org/) (for Billing Service)
- [MongoDB](https://www.mongodb.com/) (local or [Atlas](https://cloud.mongodb.com/))

## Setup Instructions

### 1. API Gateway (Node.js)
```bash
cd api-gateway
npm install
# Copy .env.example to .env and update MongoDB URI
npm run dev
```

### 2. Billing Service (Spring Boot)
```bash
cd billing-service
# Requires Java 17 and Maven
mvn spring-boot:run
```

### 3. Frontend (Angular)
```bash
cd frontend
npm install
npm start
```

## Core Features

- **Per-flat Usage Tracking**: Record consumption data from IoT meters.
- **Slab-based Billing**: Automatic calculation based on tiered pricing thresholds.
- **Analytics Dashboard**: Visual charts for consumption patterns and comparison.
- **Role-based Access**: Separate interfaces for Society Admins and Residents.
- **Invoice Management**: Detailed bill breakdown and history.

## API Documentation

- **Node.js Gateway**: `http://localhost:3000/api`
- **Billing Service Swagger**: `http://localhost:8080/swagger-ui.html`
