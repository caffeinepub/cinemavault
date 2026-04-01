import Text "mo:core/Text";
import Int "mo:core/Int";
import Iter "mo:core/Iter";
import Time "mo:core/Time";
import Nat "mo:core/Nat";
import Array "mo:core/Array";
import Runtime "mo:core/Runtime";
import Map "mo:core/Map";
import Order "mo:core/Order";

actor {
  type Movie = {
    id : Nat;
    title : Text;
    year : Nat;
    genre : Text;
    language : Text;
    synopsis : Text;
    thumbnailUrl : Text;
    videoUrl : Text;
    downloadUrls : [DownloadUrl];
    featured : Bool;
    addedAt : Int;
  };

  type DownloadUrl = { quality : Text; url : Text };

  let movies = Map.empty<Nat, Movie>();
  var nextMovieId = 1;

  module Movie {
    public func compare(movie1 : Movie, movie2 : Movie) : Order.Order {
      Nat.compare(movie1.id, movie2.id);
    };

    public func compareByAddedAt(movie1 : Movie, movie2 : Movie) : Order.Order {
      Int.compare(movie2.addedAt, movie1.addedAt);
    };

    public func compareByYear(movie1 : Movie, movie2 : Movie) : Order.Order {
      Nat.compare(movie2.year, movie1.year);
    };
  };

  func getMovieInternal(id : Nat) : Movie {
    switch (movies.get(id)) {
      case (null) { Runtime.trap("Movie not found") };
      case (?movie) { movie };
    };
  };

  // Movie Operations
  public query ({ caller }) func getMovieById(id : Nat) : async Movie {
    getMovieInternal(id);
  };

  public query ({ caller }) func getAllMovies() : async [Movie] {
    movies.values().toArray().sort();
  };

  public query ({ caller }) func searchMovies(keyword : Text) : async [Movie] {
    let lowerKeyword = keyword.toLower();
    movies.values().toArray().filter(
      func(movie) {
        movie.title.toLower().contains(#text lowerKeyword);
      }
    ).sort();
  };

  public query ({ caller }) func filterMovies(genre : ?Text, year : ?Nat, language : ?Text) : async [Movie] {
    movies.values().toArray().filter(
      func(movie) {
        let genreMatch = switch (genre) {
          case (null) { true };
          case (?g) { Text.equal(movie.genre, g) };
        };
        let yearMatch = switch (year) {
          case (null) { true };
          case (?y) { movie.year == y };
        };
        let languageMatch = switch (language) {
          case (null) { true };
          case (?l) { Text.equal(movie.language, l) };
        };
        genreMatch and yearMatch and languageMatch;
      }
    ).sort();
  };

  public query ({ caller }) func getFeaturedMovies() : async [Movie] {
    movies.values().toArray().filter(
      func(movie) { movie.featured }
    ).sort();
  };

  public query ({ caller }) func getRecentMovies(limit : Nat) : async [Movie] {
    let sortedMovies = movies.values().toArray().sort(Movie.compareByAddedAt);
    let actualLimit = Nat.min(limit, sortedMovies.size());
    Array.tabulate<Movie>(actualLimit, func(i) { sortedMovies[i] });
  };

  public query ({ caller }) func getMoviesByYear(year : Nat) : async [Movie] {
    movies.values().toArray().filter(
      func(movie) { movie.year == year }
    ).sort();
  };

  // Admin Functions
  public shared ({ caller }) func addOrUpdateMovie(
    id : Nat,
    title : Text,
    year : Nat,
    genre : Text,
    language : Text,
    synopsis : Text,
    thumbnailUrl : Text,
    videoUrl : Text,
    downloadUrls : [DownloadUrl],
    featured : Bool
  ) : async Nat {
    let timestamp = Time.now();

    let movieId = if (id == 0) {
      let newId = nextMovieId;
      nextMovieId += 1;
      newId;
    } else { id };

    let movie : Movie = {
      id = movieId;
      title;
      year;
      genre;
      language;
      synopsis;
      thumbnailUrl;
      videoUrl;
      downloadUrls;
      featured;
      addedAt = timestamp;
    };

    movies.add(movieId, movie);
    movieId;
  };

  public shared ({ caller }) func removeMovie(id : Nat) : async () {
    if (not movies.containsKey(id)) { Runtime.trap("Movie not found") };
    movies.remove(id);
  };

  func initWithSeedData() {
    movies.clear();
    nextMovieId := 1;

    let seedData : [Movie] = [
      {
        id = 1;
        title = "Night of the Living Dead";
        year = 1968;
        genre = "Horror";
        language = "English";
        synopsis = "A group of people try to survive an attack of bloodthirsty zombies while trapped in a rural Pennsylvania farmhouse.";
        thumbnailUrl = "https://archive.org/download/NightOfTheLivingDead_201303/NightOfTheLivingDead0001.jpg";
        videoUrl = "https://archive.org/embed/NightOfTheLivingDead_201303";
        downloadUrls = [
          { quality = "SD"; url = "https://archive.org/download/NightOfTheLivingDead_201303/NightOfTheLivingDead_512kb.mp4" },
          { quality = "HQ"; url = "https://archive.org/download/NightOfTheLivingDead_201303/NightOfTheLivingDead_512kb.mp4" },
        ];
        featured = true;
        addedAt = Time.now();
      },
      {
        id = 2;
        title = "Plan 9 from Outer Space";
        year = 1959;
        genre = "Sci-Fi";
        language = "English";
        synopsis = "Alien invaders resurrect dead humans as zombies and vampires to stop humanity from creating the Solaranite, a sun-driven bomb.";
        thumbnailUrl = "https://archive.org/download/plan_9_from_outer_space/Plan_9_From_Outer_Space.jpg";
        videoUrl = "https://archive.org/embed/plan_9_from_outer_space";
        downloadUrls = [
          { quality = "SD"; url = "https://archive.org/download/plan_9_from_outer_space/Plan_9_from_Outer_Space_512kb.mp4" },
          { quality = "HQ"; url = "https://archive.org/download/plan_9_from_outer_space/Plan_9_From_Outer_Space.mp4" },
        ];
        featured = true;
        addedAt = Time.now();
      },
      {
        id = 3;
        title = "The Most Dangerous Game";
        year = 1932;
        genre = "Action";
        language = "English";
        synopsis = "A madman hunts shipwrecked survivors on his remote tropical island.";
        thumbnailUrl = "https://archive.org/download/most_dangerous_game_ipod/most_dangerous_game_ipod.jpg";
        videoUrl = "https://archive.org/embed/most_dangerous_game_ipod";
        downloadUrls = [
          { quality = "SD"; url = "https://archive.org/download/most_dangerous_game_ipod/most_dangerous_game_ipod.mp4" },
        ];
        featured = false;
        addedAt = Time.now();
      },
      {
        id = 4;
        title = "Metropolis";
        year = 1927;
        genre = "Sci-Fi";
        language = "Silent";
        synopsis = "In a futuristic city sharply divided between the working class and the city planners, the son of the city's mastermind falls in love with a working-class prophet.";
        thumbnailUrl = "https://archive.org/download/Metropolis/Metropolis.jpg";
        videoUrl = "https://archive.org/embed/metropolis_202203";
        downloadUrls = [
          { quality = "SD"; url = "https://archive.org/download/metropolis_202203/Metropolis.mp4" },
        ];
        featured = true;
        addedAt = Time.now();
      },
      {
        id = 5;
        title = "Nosferatu";
        year = 1922;
        genre = "Horror";
        language = "Silent";
        synopsis = "Vampire count Orlok expresses interest in a new residence and real estate agent Hutter's wife.";
        thumbnailUrl = "https://archive.org/download/Nosferatu1922FullGermanFeatureFilm/Nosferatu1922FullGermanFeatureFilm.jpg";
        videoUrl = "https://archive.org/embed/Nosferatu1922FullGermanFeatureFilm";
        downloadUrls = [
          { quality = "SD"; url = "https://archive.org/download/Nosferatu1922FullGermanFeatureFilm/Nosferatu1922FullGermanFeatureFilm.mp4" },
        ];
        featured = true;
        addedAt = Time.now();
      },
      {
        id = 6;
        title = "The Kid";
        year = 1921;
        genre = "Comedy";
        language = "Silent";
        synopsis = "In this silent comedy, an abandoned child is taken in by a tramp. The two must defeat child services and keep the child from his biological mother.";
        thumbnailUrl = "https://archive.org/download/CharlieChaplin_885/TheKid.png";
        videoUrl = "https://archive.org/embed/CharlieChaplin_885";
        downloadUrls = [
          { quality = "SD"; url = "https://archive.org/download/CharlieChaplin_885/TheKid.mp4" },
        ];
        featured = false;
        addedAt = Time.now();
      },
      {
        id = 7;
        title = "Sherlock Holmes' Baffling Cases";
        year = 1905;
        genre = "Detective";
        language = "Silent";
        synopsis = "Silent short films about the legendary detective Sherlock Holmes.";
        thumbnailUrl = "https://archive.org/download/short-films-1907-1908/Sherlock%20Holmes%27%20Baffling%20Cases.jpg";
        videoUrl = "https://archive.org/embed/short-films-1907-1908/SherlockHolmes";
        downloadUrls = [
          { quality = "SD"; url = "https://archive.org/download/short-films-1907-1908/Sherlock%20Holmes%27%20Baffling%20Cases.mp4" },
        ];
        featured = true;
        addedAt = Time.now();
      },
      {
        id = 8;
        title = "A Trip to the Moon";
        year = 1902;
        genre = "Sci-Fi";
        language = "Silent";
        synopsis = "Considered one of the first science fiction films, a group of astronomers go on an expedition to the Moon.";
        thumbnailUrl = "https://archive.org/download/a_trip_to_the_moon_1902/TripToTheMoon%281902%29.png";
        videoUrl = "https://archive.org/embed/a_trip_to_the_moon_1902";
        downloadUrls = [
          { quality = "SD"; url = "https://archive.org/download/a_trip_to_the_moon_1902/TripToTheMoon.mp4" },
        ];
        featured = false;
        addedAt = Time.now();
      },
      {
        id = 9;
        title = "Great Train Robbery";
        year = 1903;
        genre = "Western";
        language = "Silent";
        synopsis = "Considered one of the earliest American Westerns, outlaws rob a train and shoot a passenger.";
        thumbnailUrl = "https://archive.org/download/great_train_robbery_1903/GreatTrainRobbery.jpg";
        videoUrl = "https://archive.org/embed/great_train_robbery_1903";
        downloadUrls = [
          { quality = "SD"; url = "https://archive.org/download/great_train_robbery_1903/GreatTrainRobbery.mp4" },
        ];
        featured = true;
        addedAt = Time.now();
      },

      {
        id = 10;
        title = "House on Haunted Hill";
        year = 1959;
        genre = "Horror";
        language = "English";
        synopsis = "A millionaire offers $10,000 to spend the night in a haunted house. Those brave enough to stay fall prey to terrifying events.";
        thumbnailUrl = "https://archive.org/download/House_on_Haunted_Hill/HouseOnHauntedHill.jpg";
        videoUrl = "https://archive.org/embed/House_on_Haunted_Hill";
        downloadUrls = [
          { quality = "SD"; url = "https://archive.org/download/House_on_Haunted_Hill/HouseOnHauntedHill.mp4" },
        ];
        featured = false;
        addedAt = Time.now();
      },
      {
        id = 11;
        title = "His Girl Friday";
        year = 1940;
        genre = "Comedy";
        language = "English";
        synopsis = "A newspaper editor uses every trick in the book to keep his ace reporter ex-wife from remarrying.";
        thumbnailUrl = "https://archive.org/download/his_girl_friday/his_girl_friday.jpg";
        videoUrl = "https://archive.org/embed/his_girl_friday";
        downloadUrls = [
          { quality = "SD"; url = "https://archive.org/download/his_girl_friday/his_girl_friday_512kb.mp4" },
        ];
        featured = true;
        addedAt = Time.now();
      },
      {
        id = 12;
        title = "Charade";
        year = 1963;
        genre = "Thriller";
        language = "English";
        synopsis = "Three men chase a woman in Paris as they try to recover a fortune stolen by her dead husband.";
        thumbnailUrl = "https://archive.org/download/charade_201910/charade_201910.thumbs/charade_000.jpg";
        videoUrl = "https://archive.org/embed/charade_201910";
        downloadUrls = [
          { quality = "SD"; url = "https://archive.org/download/charade_201910/charade_201910.mp4" },
        ];
        featured = false;
        addedAt = Time.now();
      },
      {
        id = 13;
        title = "D.O.A.";
        year = 1949;
        genre = "Film Noir";
        language = "English";
        synopsis = "A man is poisoned and must find his killer before he dies.";
        thumbnailUrl = "https://archive.org/download/D.O.A.1949/D.O.A.-1949.jpg";
        videoUrl = "https://archive.org/embed/D.O.A.1949";
        downloadUrls = [
          { quality = "SD"; url = "https://archive.org/download/D.O.A.1949/D.O.A.1949.512kb.mp4" },
        ];
        featured = false;
        addedAt = Time.now();
      },
      {
        id = 14;
        title = "Big Buck Bunny";
        year = 2008;
        genre = "Animation";
        language = "None";
        synopsis = "A giant rabbit takes a stand against bullying and gets revenge on three rodent tormentors.";
        thumbnailUrl = "https://archive.org/download/big_buck_bunny/big_buck_bunny.jpg";
        videoUrl = "https://archive.org/embed/big_buck_bunny";
        downloadUrls = [
          { quality = "SD"; url = "https://archive.org/download/big_buck_bunny/big_buck_bunny.mp4" },
        ];
        featured = true;
        addedAt = Time.now();
      },
      {
        id = 15;
        title = "The Lost World";
        year = 1925;
        genre = "Adventure";
        language = "Silent";
        synopsis = "Explorers hunt for prehistoric animals and battles in a lost world, believed to have never existed.";
        thumbnailUrl = "https://archive.org/download/LostWorld_201912/LostWorld.jpg";
        videoUrl = "https://archive.org/embed/LostWorld_201912";
        downloadUrls = [
          { quality = "SD"; url = "https://archive.org/download/LostWorld_201912/LostWorld.mp4" },
        ];
        featured = false;
        addedAt = Time.now();
      },
      {
        id = 16;
        title = "The Phantom of the Opera";
        year = 1925;
        genre = "Horror";
        language = "Silent";
        synopsis = "A mad, disfigured composer seeks love with a lovely young opera singer.";
        thumbnailUrl = "https://archive.org/download/PhantomOfTheOpera1925_201510/PhantomOfTheOpera.jpg";
        videoUrl = "https://archive.org/embed/PhantomOfTheOpera1925_201510";
        downloadUrls = [
          { quality = "SD"; url = "https://archive.org/download/PhantomOfTheOpera1925_201510/PhantomOfTheOpera.mp4" },
        ];
        featured = true;
        addedAt = Time.now();
      },
      {
        id = 17;
        title = "The General";
        year = 1926;
        genre = "Comedy";
        language = "Silent";
        synopsis = "Buster Keaton stars as a Southern railway engineer during the American Civil War.";
        thumbnailUrl = "https://archive.org/download/the_general/TheGeneral.jpg";
        videoUrl = "https://archive.org/embed/the_general";
        downloadUrls = [
          { quality = "SD"; url = "https://archive.org/download/the_general/TheGeneral.mp4" },
        ];
        featured = false;
        addedAt = Time.now();
      },
      {
        id = 18;
        title = "Pathala Bhairavi";
        year = 1951;
        genre = "Fantasy";
        language = "Telugu";
        synopsis = "A young prince embarks on a magical adventure involving a sorcerer and buried treasure, in this classic Telugu fantasy film.";
        thumbnailUrl = "https://archive.org/download/PathalaiBhairavi1951/PathalaiBhairavi1951.jpg";
        videoUrl = "https://archive.org/embed/PathalaiBhairavi1951";
        downloadUrls = [
          { quality = "SD"; url = "https://archive.org/download/PathalaiBhairavi1951/PathalaiBhairavi1951.mp4" },
        ];
        featured = true;
        addedAt = Time.now();
      },
      {
        id = 19;
        title = "Maya Bazaar";
        year = 1957;
        genre = "Mythology";
        language = "Telugu";
        synopsis = "Lord Krishna plays tricks to ensure the marriage of Abhimanyu and Sasirekha in this beloved mythological classic.";
        thumbnailUrl = "https://archive.org/download/MayaBazaar1957/MayaBazaar1957.jpg";
        videoUrl = "https://archive.org/embed/MayaBazaar1957";
        downloadUrls = [
          { quality = "SD"; url = "https://archive.org/download/MayaBazaar1957/MayaBazaar1957.mp4" },
        ];
        featured = true;
        addedAt = Time.now();
      },
      {
        id = 20;
        title = "Devadasu";
        year = 1953;
        genre = "Drama";
        language = "Telugu";
        synopsis = "A tragic love story of Devadas who turns to alcohol after being separated from his childhood sweetheart Paro.";
        thumbnailUrl = "https://archive.org/download/Devadasu1953Telugu/Devadasu1953.jpg";
        videoUrl = "https://archive.org/embed/Devadasu1953Telugu";
        downloadUrls = [
          { quality = "SD"; url = "https://archive.org/download/Devadasu1953Telugu/Devadasu1953.mp4" },
        ];
        featured = false;
        addedAt = Time.now();
      },
      {
        id = 21;
        title = "Missamma";
        year = 1955;
        genre = "Comedy";
        language = "Telugu";
        synopsis = "Two unemployed people pretend to be a married couple to secure teaching jobs, leading to comic situations and real romance.";
        thumbnailUrl = "https://archive.org/download/Missamma1955/Missamma1955.jpg";
        videoUrl = "https://archive.org/embed/Missamma1955";
        downloadUrls = [
          { quality = "SD"; url = "https://archive.org/download/Missamma1955/Missamma1955.mp4" },
        ];
        featured = false;
        addedAt = Time.now();
      },
      {
        id = 22;
        title = "Lava Kusa";
        year = 1963;
        genre = "Mythology";
        language = "Telugu";
        synopsis = "The story of Rama's twin sons Lava and Kusa who unknowingly battle their father and later reveal their true identity.";
        thumbnailUrl = "https://archive.org/download/LavaKusa1963/LavaKusa1963.jpg";
        videoUrl = "https://archive.org/embed/LavaKusa1963";
        downloadUrls = [
          { quality = "SD"; url = "https://archive.org/download/LavaKusa1963/LavaKusa1963.mp4" },
        ];
        featured = true;
        addedAt = Time.now();
      },
    ];

    for (seedMovie in seedData.values()) {
      movies.add(seedMovie.id, seedMovie);
    };
    nextMovieId := 23;
  };

  public shared ({ caller }) func initialize() : async () {
    initWithSeedData();
  };
};
