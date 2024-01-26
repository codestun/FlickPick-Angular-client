import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FetchApiDataService } from '../fetch-api-data.service';

/**
 * Component for displaying the details of a movie, director, or genre.
 */
@Component({
  selector: 'app-movie-details-dialog',
  templateUrl: './movie-details-dialog.component.html',
  styleUrls: ['./movie-details-dialog.component.scss']
})
export class MovieDetailsDialogComponent {
  /**
   * Holds the fetched movie details.
   */
  details: any;

  /**
   * Constructs a new instance of the MovieDetailsDialogComponent.
   * @param dialogRef Reference to the dialog opened.
   * @param data Data passed to the dialog, contains information about the movie and the type of details to display.
   * @param fetchApiData Service to fetch API data related to movies.
   */
  constructor(
    public dialogRef: MatDialogRef<MovieDetailsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fetchApiData: FetchApiDataService
  ) { }

  /**
   * Lifecycle hook that is called after data-bound properties are initialized.
   * Fetches the necessary details based on the dialog data.
   */
  ngOnInit(): void {
    this.fetchDetails();
  }

  /**
   * Fetches movie details based on the type specified in the data.
   * Can fetch details for 'director', 'genre', or 'synopsis'.
   */
  fetchDetails(): void {
    switch (this.data.type) {
      case 'director':
        const directorName = this.data.movie.Director.Name;
        this.fetchApiData.getDirector(directorName).subscribe(
          response => {
            this.details = response;
          },
          error => {
            console.error('Error fetching director details:', error);
          }
        );
        break;

      case 'genre':
        const genreName = this.data.movie.Genre.Name;
        this.fetchApiData.getGenre(genreName).subscribe(
          response => {
            this.details = response;
          },
          error => {
            console.error('Error fetching genre details:', error);
          }
        );
        break;

      case 'synopsis':
        this.details = this.data.movie;
        break;

      default:
        console.error('Unknown detail type:', this.data.type);
    }
  }

  /**
   * Closes the dialog when the user clicks 'No' or outside the dialog area.
   */
  onNoClick(): void {
    this.dialogRef.close();
  }
}
