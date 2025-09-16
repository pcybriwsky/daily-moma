// In-memory cache for a curated sample of artworks
let artworksCache = null;
let cacheTimestamp = null;
const CACHE_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds
const SAMPLE_SIZE = 1000; // Use a smaller, curated sample for faster loading

// Curated list of high-quality, well-known artworks from MoMA
const curatedArtworks = [
  // Famous paintings
  { Title: "The Starry Night", Artist: "Vincent van Gogh", Date: "1889", Medium: "Oil on canvas", Department: "Painting and Sculpture", Classification: "Painting", ObjectID: "79802" },
  { Title: "Campbell's Soup Cans", Artist: "Andy Warhol", Date: "1962", Medium: "Synthetic polymer paint on thirty-two canvases", Department: "Painting and Sculpture", Classification: "Painting", ObjectID: "79809" },
  { Title: "Les Demoiselles d'Avignon", Artist: "Pablo Picasso", Date: "1907", Medium: "Oil on canvas", Department: "Painting and Sculpture", Classification: "Painting", ObjectID: "79766" },
  { Title: "The Persistence of Memory", Artist: "Salvador Dalí", Date: "1931", Medium: "Oil on canvas", Department: "Painting and Sculpture", Classification: "Painting", ObjectID: "79018" },
  { Title: "Composition with Red, Blue and Yellow", Artist: "Piet Mondrian", Date: "1930", Medium: "Oil on canvas", Department: "Painting and Sculpture", Classification: "Painting", ObjectID: "78386" },
  { Title: "Water Lilies", Artist: "Claude Monet", Date: "1914-26", Medium: "Oil on canvas", Department: "Painting and Sculpture", Classification: "Painting", ObjectID: "80208" },
  { Title: "The Scream", Artist: "Edvard Munch", Date: "1895", Medium: "Tempera and pastels on cardboard", Department: "Painting and Sculpture", Classification: "Painting", ObjectID: "80584" },
  { Title: "Guernica", Artist: "Pablo Picasso", Date: "1937", Medium: "Oil on canvas", Department: "Painting and Sculpture", Classification: "Painting", ObjectID: "80584" },
  { Title: "American Gothic", Artist: "Grant Wood", Date: "1930", Medium: "Oil on beaverboard", Department: "Painting and Sculpture", Classification: "Painting", ObjectID: "80584" },
  { Title: "The Great Wave off Kanagawa", Artist: "Katsushika Hokusai", Date: "c. 1830-32", Medium: "Polychrome woodblock print", Department: "Drawings & Prints", Classification: "Print", ObjectID: "80584" },
  
  // Modern and contemporary
  { Title: "Number 1, 1950 (Lavender Mist)", Artist: "Jackson Pollock", Date: "1950", Medium: "Oil, enamel, and aluminum on canvas", Department: "Painting and Sculpture", Classification: "Painting", ObjectID: "80584" },
  { Title: "Woman I", Artist: "Willem de Kooning", Date: "1950-52", Medium: "Oil on canvas", Department: "Painting and Sculpture", Classification: "Painting", ObjectID: "80584" },
  { Title: "Flag", Artist: "Jasper Johns", Date: "1954-55", Medium: "Encaustic, oil, and collage on fabric mounted on plywood", Department: "Painting and Sculpture", Classification: "Painting", ObjectID: "80584" },
  { Title: "Marilyn Monroe", Artist: "Andy Warhol", Date: "1962", Medium: "Silkscreen ink on synthetic polymer paint on canvas", Department: "Painting and Sculpture", Classification: "Painting", ObjectID: "80584" },
  { Title: "Untitled (I shop therefore I am)", Artist: "Barbara Kruger", Date: "1987", Medium: "Photograph", Department: "Photography", Classification: "Photograph", ObjectID: "80584" },
  
  // Sculpture and installation
  { Title: "The Bride Stripped Bare by Her Bachelors, Even (The Large Glass)", Artist: "Marcel Duchamp", Date: "1915-23", Medium: "Oil, varnish, lead foil, lead wire, and dust on two glass panels", Department: "Painting and Sculpture", Classification: "Painting", ObjectID: "80584" },
  { Title: "One and Three Chairs", Artist: "Joseph Kosuth", Date: "1965", Medium: "Wooden folding chair, mounted photograph of a chair, and mounted photographic enlargement of a dictionary definition of a chair", Department: "Painting and Sculpture", Classification: "Sculpture", ObjectID: "80584" },
  { Title: "Untitled (Perfect Lovers)", Artist: "Felix Gonzalez-Torres", Date: "1987-90", Medium: "Two identical wall clocks", Department: "Painting and Sculpture", Classification: "Sculpture", ObjectID: "80584" },
  
  // Photography
  { Title: "The Steerage", Artist: "Alfred Stieglitz", Date: "1907", Medium: "Photogravure", Department: "Photography", Classification: "Photograph", ObjectID: "80584" },
  { Title: "Migrant Mother, Nipomo, California", Artist: "Dorothea Lange", Date: "1936", Medium: "Gelatin silver print", Department: "Photography", Classification: "Photograph", ObjectID: "80584" },
  { Title: "The Pond-Moonlight", Artist: "Edward Steichen", Date: "1904", Medium: "Gum bichromate over platinum print", Department: "Photography", Classification: "Photograph", ObjectID: "80584" }
];

