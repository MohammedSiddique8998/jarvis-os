# JARVIS OS

JARVIS OS is a cinematic AI companion interface for Sid. It replaces the earlier dashboard-style prototype with a full-screen holographic operating system built on Next.js, Three.js, Framer Motion, speech recognition, and speech synthesis.

## Production Direction

- Futuristic AI companion experience, not a business dashboard
- Humanoid holographic avatar scene with particles, rings, galaxy background, and mouse-reactive camera movement
- ChatGPT-style conversation panel with transitions, scroll management, and typing indicators
- Voice interaction using the browser Web Speech APIs where supported
- Mission widgets for Bibby Marine Internship, MSc Dissertation, Job Applications, and AI Portfolio
- UI copy uses "Sid" and avoids displaying legacy full-name identity fields

## Architecture

```text
app/
  layout.tsx
  page.tsx
  globals.css
components/
  AgentSidebar.tsx
  AvatarScene.tsx
  ChatPanel.tsx
  MissionPanel.tsx
  StatusPanel.tsx
  VoiceOrb.tsx
public/
  models/
    README.md
```

## Avatar Model Support

The scene is production-safe without a model file because it renders a procedural holographic humanoid fallback. To use a custom model, place it at:

```text
public/models/jarvis-avatar.glb
```

The UI reserves this path for the JARVIS avatar asset.

## Local Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Build Validation

```bash
npm run lint
npm run build
```

## Voice Support

Voice features use browser speech recognition and speech synthesis. They work best in Chrome or Edge. If speech recognition is unavailable, typed commands remain fully usable.

## Deployment

This project is optimized for Vercel:

```bash
npm run build
```

No paid API key is required for the current client-side companion experience.
