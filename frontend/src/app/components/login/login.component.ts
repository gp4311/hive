import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  email = '';
  password = '';
  error = '';
  
  constructor(private auth: AuthService, private router: Router) {}

  onSubmit() {
    // Clear any existing error
    this.error = '';

    this.auth.login(this.email, this.password).subscribe({
      next: () => this.router.navigate(['/projects']),
      error: err => this.error = err.error?.error || 'Login failed'
    })
  }

  onClick() {
    this.router.navigate(['/register']);
  }
}
