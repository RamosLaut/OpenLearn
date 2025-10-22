import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-nav',
  imports: [RouterLink],
  templateUrl: './nav.html',
  styleUrl: './nav.css'
})
export class Nav {
  constructor(public authService: Auth,
    private router: Router 
  ){}

  logout(){
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
