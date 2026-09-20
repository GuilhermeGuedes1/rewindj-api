# Rewindj

AI-Powered Operating System for DJs, Artists and Agencies.

🌐 Live Application: https://app.rewindj.me

Rewindj is a multi-tenant SaaS platform designed to help agencies, managers and artists manage events, clients, negotiations and operations through a modern web platform powered by Artificial Intelligence.

---

## Live Demo

Current Status:
Private Beta

The platform is currently being tested in a real-world event operation and is under active development.

---

## Features

### Authentication & Security

- JWT Authentication
- Protected Routes
- Role-Based Access Control
- Multi-Tenant Architecture
- Organization Data Isolation

### Organization Management

- Agency Registration
- User Management
- Invitation System
- Artist Onboarding via Invite Flow

### Artist Management

- Artist Listing
- Artist Profiles
- Artist Details
- Artist-to-User Association

### Event Management

- Create Events
- Edit Events
- Event Details
- Event Listing
- Artist Assignment
- Negotiation Status Tracking
- Fee Management
- Multi-Tenant Event Isolation

### Client Management

- Client Listing
- Client Details
- Company Information
- Automatic Client Creation During Event Creation

### Artificial Intelligence

Powered by Google Gemini.

The AI can extract information from WhatsApp messages, emails or free text and automatically generate structured event drafts.

Supported extraction:

- Event Title
- Event Date
- Start Time
- End Time
- Venue
- Address
- City
- State
- Artist
- Client
- Phone
- Email
- Fee
- Negotiation Status
- Notes

### Dashboard

- Organization Overview
- Upcoming Events
- Artist-Specific Dashboard
- Operational Metrics

---

## User Roles

### CEO

- Manage Organization
- Manage Users
- Invite Team Members
- Manage Artists
- Manage Clients
- Manage Events

### ADMIN

- Manage Artists
- Manage Clients
- Manage Events

### PRODUCER

- Manage Events
- Manage Artists
- Manage Clients

### ARTIST

- View Personal Dashboard
- View Assigned Events
- View Personal Information

---

## Tech Stack

### Backend

- NestJS
- TypeScript
- Prisma ORM
- PostgreSQL
- JWT
- Swagger

### Frontend

- Next.js 15
- TypeScript
- TailwindCSS
- shadcn/ui
- React Hook Form
- Axios

### AI

- Google Gemini

### Infrastructure

- Docker
- DigitalOcean
- Nginx
- Vercel
- Namecheap

---

## Architecture

Rewindj follows a multi-tenant architecture.

Each organization owns:

- Users
- Artists
- Clients
- Events

All data is isolated by organization.

---

## Current Modules

### Completed

- Authentication
- Organizations
- Invitations
- Artists
- Artist Profiles
- Clients
- Events
- Event Editing
- AI Event Parsing
- Fee Tracking
- Negotiation Status
- Multi-Tenant Permissions

### In Progress

- Contracts
- Payment Management
- Payment Scheduling
- Financial Dashboard
- Independent Artist Accounts

---

## Vision

Rewindj aims to become the operating system for DJs, artists and agencies.

The goal is to centralize event management, artist relationships, negotiations, payments and AI-powered workflows into a single platform.

---

## Dados de demonstração

Para criar dados locais de demonstração, suba o PostgreSQL e execute:

```bash
yarn db:seed
```

O seed pode ser executado novamente sem duplicar dados: ele recria somente as
duas organizações de demonstração identificadas como `SEED-AGENCY-0001` e
`SEED-INDEPENDENT-0001`.

Ele cria uma agência com CEO, ADMIN, PRODUCER e três artistas, além de clientes
e eventos confirmados, em negociação e perdidos. Também cria um artista
independente com clientes e eventos próprios.

Todas as contas usam a senha `RewindJ@123`.

---

## Docker

Desenvolvimento local (API com hot reload e PostgreSQL Docker persistido no
volume `orbit-api_postgres-data`):

```bash
docker compose up -d --build
```

Para parar o ambiente local sem remover o volume do banco:

```bash
docker compose down
```

Produção usa somente a API Docker e o PostgreSQL Neon. No servidor, o arquivo
`.env` deve conter a `DATABASE_URL` do Neon (nunca `postgres:5432`). Para
construir e iniciar a produção:

```bash
docker compose -f compose.prod.yml build
docker compose -f compose.prod.yml up -d
```
