import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-member-header',
  imports: [RouterLink, CommonModule],
  templateUrl: './member-header.html',
  styleUrl: './member-header.css'
})
export class MemberHeader {
  isMenuOpen: boolean = false; 

  constructor(
    private auth: Auth,
    private router: Router
  ){}
  
  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  @HostListener('document:click', ['$event'])
  clickout(event: any) {
    if(!event.target.closest('.user-menu-wrapper')) {
      this.isMenuOpen = false;
    }
  }

  logout() {
    this.auth.logout()
    this.isMenuOpen = false;
    this.router.navigate([''])
  }
}
