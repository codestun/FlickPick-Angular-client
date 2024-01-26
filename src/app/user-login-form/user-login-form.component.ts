import { Component, OnInit, Input } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

/**
 * Component for the user login form.
 */
@Component({
  selector: 'app-user-login-form',
  templateUrl: './user-login-form.component.html',
  styleUrls: ['./user-login-form.component.scss']
})
export class UserLoginFormComponent implements OnInit {
  /**
  * User data input with default empty fields.
  */
  @Input() userData = { Name: '', Password: '' };

  /**
   * Constructs a new instance of the UserLoginFormComponent.
   * @param fetchApiData Service to handle API data fetching.
   * @param dialogRef Reference to the dialog opened.
   * @param snackBar Service to display snack bar notifications.
   * @param router Service to navigate among views.
   */
  constructor(
    public fetchApiData: FetchApiDataService,
    public dialogRef: MatDialogRef<UserLoginFormComponent>,
    public snackBar: MatSnackBar,
    private router: Router) { }

  /**
 * Lifecycle hook that is called after data-bound properties are initialized.
 */
  ngOnInit(): void { }

  /**
   * Logs in the user with the provided credentials.
   * Upon successful login, navigates to the 'movies' route.
   */
  loginUser(): void {
    console.log('Login');
    const credentials = {
      Name: this.userData.Name,
      Password: this.userData.Password
    };

    this.fetchApiData.userLogin(credentials).subscribe({
      next: (result) => {
        localStorage.setItem('user', JSON.stringify(result.user));
        localStorage.setItem('token', result.token);

        this.snackBar.open('Login successful', 'OK', {
          duration: 2000,
        });

        this.dialogRef.close(); // Close the modal on success
        this.router.navigate(['movies']); // Navigate to the 'movies' route
      },
      error: (error) => {
        this.snackBar.open(error, 'OK', {
          duration: 2000,
        });
      }
    });
  }
}
