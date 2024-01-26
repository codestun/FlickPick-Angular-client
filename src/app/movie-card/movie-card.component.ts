import { Component, OnInit } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MatDialog } from '@angular/material/dialog';
import { MovieDetailsDialogComponent } from '../movie-details-dialog/movie-details-dialog.component';

/**
 * Represents a movie with its details.
 */
type Movie = {
  _id: string;
  Title: string;
  Description: string;
  Director: {
    Name: string;
    Bio: string;
    BirthYear: number;
    DeathYear: number | null;
    Movies: string[];
  };
  Genre: {
    Name: string;
    Description: string;
  };
  Year: number;
  ImagePath: string;
  Featured: boolean;
};

/**
 * Represents a user with optional favorite movies.
 */
type User = {
  _id?: string;
  Name: string;
  FavoriteMovies?: string[];
};

/**
 * Component for displaying movie cards.
 */
@Component({
  selector: 'app-movie-card',
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.scss']
})
export class MovieCardComponent implements OnInit {
  movies: Movie[] = [];
  user?: User; // User is optional

  /**
   * Initializes a new instance of the MovieCardComponent.
   * @param fetchApiData Service to fetch API data.
   * @param dialog Service to handle dialog windows.
   */
  constructor(
    private fetchApiData: FetchApiDataService,
    public dialog: MatDialog
  ) { }

  /**
   * Lifecycle hook that is called after data-bound properties are initialized.
   */
  ngOnInit(): void {
    this.getMovies();
    this.getUser();
  }

  /**
   * Fetches all movies from the API.
   */
  getMovies(): void {
    this.fetchApiData.getAllMovies().subscribe((movies: Movie[]) => {
      this.movies = movies;
    });
  }

  /**
     * Retrieves the current user from local storage.
     */
  getUser(): void {
    this.user = JSON.parse(localStorage.getItem('user') || '{}');
  }

  /**
   * Opens a dialog to show movie details.
   * @param type The type of the dialog to open.
   * @param movie The movie for which details are to be shown.
   */
  openDetailsDialog(type: string, movie: Movie): void {
    this.dialog.open(MovieDetailsDialogComponent, {
      width: '500px',
      data: { type: type, movie: movie }
    });
  }

  /**
   * Determines if a movie is a favorite of the user.
   * @param movie The movie to check.
   * @returns True if the movie is a favorite, otherwise false.
   */
  isFavorite(movie: Movie): boolean {
    return this.user?.FavoriteMovies?.includes(movie._id) ?? false;
  }

  /**
   * Toggles a movie as a favorite.
   * @param movie The movie to toggle as a favorite.
   */
  toggleFavorite(movie: Movie): void {
    if (this.isFavorite(movie)) {
      this.removeFavoriteMovie(movie._id);
    } else {
      this.addFavoriteMovie(movie._id);
    }
  }

  /**
   * Adds a movie to the user's favorites.
   * @param movieId The ID of the movie to add.
   */
  addFavoriteMovie(movieId: string): void {
    if (this.user && this.user.Name) {
      this.fetchApiData.addFavoriteMovie(this.user.Name, movieId).subscribe({
        next: (response) => {
          if (this.user) {
            // Update the local favoriteMovies array and local storage
            this.user.FavoriteMovies = [...(this.user.FavoriteMovies ?? []), movieId];
            localStorage.setItem('user', JSON.stringify(this.user));
            console.log('Movie added to favorites:', response);
          }
        },
        error: (error) => console.error('Error adding movie to favorites:', error)
      });
    }
  }

  /**
     * Removes a movie from the user's favorites.
     * @param movieId The ID of the movie to remove.
     */
  removeFavoriteMovie(movieId: string): void {
    if (this.user && this.user.Name) {
      this.fetchApiData.deleteFavoriteMovie(this.user.Name, movieId).subscribe({
        next: (response) => {
          if (this.user) {
            // Update the local favoriteMovies array and local storage
            this.user.FavoriteMovies = this.user.FavoriteMovies?.filter(id => id !== movieId) ?? [];
            localStorage.setItem('user', JSON.stringify(this.user));
            console.log('Movie removed from favorites:', response);
          }
        },
        error: (error) => console.error('Error removing movie from favorites:', error)
      });
    }
  }
}
