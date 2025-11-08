import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Route, Router, RouterLink } from '@angular/router';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-home',
  imports: [RouterLink, CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {

  constructor(private router: Router, private auth: Auth){

  }

  goToCreateCourse(): void {

    if (this.auth.CurrentUserValue) {
      this.router.navigate(['/courses/new']);

    } else {
      this.router.navigate(['/login']); 
    }
  }
}

