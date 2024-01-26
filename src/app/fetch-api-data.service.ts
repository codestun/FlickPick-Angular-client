import { Injectable } from '@angular/core';
import { catchError, map } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';

const apiUrl = 'https://flickpick-1911bf3985c5.herokuapp.com/';

/**
 * Service for handling API data fetching.
 */
@Injectable({
  providedIn: 'root'
})
export class FetchApiDataService {
  /**
     * Constructs the FetchApiDataService.
     * @param http The HttpClient used for making API requests.
     */
  constructor(private http: HttpClient) { }

  /**
    * Registers a new user.
    * @param userDetails The details of the user to register.
    * @returns An Observable from the HTTP request.
    */
  public userRegistration(userDetails: any): Observable<any> {
    return this.http.post(apiUrl + 'users', userDetails).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Logs in a user.
   * @param credentials The login credentials.
   * @returns An Observable from the HTTP request.
   */
  public userLogin(credentials: any): Observable<any> {
    return this.http.post(apiUrl + 'login', credentials).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Logs out the current user.
   * @returns An Observable from the HTTP request.
   */
  public logout(): Observable<any> {
    return this.http.post(apiUrl + 'logout', {}).pipe(
      catchError(this.handleError)
    );
  }

  /**
 * Retrieves all movies from the API.
 * @returns An Observable containing an array of movies.
 */
  getAllMovies(): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get(apiUrl + 'movies', {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + token,
      })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  /**
  * Retrieves a specific movie by its title.
  * @param Title The title of the movie to retrieve.
  * @returns An Observable containing the movie data.
  */
  public getOneMovie(Title: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get(apiUrl + 'movies/' + Title, {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + token,
      })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  /**
 * Retrieves details of a specific director by name.
 * @param Name The name of the director.
 * @returns An Observable containing director details.
 */
  public getDirector(Name: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get(apiUrl + 'directors/' + Name, {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + token,
      })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  /**
 * Retrieves movies of a specific genre by its name.
 * @param Name The name of the genre.
 * @returns An Observable containing movies of the specified genre.
 */
  public getGenre(Name: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get(apiUrl + 'genres/' + Name, {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + token,
      })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  /**
 * Retrieves the details of a specific user by name.
 * @param Name The name of the user.
 * @returns An Observable containing user details.
 */
  public getUser(Name: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get(apiUrl + 'users/' + Name, {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + token,
      })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  /**
 * Retrieves the favorite movies of a user.
 * @param Name The name of the user.
 * @returns An Observable containing an array of the user's favorite movies.
 */
  public getFavoriteMovies(Name: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get(apiUrl + 'users/' + Name + '/movies', {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + token,
      })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  /**
 * Adds a movie to a user's list of favorites.
 * @param Name The name of the user.
 * @param MovieID The ID of the movie to add.
 * @returns An Observable from the HTTP request.
 */
  public addFavoriteMovie(Name: string, MovieID: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.post(apiUrl + 'users/' + Name + '/movies/' + MovieID, null, {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + token,
      })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  /**
 * Edits the details of a user.
 * @param Name The name of the user.
 * @param userDetails The updated details of the user.
 * @returns An Observable containing the updated user details.
 */
  public editUser(Name: string, userDetails: any): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.put(apiUrl + 'users/' + Name, userDetails, {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + token,
      })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  /**
 * Deletes a user by name.
 * @param Name The name of the user to delete.
 * @returns An Observable from the HTTP request.
 */
  public deleteUser(Name: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.delete(apiUrl + 'users/' + Name, {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + token,
      })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  /**
 * Removes a movie from a user's list of favorites.
 * @param Name The name of the user.
 * @param MovieID The ID of the movie to remove.
 * @returns An Observable from the HTTP request.
 */
  public deleteFavoriteMovie(Name: string, MovieID: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.delete(apiUrl + 'users/' + Name + '/movies/' + MovieID, {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + token,
      })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  // Non-typed response extraction
  private extractResponseData(res: Object): any {
    return res || {};
  }

  /**
   * Handles errors from HTTP requests.
   * @param error The HttpErrorResponse received.
   * @returns An Observable that throws an error.
   */
  private handleError(error: HttpErrorResponse): any {
    if (error.error instanceof ErrorEvent) {
      console.error('Some error occurred:', error.error.message);
    } else {
      console.error(
        `Error Status code ${error.status}, ` +
        `Error body is: ${error.error}`);
    }
    return throwError(() => new Error('Something bad happened; please try again later.'));
  }
}
