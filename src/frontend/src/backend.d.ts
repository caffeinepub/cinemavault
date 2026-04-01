import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Movie {
    id: bigint;
    title: string;
    featured: boolean;
    thumbnailUrl: string;
    year: bigint;
    downloadUrls: Array<DownloadUrl>;
    language: string;
    synopsis: string;
    genre: string;
    addedAt: bigint;
    videoUrl: string;
}
export interface DownloadUrl {
    url: string;
    quality: string;
}
export interface backendInterface {
    addOrUpdateMovie(id: bigint, title: string, year: bigint, genre: string, language: string, synopsis: string, thumbnailUrl: string, videoUrl: string, downloadUrls: Array<DownloadUrl>, featured: boolean): Promise<bigint>;
    filterMovies(genre: string | null, year: bigint | null, language: string | null): Promise<Array<Movie>>;
    getAllMovies(): Promise<Array<Movie>>;
    getFeaturedMovies(): Promise<Array<Movie>>;
    getMovieById(id: bigint): Promise<Movie>;
    getMoviesByYear(year: bigint): Promise<Array<Movie>>;
    getRecentMovies(limit: bigint): Promise<Array<Movie>>;
    initialize(): Promise<void>;
    removeMovie(id: bigint): Promise<void>;
    searchMovies(keyword: string): Promise<Array<Movie>>;
}
