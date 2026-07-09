# Rewindj API

Backend API for Rewindj.

Rewindj is an AI-powered operating system for DJs, independent artists and agencies, designed to manage events, clients, artists and financial operations through a modern multi-tenant architecture.

🌐 Live Application

https://app.rewindj.me

---

## Overview

Rewindj API powers the entire platform, exposing REST endpoints consumed by the web application.

The backend is built with NestJS following a modular architecture, supporting multi-tenancy, role-based permissions and AI-assisted workflows.

---

## Features

### Authentication & Security

- JWT Authentication
- Google OAuth
- Protected Endpoints
- Role-Based Access Control (RBAC)
- Multi-Tenant Data Isolation

### Organization Management

- Agency Registration
- Independent Artist Registration
- Invitation System
- Artist Onboarding via Invite Flow
- Account Type Support (Agency / Independent Artist)

### Artist Management

- Artist Listing
- Artist Profiles
- Artist Details
- Artist-to-User Association
- Independent Artist Accounts

### Event Management

- Event Creation
- Event Editing
- Event Details
- Event Listing
- Automatic Client Creation
- Artist Assignment
- Negotiation Status
- Fee Management
- Payment Date Tracking
- Role-Based Event Permissions

### Client Management

- Client Listing
- Client Details
- Company Information
- Automatic Client Creation during Event Creation

### Financial

- Monthly Financial Summary
- Monthly Revenue
- Average Event Fee
- Monthly Event Statistics
- Month & Year Filtering
- Artist Filtering
- Permission-Aware Financial Reports

### Artificial Intelligence

Powered by Google Gemini.

The AI extracts structured event information from WhatsApp messages, emails or free text.

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
- Artist Dashboard
- Independent Artist Dashboard
- Operational Metrics

---

## User Roles

### CEO

- Manage Organization
- Manage Users
- Invite Artists
- Manage Artists
- Manage Clients
- Manage Events
- View Financial Reports

### ADMIN

- Manage Artists
- Manage Clients
- Manage Events
- View Financial Reports

### PRODUCER

- Manage Artists
- Manage Clients
- Manage Events
- View Financial Reports

### ARTIST (Agency)

- View Personal Dashboard
- View Assigned Events
- View Personal Financial Summary

### ARTIST (Independent)

- Manage Own Events
- Manage Own Clients
- View Financial Dashboard
- Operate as a single-person organization

---

## Tech Stack

### Backend

- NestJS
- TypeScript
- Prisma ORM
- PostgreSQL
- JWT
- Swagger
- class-validator
- class-transformer

### Frontend

- Next.js 15
- React 19
- TypeScript
- TailwindCSS
- TanStack Query
- shadcn/ui

### AI

- Google Gemini

### Infrastructure

- Docker
- Neon PostgreSQL
- DigitalOcean
- Nginx
- Vercel
- Namecheap

---

## Architecture

Rewindj follows a multi-tenant architecture where every organization owns its own resources.

Each organization manages:

- Users
- Artists
- Clients
- Events

All operations are automatically isolated by organization.

The platform also supports two business models:

- Agency Accounts
- Independent Artist Accounts

Business rules are enforced through role-based permissions and account type awareness.

---

## Current Modules

### Completed

- Authentication
- Google OAuth
- Organizations
- Invitations
- Artists
- Artist Profiles
- Clients
- Events
- Event Editing
- Financial Dashboard (Monthly Summary)
- AI Event Parsing
- Multi-Tenant Permissions
- Role-Based Access Control

### In Progress

- Payment Status
- Payment Scheduling
- Annual Financial Reports
- Monthly Revenue Charts
- Contracts
- Calendar Improvements

---

## Vision

Rewindj aims to become the operating system for DJs, artists and agencies.

The platform centralizes event management, client relationships, financial operations and AI-powered workflows into a single modern ecosystem.
