# Changelog

All notable changes to the Amity AI project will be documented in this file.

## [Unreleased]

## [2026-01-24] - Trang AI Rebranding & UI Polish

### Added

- **Back to Top Button**: Added a smooth-scroll button that appears after scrolling, optimized for both Mobile and Desktop.
- **Font Update**: Integrated **Merriweather** font for chat content and input to enhance reading experience and emotional depth.
- **Upload Button**: Restored and integrated the image upload button directly into the `ChatInput` bar for both Desktop and Mobile.

### Changed

- **Rebranding**: Renamed project from "Amity AI" to "**Trang AI**".
  - Updated Sidebar, Header, SEO metadata, and Footer.
  - Persona "Sweet" is now the default and only persona, labeled "**Trang**".
- **ChatInput Redesign**:
  - Unified Mic, Upload, and Send buttons into a single cohesive glassmorphism container.
  - Fixed layout alignment issues and optimized for full-width on mobile.
- **Mobile Experience**:
  - Removed side padding on mobile for an immersive, full-width chat view.
  - Increased chat bubble max-width.
- **Memory**: Increased long-term memory capacity from 100 to **200 items**.
- **Persona Simplification**:
  - Removed Coach, Bestie, and Zen personas to focus solely on the "Romantic Partner" experience.
  - Updated Quick Actions prompts to use affectionate "Anh - Em" pronouns.

## [2026-01-23] - Amity 2.0 Evolution & Production

### Added

- **Ambient Music Player**: Hệ thống phát nhạc thư giãn MP3 từ Pixabay (Lofi, Piano, Rain).
- **Data Manager**: Chức năng Export/Import dữ liệu người dùng dưới dạng JSON trong Sidebar.
- **Production Assets**: Thêm `robots.txt`, `sitemap.xml`, `privacy.md`, `terms.md` cho bản chính thức.
- **Deployment**: Deploy thành công lên Vercel và cấu hình Biến môi trường thông qua CLI & Browser Plugin.

### Changed

- **Gemini 2.5 Flash**: Nâng cấp model trí tuệ lên phiên bản 2.5 mới nhất.
- **Mobile Optimization**:
  - Đạt chuẩn iOS: ép font size 16px cho input để chặn auto-zoom.
  - Tối giản UI: Ẩn Avatar, nút Up ảnh, và các nút cồng kềnh trên mobile.
  - Gom SOS và Ambient Player vào Sidebar Menu.
- **Dark Mode**: Đồng bộ hóa theme với Tailwind config, fix lỗi tương phản chữ.

### Fixed

- Lỗi không cuộn được thanh Quick Actions trên mobile.
- Lỗi logic `onQuickChat is not defined`.
- Lỗi hiển thị Dark Mode bị override bởi setting hệ thống.

## [2026-01-18] - Amity 2.0 "The Sentient Update" Sprint

### Added

- **Persona System**: Added dynamic avatars and distinct personalities (Sweet, Coach, Bestie, Zen) that change the AI's tone and icon.
- **Sweet Mode Enhancements**: Deeply customized "Sweet" mode to be affectionate, supportive, and prioritize the user emotionally.
- **Quick Actions**: Expanded to 10 diverse options with a new horizontal scroll UI.
- **Mood Tracking**: Integrated `MoodChart` with `recharts` to visualize emotional history.
- **Structured Memory**: Implemented JSON Schema extraction for precise memory management.
- **Image Support**: Added ability to upload and analyze images with Gemini Vision.

### Changed

- **Response Quality**: Enforced multi-paragraph, detailed responses in `gemini.ts` to solve "short answer" issues.
- **UI Overhaul**: Applied "Luxury Dark" glassmorphism theme across the app.
- **Memory Logic**: Switched from Regex to Structured Output for memory extraction.

### Removed

- **Text-to-Speech (TTS)**: Completely removed all TTS functionality (Google TTS & Native Browser TTS) per user request to focus on text interaction.
- **Old Icons**: Removed hardcoded SVGs in favor of cleaner UI (Partial migration to Lucide upcoming).

### Fixed

- **QuickActions**: Fixed a syntax error in the component declaration.
- **App State**: Restored lost state definitions in `App.tsx` during refactoring.
