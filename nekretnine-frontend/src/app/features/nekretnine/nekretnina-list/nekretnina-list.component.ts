import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Table, TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ToolbarModule } from 'primeng/toolbar';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MessageService, ConfirmationService } from 'primeng/api';
import { TagModule } from 'primeng/tag';

import { Nekretnina } from '../../../models/nekretnina.model';
import { NekretninaService } from '../../../services/nekretnina.service';

@Component({
  selector: 'app-nekretnine-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    ToolbarModule,
    DialogModule,
    ConfirmDialogModule,
    TagModule
  ],
  templateUrl: './nekretnina-list.component.html',
  styleUrls: ['./nekretnina-list.component.scss']
})
export class NekretninaListComponent implements OnInit {
  nekretnine: Nekretnina[] = [];
  selectedNekretnina: Nekretnina | null = null;
  globalFilterValue: string = '';

  @ViewChild('dt') table!: Table;

  constructor(
    private nekretninaService: NekretninaService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) { }

  ngOnInit(): void {
    this.loadNekretnine();
  }

  loadNekretnine(): void {
    this.nekretninaService.getAll().subscribe({
      next: (data) => {
        this.nekretnine = data;
      },
      error: (error) => {
        console.error('Greška pri dohvatu nekretnina:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Greška',
          detail: 'Došlo je do greške pri dohvatu nekretnina.'
        });
      }
    });
  }

  applyGlobalFilter(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    this.table.filterGlobal(inputElement.value, 'contains');
  }

  deleteNekretnina(nekretnina: Nekretnina): void {
    this.confirmationService.confirm({
      message: `Jeste li sigurni da želite obrisati nekretninu "${nekretnina.naslov}"?`,
      header: 'Potvrda brisanja',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        if (nekretnina.nekretnina_id) {
          this.nekretninaService.delete(nekretnina.nekretnina_id).subscribe({
            next: () => {
              this.messageService.add({
                severity: 'success',
                summary: 'Uspješno',
                detail: 'Nekretnina je uspješno obrisana'
              });
              this.loadNekretnine();
            },
            error: (error) => {
              console.error('Greška pri brisanju nekretnine:', error);
              this.messageService.add({
                severity: 'error',
                summary: 'Greška',
                detail: 'Nije moguće obrisati nekretninu. Možda postoje povezani kontakt zahtjevi.'
              });
            }
          });
        }
      }
    });
  }

  getStatusSeverity(status: string): string {
    switch (status) {
      case 'Dostupno':
        return 'success';
      case 'Prodano':
        return 'danger';
      case 'Rezervirano':
        return 'warning';
      case 'Nije dostupno':
        return 'info';
      default:
        return 'secondary';
    }
  }

  formatCijena(cijena: number): string {
    return new Intl.NumberFormat('hr-HR', { style: 'currency', currency: 'EUR' }).format(cijena);
  }
}