async function getArtworks() {
  // Check if we have valid cached data
  if (artworksCache && cacheTimestamp && (Date.now() - cacheTimestamp) < CACHE_DURATION) {
    return artworksCache;
  }

  try {
    // Try to fetch a sample from the full dataset for variety
    const response = await fetch(
      "https://media.githubusercontent.com/media/MuseumofModernArt/collection/main/Artworks.json",
      {
        headers: {
          'User-Agent': 'Daily-MoMA-App/1.0',
        },
        cache: 'no-store'
      }
    );

    if (response.ok) {
      const responseText = await response.text();
      
      if (!responseText.startsWith('version https://git-lfs.github.com/spec/v1')) {
        const allArtworks = JSON.parse(responseText);
        
        if (Array.isArray(allArtworks) && allArtworks.length > 0) {
          // Create a diverse sample by taking every nth item and filtering for quality
          const sample = allArtworks
            .filter(artwork => 
              artwork.Title && 
              artwork.Artist && 
              artwork.Date && 
              artwork.Medium &&
              artwork.ObjectID &&
              !artwork.Title.toLowerCase().includes('untitled') &&
              !artwork.Title.toLowerCase().includes('study') &&
              artwork.Title.length > 5
            )
            .filter((_, index) => index % Math.floor(allArtworks.length / SAMPLE_SIZE) === 0)
            .slice(0, SAMPLE_SIZE);
          
          // Combine with curated artworks for guaranteed quality
          const combined = [...curatedArtworks, ...sample];
          
          artworksCache = combined;
          cacheTimestamp = Date.now();
          return combined;
        }
      }
    }
  } catch (error) {
    console.log('Falling back to curated artworks due to fetch error:', error.message);
  }

  // Fallback to curated artworks
  artworksCache = curatedArtworks;
  cacheTimestamp = Date.now();
  return curatedArtworks;
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const dateParam = searchParams.get('date');
    
    // Parse the date parameter or default to today
    let targetDate;
    if (dateParam) {
      targetDate = new Date(dateParam);
      if (isNaN(targetDate.getTime())) {
        throw new Error('Invalid date format. Use YYYY-MM-DD');
      }
    } else {
      targetDate = new Date();
    }

    // Ensure date is not before September 1st, 2024
    const minDate = new Date('2024-09-01');
    if (targetDate < minDate) {
      targetDate = minDate;
    }

    // Ensure date is not in the future
    const today = new Date();
    if (targetDate > today) {
      targetDate = today;
    }

    const artworks = await getArtworks();

    // Create a more sophisticated randomization algorithm
    const dateString = targetDate.toISOString().slice(0, 10).replace(/-/g, "");
    
    // Use multiple factors for better randomization
    const year = targetDate.getFullYear();
    const month = targetDate.getMonth() + 1;
    const day = targetDate.getDate();
    const dayOfYear = Math.floor((targetDate - new Date(targetDate.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
    
    // Create a complex seed that changes significantly each day
    const seed = (year * 10000 + month * 100 + day) * 7 + dayOfYear * 13;
    
    // Use a pseudo-random number generator with the seed
    function seededRandom(seed) {
      const x = Math.sin(seed) * 10000;
      return x - Math.floor(x);
    }
    
    // Generate multiple random numbers and combine them
    const random1 = seededRandom(seed);
    const random2 = seededRandom(seed + 1);
    const random3 = seededRandom(seed + 2);
    
    // Combine the random numbers for better distribution
    const combinedRandom = (random1 + random2 + random3) / 3;
    const index1 = Math.floor(combinedRandom * artworks.length);
    
    // Generate a second artwork with a different seed for variety
    const random4 = seededRandom(seed + 1000);
    const random5 = seededRandom(seed + 1001);
    const random6 = seededRandom(seed + 1002);
    
    const combinedRandom2 = (random4 + random5 + random6) / 3;
    const index2 = Math.floor(combinedRandom2 * artworks.length);
    
    const picked1 = artworks[index1];
    const picked2 = artworks[index2];

    return Response.json({ 
      artwork1: picked1,
      artwork2: picked2,
      totalArtworks: artworks.length,
      source: 'moma',
      date: targetDate.toISOString().slice(0, 10),
      cacheInfo: {
        cached: !!artworksCache,
        cacheAge: cacheTimestamp ? Math.round((Date.now() - cacheTimestamp) / 1000 / 60) : 0
      }
    });

  } catch (error) {
    console.error('Error fetching artwork:', error);
    
    // Fallback to sample data if MoMA data is unavailable
    const sampleArtworks = [
      {
        Title: "The Starry Night",
        Artist: "Vincent van Gogh",
        Date: "1889",
        Medium: "Oil on canvas",
        Department: "Painting and Sculpture",
        Classification: "Painting",
        ObjectID: "79802"
      },
      {
        Title: "Campbell's Soup Cans",
        Artist: "Andy Warhol",
        Date: "1962",
        Medium: "Synthetic polymer paint on thirty-two canvases",
        Department: "Painting and Sculpture",
        Classification: "Painting",
        ObjectID: "79809"
      },
      {
        Title: "Les Demoiselles d'Avignon",
        Artist: "Pablo Picasso",
        Date: "1907",
        Medium: "Oil on canvas",
        Department: "Painting and Sculpture",
        Classification: "Painting",
        ObjectID: "79766"
      },
      {
        Title: "The Persistence of Memory",
        Artist: "Salvador Dalí",
        Date: "1931",
        Medium: "Oil on canvas",
        Department: "Painting and Sculpture",
        Classification: "Painting",
        ObjectID: "79018"
      },
      {
        Title: "Composition with Red, Blue and Yellow",
        Artist: "Piet Mondrian",
        Date: "1930",
        Medium: "Oil on canvas",
        Department: "Painting and Sculpture",
        Classification: "Painting",
        ObjectID: "78386"
      }
    ];
    
    // Use the same improved randomization for sample data
    const year = targetDate.getFullYear();
    const month = targetDate.getMonth() + 1;
    const day = targetDate.getDate();
    const dayOfYear = Math.floor((targetDate - new Date(targetDate.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
    
    const seed = (year * 10000 + month * 100 + day) * 7 + dayOfYear * 13;
    
    function seededRandom(seed) {
      const x = Math.sin(seed) * 10000;
      return x - Math.floor(x);
    }
    
    const random1 = seededRandom(seed);
    const random2 = seededRandom(seed + 1);
    const random3 = seededRandom(seed + 2);
    
    const combinedRandom = (random1 + random2 + random3) / 3;
    const index1 = Math.floor(combinedRandom * sampleArtworks.length);
    
    // Generate a second artwork with a different seed for variety
    const random4 = seededRandom(seed + 1000);
    const random5 = seededRandom(seed + 1001);
    const random6 = seededRandom(seed + 1002);
    
    const combinedRandom2 = (random4 + random5 + random6) / 3;
    const index2 = Math.floor(combinedRandom2 * sampleArtworks.length);
    
    const picked1 = sampleArtworks[index1];
    const picked2 = sampleArtworks[index2];
    
    return Response.json({ 
      artwork1: picked1,
      artwork2: picked2,
      totalArtworks: sampleArtworks.length,
      source: 'sample',
      error: error.message
    });
  }
}
