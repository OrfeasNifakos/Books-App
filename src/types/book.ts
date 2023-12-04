export interface Author {
    name: string;
    birth_year: number;
    death_year: number;
  }
  
  export interface Book {
    id: number;
    title: string;
    authors: Author[];
    languages: string[];
    download_count: number;
    bookshelves: string[];
  subjects: string[];
  }
  
  export interface GutenbergApiResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: Book[];
  }
  