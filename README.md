## MSc Computer Science Final Project

My App is an Internet of Things (IoT) plant monitoring system designed to help users monitor the health of their houseplants through a combination of embedded hardware, a mobile application, and cloud technologies.

The project aims to provide an end-to-end software engineering solution by combining mobile development, embedded systems, networking, cloud computing, databases, and backend development into a single cohesive application.

## Project Overview

A moisture sensor connected to an ESP32-C6 microcontroller will periodically measure the soil moisture level of a plant. To maximise battery life, the device will spend most of its time in deep sleep and wake at scheduled intervals to collect sensor readings.

Users will pair the ESP32 device with the mobile application using Bluetooth Low Energy (BLE). During the initial setup, the mobile application will provision the device with the user's Wi-Fi credentials, allowing the sensor to upload future readings directly to the cloud without requiring the phone to remain connected.

The mobile application will allow users to:

- Register and manage multiple plants
- Pair and manage multiple moisture sensors
- View live and historical moisture readings
- Receive plant-specific watering advice
- Monitor plant health through graphs and analytics
- Configure device and notification settings

## Proposed Technologies

### Mobile

- React Native
- Expo
- TypeScript

### Embedded Hardware

- ESP32-C6
- Capacitive Soil Moisture Sensor
- Bluetooth Low Energy (BLE)
- Wi-Fi

### Backend (Proposed)

One of the following architectures will be selected during development:

- Supabase
- FastAPI + PostgreSQL

### Cloud

The backend will be deployed to a cloud platform, allowing sensor data to be securely stored and accessed remotely.

## Learning Objectives

This project aims to develop practical experience in:

- Mobile application development
- Internet of Things (IoT)
- Embedded programming
- Bluetooth Low Energy (BLE)
- REST API development
- Database design
- Cloud deployment
- Software architecture
- Authentication and security
- Full-stack software engineering

## Current Status

🚧 Project currently in the planning and architecture phase.