import { Component, OnInit } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TabMenuModule } from 'primeng/tabmenu';
import { MenuItem } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, TabMenuModule, ToastModule, ConfirmDialogModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: []
})
export class AppComponent implements OnInit {
  items: MenuItem[] = [];
  activeItem: MenuItem | undefined;
  title = 'nekretnine-frontend';

  constructor(private router: Router) { }

  ngOnInit() {
    this.items = [
      { label: 'Nekretnine', icon: 'pi pi-fw pi-home', routerLink: ['/nekretnine'], command: (event) => this.handleTabClick(event) },
      { label: 'Tip nekretnine', icon: 'pi pi-fw pi-tags', routerLink: ['/tip-nekretnine'], command: (event) => this.handleTabClick(event) }
    ];
  }

  handleTabClick(event: any) {
      if (this.activeItem !== event.item) {
        this.router.navigate(event.item.routerLink);
      }
  }
}