# Environment Variables

The application relies on the following environment variables. Create a `.env.local` file in the root directory to set these for local development.

## Required Variables

### `VITE_GEMINI_API_KEY`

- **Description**: The API Key for accessing Google's Gemini models.
- **Required**: Yes
- **Format**: String (starts with `AIza...`)
- **Where to get**: [Google AI Studio](https://aistudio.google.com/)

## Example `.env.local`

```env
VITE_GEMINI_API_KEY=AIzaSyDxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

> **Note**: Variables must start with `VITE_` to be exposed to the client-side code by Vite.
