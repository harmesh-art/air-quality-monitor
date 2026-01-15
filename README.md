# 🌍 Real-Time Air Quality Monitor

A modern, full-stack application that delivers real-time Air Quality Index (AQI) data, detailed pollutant breakdowns, and live weather conditions for locations worldwide. Built with a **React** frontend and a **Python/Flask** backend, this project leverages a hybrid data engine to combine ground-truth station data with satellite modeling for maximum accuracy.
![WhatsApp Image 2026-01-15 at 12 11 49 PM](https://github.com/user-attachments/assets/88d5fd60-f34d-4244-b08f-758d0f31f4b0)
![WhatsApp Image 2026-01-15 at 12 11 49 PM](https://github.com/user-attachments/assets/a3fa3887-b171-494c-b3bc-0a0af9d8f242)
![WhatsApp Image 2026-01-15 at 12 12 47 PM](https://github.com/user-attachments/assets/6d0767c6-5e4a-48b0-b8f8-41ad9f1ac2b4)







## 🚀 Key Features

*   **⚡ Real-Time Monitoring**: Instant access to US AQI, PM2.5, PM10, NO₂, Ozone, and more.
*   **🌦️ Live Weather Integration**: Displays current Temperature, Humidity, Wind Speed, and Weather Conditions alongside pollution data.
*   **🌍 Global Search & Geolocation**: Auto-detect your user location or search for any city on the global map.
*   **🤖 Smart Health Advisory**: Provides actionable health recommendations (e.g., "Wear a mask," "Avoid outdoor cardio") based on pollution severity.
*   **📊 Interactive Forecasts**: Visualizes 24-hour trends to help you plan your day.
*   **🎨 Premium UI/UX**: Features a sleek, dark-mode-first design with Glassmorphism effects, responsive layouts, and smooth animations.

## 🛠️ Technology Stack

### Frontend
*   **Framework**: [React](https://react.dev/) + [Vite](https://vitejs.dev/)
*   **Styling**: Tailwind CSS + Custom CSS Variables
*   **Icons**: Lucide React
*   **Charts**: Recharts
*   **HTTP Client**: Axios

### Backend
*   **Server**: Python [Flask](https://flask.palletsprojects.com/)
*   **Optimization**: `functools.lru_cache` for high-performance caching (5-minute TTL).
*   **Concurrency**: `requests.Session` for connection pooling.

### Data Sources (APIs)
1.  **[Weather & Forecasts](https://open-meteo.com/)**: Open-Meteo API (Satellite Data).
2.  **[Ground Truth AQI](https://waqi.info/)**: World Air Quality Index (WAQI) Project.
3.  **[Reverse Geocoding](https://www.bigdatacloud.com/)**: BigDataCloud API.

## ⚙️ Installation & Setup

Follow these steps to run the project locally.

### Prerequisites
*   Node.js (v16 or higher)
*   Python (v3.8 or higher)
*   Git

### 1. Clone the Repository
```bash
git clone https://github.com/harmesh-art/air-quality-monitor.git
cd air-quality-monitor
```

### 2. Backward Setup (API Server)
Navigate to the backend folder, create a virtual environment (optional but recommended), and install dependencies.

```bash
cd backend

# Optional: Create virtual environment
# python -m venv venv
# source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Start the server
python app.py
```
*The backend will start running on `http://127.0.0.1:5000`*

### 3. Frontend Setup (Client)
Open a new terminal, navigate to the frontend folder, and start the development server.

```bash
cd frontend

# Install Node modules
npm install

# Start the dev server
npm run dev
```
*The frontend will typically run on `http://localhost:5173` (or similar)*

## 💡 Usage

1.  **Grant Location**, and the app will automatically load data for your current area.
2.  Use the **Search Bar** to find specific cities (e.g., "Delhi", "New York", "Tokyo").
3.  Check the **colored status bar** for an immediate understanding of air quality (Green = Good, Maroon = Hazardous).
4.  Review the **Advisory Panel** for specific health instructions.

## 🤝 Contributing

Contributions are welcome! If you have ideas for new features or bug fixes:
1.  Fork the repository.
2.  Create a feature branch (`git checkout -b feature/AmazingFeature`).
3.  Commit your changes.
4.  Push to the branch.
5.  Open a Pull Request.

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).

---
*Built with ❤️ for a cleaner future.*
