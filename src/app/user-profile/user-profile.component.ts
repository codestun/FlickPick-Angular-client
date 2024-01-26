import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FetchApiDataService } from '../fetch-api-data.service';
import { Router } from '@angular/router';

/**
 * Type definition for User.
 */
type User = {
  _id?: string;
  Name: string;
  Password: string;
  Email: string;
  Birthday: Date;
  FavoriteMovies?: string[];
};

/**
 * Type definition for Movie.
 */
type Movie = {
  _id: string;
  Title: string;
  Director: {
    Name: string;
  };
  Genre: {
    Name: string;
  };
  Year: number;
  ImagePath: string;
};

/**
 * Component for managing and displaying the user's profile.
 */
@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {
  /**
  * Current user's data.
  */
  user: User = { Name: '', Email: '', Password: '', Birthday: new Date(), FavoriteMovies: [] };

  /**
   * Array of favorite movies for the current user.
   */
  favoriteMovies: Movie[] = []; // Array of Movie objects

  /**
   * Constructor for UserProfileComponent.
   * @param router Router for navigation.
   * @param snackBar Service for displaying snack bars.
   * @param fetchApiData Service for fetching API data.
   */
  constructor(
    public router: Router,
    public snackBar: MatSnackBar,
    public fetchApiData: FetchApiDataService
  ) { }

  /**
   * Lifecycle hook for initialization. Loads user profile and favorite movies.
   */
  ngOnInit(): void {
    this.loadUserProfile();
    this.loadFavoriteMovies();
  }

  /**
   * Loads the user's profile data from local storage.
   */
  loadUserProfile(): void {
    const userData = JSON.parse(localStorage.getItem('user') || '{}');

    if (userData && userData.Name) {
      this.user = userData;
    } else {
      this.router.navigate(['welcome']);
    }
  }

  /**
   * Updates the user's profile information.
   */
  updateUser(): void {
    this.fetchApiData.editUser(this.user.Name, this.user).subscribe({
      next: (updatedUser) => {
        this.snackBar.open('Update successful', 'OK', { duration: 2000 });
        localStorage.setItem('user', JSON.stringify(updatedUser));
        this.loadUserProfile(); // Reload the user profile
      },
      error: (error) => {
        console.error('Error updating user:', error);
        this.snackBar.open('Update error', 'OK', { duration: 2000 });
      }
    });
  }

  /**
   * Submits the user's updated information.
   */
  handleSubmit(): void {
    this.updateUser();
  }

  /**
     * Loads the user's favorite movies.
     */
  loadFavoriteMovies(): void {
    this.fetchApiData.getAllMovies().subscribe((movies: Movie[]) => {
      this.favoriteMovies = movies.filter(movie =>
        this.user.FavoriteMovies?.includes(movie._id));
    });
  }

  /**
     * Checks if a movie is in the user's list of favorites.
     * @param movie The movie to check.
     * @returns True if the movie is a favorite, otherwise false.
     */
  isFavorite(movie: Movie): boolean {
    return this.user.FavoriteMovies?.includes(movie._id) ?? false;
  }

  /**
   * Toggles the favorite status of a movie.
   * @param movie The movie to toggle.
   */
  toggleFavorite(movie: Movie): void {
    if (this.isFavorite(movie)) {
      this.removeFavoriteMovie(movie._id);
    } else {
      this.addFavoriteMovie(movie._id);
    }
  }

  /**
   * Removes a movie from the user's list of favorites.
   * @param movieId The ID of the movie to remove.
   */
  removeFavoriteMovie(movieId: string): void {
    const username = this.user.Name;

    this.fetchApiData.deleteFavoriteMovie(username, movieId).subscribe({
      next: (response: any) => {
        this.favoriteMovies = this.favoriteMovies.filter(movie => movie._id !== movieId);
        console.log('Movie removed from favorites:', response);
      },
      error: (error: any) => {
        console.error('Error removing movie from favorites:', error);
      }
    });
  }

  /**
     * Adds a movie to the user's list of favorites.
     * @param movieId The ID of the movie to add.
     */
  addFavoriteMovie(movieId: string): void {
    const userName = this.user.Name;

    this.fetchApiData.addFavoriteMovie(userName, movieId).subscribe({
      next: (response: any) => {
        this.favoriteMovies.push(response); // Update the local favoriteMovies array to include the new favorite
        console.log('Movie added to favorites:', response);
      },
      error: (error: any) => {
        console.error('Error adding movie to favorites:', error);
      }
    });
  }
}
