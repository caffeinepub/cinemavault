import type { DownloadUrl, Movie } from "../backend.d";

function makeDownloads(base720: string, base1080: string): DownloadUrl[] {
  return [
    { quality: "720p HD", url: base720 },
    { quality: "1080p Full HD", url: base1080 },
  ];
}

export const sampleMovies: Movie[] = [
  {
    id: BigInt(1),
    title: "Nosferatu",
    year: BigInt(1922),
    genre: "Silent Era",
    language: "Silent",
    synopsis:
      "A chilling tale of Count Orlok, a vampire who preys on the innocent. Thomas Hutter travels to Transylvania to complete a real estate transaction, only to discover his host harbors a terrible secret. One of cinema's first horror masterpieces and a landmark of German Expressionism.",
    thumbnailUrl: "/assets/generated/movie-nosferatu.dim_400x600.jpg",
    videoUrl: "https://archive.org/embed/Nosferatu_1922",
    downloadUrls: makeDownloads(
      "https://archive.org/download/Nosferatu_1922/Nosferatu_1922_512kb.mp4",
      "https://archive.org/download/Nosferatu_1922/Nosferatu_1922.ia.mp4",
    ),
    featured: true,
    addedAt: BigInt(1704067200),
  },
  {
    id: BigInt(2),
    title: "Metropolis",
    year: BigInt(1927),
    genre: "Silent Era",
    language: "Silent",
    synopsis:
      "Fritz Lang's visionary masterpiece set in a futuristic dystopian city where the privileged elite live in gleaming towers above the oppressed workers toiling underground. When the son of the city's master falls for a saintly girl from the depths, revolution ignites.",
    thumbnailUrl: "/assets/generated/movie-metropolis.dim_400x600.jpg",
    videoUrl: "https://archive.org/embed/Metropolis_1927",
    downloadUrls: makeDownloads(
      "https://archive.org/download/Metropolis_1927/Metropolis_1927_512kb.mp4",
      "https://archive.org/download/Metropolis_1927/Metropolis_1927.ia.mp4",
    ),
    featured: true,
    addedAt: BigInt(1704153600),
  },
  {
    id: BigInt(3),
    title: "The General",
    year: BigInt(1926),
    genre: "Comedy",
    language: "Silent",
    synopsis:
      "Buster Keaton's greatest comedy achievement. When Union spies steal his beloved locomotive, Confederate engineer Johnnie Gray gives chase across enemy territory in a breathtaking series of stunts and gags. A perfect blend of physical comedy and genuine action-adventure.",
    thumbnailUrl: "/assets/generated/movie-general.dim_400x600.jpg",
    videoUrl: "https://archive.org/embed/TheGeneral_928",
    downloadUrls: makeDownloads(
      "https://archive.org/download/TheGeneral_928/TheGeneral_512kb.mp4",
      "https://archive.org/download/TheGeneral_928/TheGeneral.ia.mp4",
    ),
    featured: false,
    addedAt: BigInt(1704240000),
  },
  {
    id: BigInt(4),
    title: "The Gold Rush",
    year: BigInt(1925),
    genre: "Comedy",
    language: "Silent",
    synopsis:
      "Charlie Chaplin's Tramp heads to the Klondike during the gold rush of 1898. Stranded in a snowbound cabin with a dangerous outlaw and driven by hunger, loneliness, and the search for love, the Tramp faces both comedy and heartbreak in equal measure.",
    thumbnailUrl: "/assets/generated/movie-chaplin-goldrush.dim_400x600.jpg",
    videoUrl: "https://archive.org/embed/TheGoldRush1925",
    downloadUrls: makeDownloads(
      "https://archive.org/download/TheGoldRush1925/TheGoldRush_512kb.mp4",
      "https://archive.org/download/TheGoldRush1925/TheGoldRush.ia.mp4",
    ),
    featured: true,
    addedAt: BigInt(1704326400),
  },
  {
    id: BigInt(5),
    title: "The Cabinet of Dr. Caligari",
    year: BigInt(1920),
    genre: "Silent Era",
    language: "Silent",
    synopsis:
      "A deranged doctor uses a somnambulist to commit murders in a German village. Told through a frame narrative with shocking expressionist sets of jagged angles and painted shadows, this film laid the groundwork for psychological horror cinema.",
    thumbnailUrl: "/assets/generated/movie-cabinet.dim_400x600.jpg",
    videoUrl: "https://archive.org/embed/TheCabinetOfDrCaligari",
    downloadUrls: makeDownloads(
      "https://archive.org/download/TheCabinetOfDrCaligari/Caligari_512kb.mp4",
      "https://archive.org/download/TheCabinetOfDrCaligari/Caligari.ia.mp4",
    ),
    featured: false,
    addedAt: BigInt(1704412800),
  },
  {
    id: BigInt(6),
    title: "The Phantom of the Opera",
    year: BigInt(1925),
    genre: "Silent Era",
    language: "Silent",
    synopsis:
      "Lon Chaney delivers a tour-de-force performance as Erik, the disfigured musical genius who haunts the catacombs beneath the Paris Opera House. His obsession with soprano Christine Daaé leads to one of cinema's most iconic unmasking scenes.",
    thumbnailUrl: "/assets/generated/movie-phantom-opera.dim_400x600.jpg",
    videoUrl: "https://archive.org/embed/ThePhantomOfTheOpera1925",
    downloadUrls: makeDownloads(
      "https://archive.org/download/ThePhantomOfTheOpera1925/Phantom_512kb.mp4",
      "https://archive.org/download/ThePhantomOfTheOpera1925/Phantom.ia.mp4",
    ),
    featured: false,
    addedAt: BigInt(1704499200),
  },
  {
    id: BigInt(7),
    title: "Sunrise: A Song of Two Humans",
    year: BigInt(1927),
    genre: "Documentary",
    language: "Silent",
    synopsis:
      "F.W. Murnau's transcendent masterpiece follows a farmer who nearly kills his wife at the urging of a city woman, then spends the day reconciling with her. Winner of three Academy Awards at the inaugural ceremony, it remains a pinnacle of visual storytelling.",
    thumbnailUrl: "/assets/generated/movie-sunrise.dim_400x600.jpg",
    videoUrl: "https://archive.org/embed/sunrise-murnau-1927",
    downloadUrls: makeDownloads(
      "https://archive.org/download/sunrise-murnau-1927/Sunrise_512kb.mp4",
      "https://archive.org/download/sunrise-murnau-1927/Sunrise.ia.mp4",
    ),
    featured: true,
    addedAt: BigInt(1704585600),
  },
  {
    id: BigInt(8),
    title: "Intolerance",
    year: BigInt(1916),
    genre: "Action",
    language: "Silent",
    synopsis:
      "D.W. Griffith's ambitious epic interweaves four stories across different eras — Babylon, Judea, the French Renaissance, and modern America — to illustrate mankind's persistent struggle against intolerance. An unprecedented technical achievement featuring the largest sets ever built for a film.",
    thumbnailUrl: "/assets/generated/movie-intolerance.dim_400x600.jpg",
    videoUrl: "https://archive.org/embed/Intolerance1916",
    downloadUrls: makeDownloads(
      "https://archive.org/download/Intolerance1916/Intolerance_512kb.mp4",
      "https://archive.org/download/Intolerance1916/Intolerance.ia.mp4",
    ),
    featured: false,
    addedAt: BigInt(1704672000),
  },
  {
    id: BigInt(9),
    title: "Battleship Potemkin",
    year: BigInt(1925),
    genre: "Action",
    language: "Silent",
    synopsis:
      "Sergei Eisenstein's revolutionary masterwork dramatizes the 1905 mutiny aboard the battleship Potemkin and its aftermath. The Odessa Steps sequence remains cinema's most studied example of montage technique, influencing countless filmmakers across a century.",
    thumbnailUrl: "/assets/generated/movie-battleship-potemkin.dim_400x600.jpg",
    videoUrl: "https://archive.org/embed/BattleshipPotemkin1925",
    downloadUrls: makeDownloads(
      "https://archive.org/download/BattleshipPotemkin1925/Potemkin_512kb.mp4",
      "https://archive.org/download/BattleshipPotemkin1925/Potemkin.ia.mp4",
    ),
    featured: false,
    addedAt: BigInt(1704758400),
  },
  {
    id: BigInt(10),
    title: "The Navigator",
    year: BigInt(1924),
    genre: "Comedy",
    language: "Silent",
    synopsis:
      "Buster Keaton stars as a wealthy idle young man who finds himself alone on a drifting ocean liner with a woman he once courted. The two must learn to survive against incredible odds aboard the vast empty ship, resulting in a series of brilliantly choreographed comedy setpieces.",
    thumbnailUrl: "/assets/generated/movie-keaton-navigator.dim_400x600.jpg",
    videoUrl: "https://archive.org/embed/TheNavigator1924",
    downloadUrls: makeDownloads(
      "https://archive.org/download/TheNavigator1924/Navigator_512kb.mp4",
      "https://archive.org/download/TheNavigator1924/Navigator.ia.mp4",
    ),
    featured: false,
    addedAt: BigInt(1704844800),
  },
];
