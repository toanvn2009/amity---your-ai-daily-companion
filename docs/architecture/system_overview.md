# Amity AI - System Architecture

## Overview

Amity AI là một trợ lý ảo cá nhân hóa cao, tập trung vào trải nghiệm cảm xúc và trí nhớ dài hạn. Ứng dụng được xây dựng theo mô hình Single Page Application (SPA), chạy trực tiếp trên trình duyệt.

## Tech Stack

- **Frontend Framework**: React 19 (Vite)
- **Styling**: Tailwind CSS với Glassmorphism Design
- **AI Engine**: Google Gemini API (Model: `gemini-2.5-flash`)
- **Data Persistence**: Browser Local Storage & JSON Export/Import
- **Deployment**: Vercel

## Key Components

### 1. AI Service (`services/gemini.ts`)

- Tiếp nhận lịch sử hội thoại, profile người dùng và trí nhớ.
- Sử dụng **Structured Output (JSON Mode)** để trích xuất thông tin quan trọng cần nhớ (Memory Extraction) song song với việc tạo câu trả lời.
- Cấu hình Safety Settings để cho phép các kịch bản Roleplay tình cảm (Sweet Mode).

### 2. Personalization System

- **Tone System**: 5 chế độ nhân cách (Default, Coach, Bestie, Zen, Sweet).
- **Memory Manager**: Lưu trữ các sự kiện, sở thích của người dùng dưới dạng mảng chuỗi, được AI tích hợp vào Context của mọi phiên chat.

### 3. Productivity & Wellness

- **Daily Check-in**: Theo dõi tâm trạng mỗi ngày.
- **Habit/Goal Tracking**: Quản lý mục tiêu và chuỗi thói quen.
- **Ambient Player**: Cung cấp nhạc nền thư giãn để tăng tương tác.

### 4. Deployment Pipeline

- Build qua Vite.
- Static assets (Privacy, Terms, Robots) phục vụ SEO và pháp lý.
- Cấu hình `vercel.json` hỗ trợ SPA routing.
