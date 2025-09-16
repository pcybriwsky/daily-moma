# Daily MoMA Art

A minimal web app that displays a different piece of art from MoMA's collection every day.

## Features

- **Daily Artwork**: Shows a deterministic artwork selection based on the current date
- **MoMA Integration**: Fetches data directly from MoMA's GitHub repository
- **Clean Design**: Minimal, responsive interface
- **Direct Links**: Links to the artwork on MoMA's official website

## How It Works

The app fetches MoMA's complete artwork dataset from their GitHub repository and uses the current date to deterministically select which artwork to display. This ensures everyone sees the same artwork on the same day.

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment

This app is designed to be deployed on Vercel:

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy with one click

## Data Source

Artwork data is fetched from the [MoMA Collection GitHub repository](https://github.com/MuseumofModernArt/collection) using GitHub's media URL to access the Git LFS files.

## Future Enhancements

- Cache the dataset on the server for better performance
- Add artwork images (requires mapping ObjectIDs to image URLs)
- Add social sharing functionality
- Implement artwork history/favorites
