# Product Requirements Document (PRD): Crime Tracker BD

## 1. Executive Summary

**Crime Tracker BD** is a web-based reporting and tracking platform designed to empower citizens of Bangladesh with real-time information about criminal activities in their vicinity. The platform aims to increase awareness, crowdsource safety data, and provide visual insights into crime trends across different locations.

## 2. Product Objectives

- **Awareness:** Allow users to view crime data based on their geolocation or search intent.
- **Visualization:** Provide an interactive map experience to differentiate crime types.
- **Community Safety:** Enable crowdsourcing of data to alert others of danger zones and facilitate rapid response.

## 3. Product Features & Requirements

### 3.1. Location-Based Tracking

- **Feature:** Auto-detect user's current location (with permission).
- **Behavior:** On load, the map centers on the user's location and populates markers for reported crimes within a default radius (e.g., 2km).

### 3.2. Search Functionality

- **Feature:** Search bar to query specific areas (e.g., "Gulshan 1", "Dhanmondi 32").
- **Behavior:** Autocomplete suggestions for locations in Bangladesh. Selecting a result pans the map to that area and loads relevant crime data.

### 3.3. Interactive Map & Visualization

- **Feature:** Interactive map interface.
- **Markers:** Distinct markers/icons for different crime types (e.g., Robbery, Hijacking, Harassment, Theft). Color-coded by severity.
- **Details:** Clicking a marker opens a "Glassmorphic" card showing details: Time, Date, Description, and Severity.

### 3.4. Crowdsourced Reporting (The "Waze" for Crime)

- **Feature:** Allow verified users to submit crime reports anonymously.
- **Fields:** Type of Crime, Time, Description, Exact Location on Map, Upload Evidence (Photo/Video).
- **Validation:** Community voting system (Confirm/Deny) to filter spam or unverified rumors.

### 3.5. Safety Heatmaps

- **Feature:** Visual heat overlays on the map.
- **Behavior:** Instantly identify high-risk zones without clicking individual markers. Red zones indicate high crime frequency, green indicates safer areas.

### 3.6. Emergency & Rapid Response

- **Feature:** SOS Button & Emergency Directory.
- **Details:** One-tap access to National Emergency Service (999), nearby police stations, and hospitals based on current coordinates.

### 3.7. Analytics Dashboard

- **Feature:** A statistical view showing crime trends.
- **Behavior:** Display charts and summaries, such as "Theft increased by 20% in Mirpur this month" or "Most common crimes in Chittagong."

### 3.8. Alerts & Notifications

- **Feature:** Push notifications or Email alerts.
- **Trigger:** Notify users when a high-severity crime is reported within a specific radius (e.g., 500m) of their saved "Home" or current location.
