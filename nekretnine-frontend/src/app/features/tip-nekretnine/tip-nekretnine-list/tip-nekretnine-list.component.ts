import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Table, TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { ToolbarModule } from 'primeng/toolbar';
import { MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';

import { TipNekretnine } from '../../../models/nekretnina.model';
import { TipNekretnineService } from '../../../services/tip-nekretnine.service';
import { TipNekretnineFormComponent } from '../tip-nekretnine-form/tip-nekretnine-form.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-tip-nekretnine-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    ToolbarModule,
    ConfirmDialogModule,
    RouterModule,
    TipNekretnineFormComponent
  ],
  templateUrl: './tip-nekretnine-list.component.html',
  styleUrls: ['./tip-nekretnine-list.component.scss']
})
export class TipNekretnineListComponent implements OnInit {
  tipoviNekretnine: TipNekretnine[] = [];
  selectedTip: TipNekretnine | null = null;
  displayDialog: boolean = false;
  isEditMode: boolean = false;
  globalFilterValue: string = '';

  @ViewChild('dt') table!: Table;

  constructor(
    private tipNekretnineService: TipNekretnineService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) { }

  ngOnInit(): void {
    this.loadTipovi();
  }

  loadTipovi(): void {
    this.tipNekretnineService.getAll().subscribe({
      next: (data) => {
        this.tipoviNekretnine = data;
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Greška',
          detail: 'Došlo je do greške pri dohvatu tipova nekretnina.'
        });
      }
    });
  }

  applyGlobalFilter(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    this.table.filterGlobal(inputElement.value, 'contains');
  }

  openNewDialog(): void {
    this.selectedTip = {} as TipNekretnine;
    this.isEditMode = false;
    this.displayDialog = true;
  }

  editTip(tip: TipNekretnine): void {
    this.selectedTip = { ...tip };
    this.isEditMode = true;
    this.displayDialog = true;
  }

  deleteTip(tip: TipNekretnine): void {
    this.confirmationService.confirm({
      message: `Jeste li sigurni da želite obrisati tip "${tip.naziv}"?`,
      header: 'Potvrda brisanja',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        if (tip.tip_nekretnine_id) {
          this.tipNekretnineService.delete(tip.tip_nekretnine_id).subscribe({
            next: () => {
              this.messageService.add({
                severity: 'success',
                summary: 'Uspješno',
                detail: 'Tip nekretnine je uspješno obrisan'
              });
              this.loadTipovi();
            },
            error: (error) => {
              this.messageService.add({
                severity: 'error',
                summary: 'Greška',
                detail: 'Nije moguće obrisati tip nekretnine. Možda se koristi u nekretninama.'
              });
            }
          });
        }
      }
    });
  }

  onDialogHide(): void {
    this.selectedTip = null;
  }

  closeDialog(): void {
    this.displayDialog = false;
  }

  onFormSubmit(tip: TipNekretnine): void {
    if (this.isEditMode && tip.tip_nekretnine_id) {
      this.tipNekretnineService.update(tip.tip_nekretnine_id, tip).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Uspješno',
            detail: 'Tip nekretnine je uspješno ažuriran'
          });
          this.loadTipovi();
          this.displayDialog = false;
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Greška',
            detail: 'Došlo je do greške prilikom ažuriranja tipa nekretnine.'
          });
        }
      });
    } else {
      this.tipNekretnineService.create(tip).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Uspješno',
            detail: 'Tip nekretnine je uspješno kreiran'
          });
          this.loadTipovi();
          this.displayDialog = false;
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Greška',
            detail: 'Došlo je do greške prilikom kreiranja tipa nekretnine.'
          });
        }
      });
    }
  }
}