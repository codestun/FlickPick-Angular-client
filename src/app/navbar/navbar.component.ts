import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { UserLoginFormComponent } from '../user-login-form/user-login-form.component';
import { UserRegistrationFormComponent } from '../user-registration-form/user-registration-form.component';

/**
 * Component for the navigation bar of the application.
 */
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})

/**
   * Constructs a new instance of NavbarComponent.
   * @param fetchApiDataService Service to fetch API data.
   * @param router Service to navigate among views.
   * @param snackBar Service to display snack bar notifications.
   * @param dialog Service to manage modal dialogs.
   */
export class NavbarComponent {
  constructor(
    private fetchApiDataService: FetchApiDataService,
    private router: Router,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
  ) { }

  /**
   * Opens the user registration dialog.
   */
  openUserRegistrationDialog(): void {
    this.dialog.open(UserRegistrationFormComponent, {
      width: '280px'
    });
  }

  /**
   * Opens the user login dialog.
   */
  openUserLoginDialog(): void {
    this.dialog.open(UserLoginFormComponent, {
      width: '280px'
    });
  }

  /**
   * Logs out the current user and navigates to the welcome page.
   */
  logout(): void {
    try {
      this.fetchApiDataService.logout();
      localStorage.clear();
      this.router.navigate(['/welcome']);
      this.snackBar.open('Logout successful', 'OK', { duration: 2000 });
    } catch (error) {
      this.snackBar.open('Error during logout', 'OK', { duration: 2000 });
      console.error('Logout error:', error);
    }
  }

  /**
   * Determines if the current page is the welcome page.
   * @returns True if the current page is the welcome page, otherwise false.
   */
  get isWelcomePage(): boolean {
    return this.router.url === '/welcome';
  }
}
