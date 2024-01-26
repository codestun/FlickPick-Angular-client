import { Component, OnInit, Input } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MatSnackBar } from '@angular/material/snack-bar';

/**
 * Component for handling user registration.
 */
@Component({
  selector: 'app-user-registration-form',
  templateUrl: './user-registration-form.component.html',
  styleUrls: ['./user-registration-form.component.scss']
})
export class UserRegistrationFormComponent implements OnInit {

  /**
   * User data input with default empty fields for registration.
   */
  @Input() userData = { Name: '', Password: '', Email: '', Birthday: '' };

  /**
   * Constructs a new instance of UserRegistrationFormComponent.
   * @param fetchApiData Service to handle API data fetching.
   * @param dialogRef Reference to the dialog opened.
   * @param snackBar Service to display snack bar notifications.
   */
  constructor(
    public fetchApiData: FetchApiDataService,
    public dialogRef: MatDialogRef<UserRegistrationFormComponent>,
    public snackBar: MatSnackBar) { }

  /**
 * Lifecycle hook that is called after data-bound properties are initialized.
 */
  ngOnInit(): void {
  }

  /**
   * Registers a new user with the provided userData.
   */
  registerUser(): void {
    this.fetchApiData.userRegistration(this.userData).subscribe({
      next: (response) => {
        this.dialogRef.close(); // Close the modal on success
        console.log(response);
        this.snackBar.open('User registered successfully', 'OK', {
          duration: 2000
        });
      },
      error: (error) => {
        console.log(error);
        this.snackBar.open(error, 'OK', {
          duration: 2000
        });
      }
    });
  }
}
