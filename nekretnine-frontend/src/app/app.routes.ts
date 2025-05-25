import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '/nekretnine', pathMatch: 'full' },
  {
    path: 'nekretnine',
    loadComponent: () => import('./features/nekretnine/nekretnina-list/nekretnina-list.component').then(m => m.NekretninaListComponent)
  },
  {
    path: 'nekretnine/nova',
    loadComponent: () => import('./features/nekretnine/nekretnina-form/nekretnina-form.component').then(m => m.NekretninaFormComponent)
  },
  {
    path: 'nekretnine/uredi/:id',
    loadComponent: () => import('./features/nekretnine/nekretnina-form/nekretnina-form.component').then(m => m.NekretninaFormComponent)
  },
  {
    path: 'tip-nekretnine',
    loadComponent: () => import('./features/tip-nekretnine/tip-nekretnine-list/tip-nekretnine-list.component').then(m => m.TipNekretnineListComponent)
  },
  { path: '**', redirectTo: '/nekretnine' }
];