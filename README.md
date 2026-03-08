# Islamic App BD

![Islamic App BD Logo](https://storage.googleapis.com/static.antigravity.dev/67cc9937849e7570951139f4/67cc9937849e7570951139f4_0.png)

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![PWA](https://img.shields.io/badge/PWA-5A0FC8?style=for-the-badge&logo=pwa&logoColor=white)](https://web.dev/progressive-web-apps/)

## Overview

**Islamic App BD** is a modern, comprehensive, and offline-capable Progressive Web App (PWA) designed to serve the Muslim community with authentic and accessible Islamic resources. Built with a focus on performance, accessibility, and a clean user interface, this application provides a seamless experience for daily spiritual practices.

Whether you are reading the Quran, studying Hadith, or seeking guidance through our AI-powered digital scholar, Islamic App BD ensures that you have the tools you need at your fingertips—even without an active internet connection.

## Core Features

- 📖 **Al-Quran**: Full Quran with Arabic text, Bengali translation, and transliteration. Features include Audio Autoplay, verse-by-verse playback, and "Last Read" state tracking to pick up exactly where you left off.
- 📚 **Hadith Collection**: Access multiple authentic Hadith books (Bukhari, Muslim, Tirmidhi, etc.) with section-wise browsing and intelligent "Last Read" tracking.
- 🤖 **Ask Hujur**: A digital Islamic scholar powered by advanced AI. It uses backend serverless functions with fallback logic (Gemini/Groq/NVIDIA) to provide context-aware answers to your Islamic queries.
- 🧭 **Qibla Compass**: Real-time, accurate Qibla direction based on your current location.
- 📿 **Digital Tasbih Counter**: A simple and elegant interface for your daily Dhikr, with haptic feedback and session saving.
- 💰 **Zakat Calculator**: Easily calculate your Zakat based on current gold and silver prices (fetched in real-time) and your personal assets.
- 🕌 **Mosque & 🍔 Halal Food Finder**: Locate nearby Masjids and Halal dining options using integrated geolocation services.
- 📱 **PWA & Offline Support**: Install the app on your home screen and access core content like the Quran and Hadith without internet after the initial load.

## Tech Stack

- **Frontend**: React 19, Vite, TypeScript
- **Styling**: Tailwind CSS, Lucide Icons, Motion (for animations)
- **Backend**: Vercel Serverless Functions (Node.js/Express)
- **PWA**: `vite-plugin-pwa` for service workers and offline caching
- **AI Integration**: Google Gemini API, Groq, and NVIDIA NIM (via serverless proxy)

## Local Setup & Installation

Follow these steps to get the project running on your local machine:

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/islamic-app-bd.git
   cd islamic-app-bd
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Setup Environment Variables**:
   Create a `.env` file in the root directory and add your API keys:
   ```env
   GEMINI_API_KEY=your_gemini_key
   GROQ_API_KEY=your_groq_key
   NVIDIA_API_KEY=your_nvidia_key
   ```

4. **Run the development server**:
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:3000`.

## Contributing & License

Contributions are welcome! If you find a bug or have a feature request, please open an issue or submit a pull request.

This project is licensed under the **MIT License**.

## Author

Developed and maintained by **Sajid**.

---
*May Allah accept this humble effort.*
