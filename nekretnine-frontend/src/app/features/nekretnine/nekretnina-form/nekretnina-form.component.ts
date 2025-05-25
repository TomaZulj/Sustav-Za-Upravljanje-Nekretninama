import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule, Location as AngularLocation } from '@angular/common';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextarea } from 'primeng/inputtextarea';
import { InputNumberModule } from 'primeng/inputnumber';
import { DropdownModule } from 'primeng/dropdown';
import { PanelModule } from 'primeng/panel';
import { DividerModule } from 'primeng/divider';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { ToolbarModule } from 'primeng/toolbar';
import { TooltipModule } from 'primeng/tooltip';
import { AbstractControl, ValidationErrors } from '@angular/forms';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

import { NekretninaService } from '../../../services/nekretnina.service';
import { TipNekretnineService } from '../../../services/tip-nekretnine.service';
import { AgentService } from '../../../services/agent.service';
import { KontaktZahtjevService } from '../../../services/kontakt-zahtjev.service';
import { Nekretnina, TipNekretnine, Agent, Lokacija, KontaktZahtjev } from '../../../models/nekretnina.model';
import { LokacijaDialogComponent } from '../lokacija-dialog/lokacija-dialog.component';
import { KontaktZahtjevDialogComponent } from '../kontakt-zahtjev-dialog/kontakt-zahtjev-dialog.component';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-nekretnina-form',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, RouterModule,
    ButtonModule, InputTextModule, InputTextarea, InputNumberModule,
    DropdownModule, PanelModule, DividerModule, TableModule, DialogModule,
    ToolbarModule, TooltipModule,
    LokacijaDialogComponent,
    KontaktZahtjevDialogComponent,
    ConfirmDialogModule
  ],
  templateUrl: './nekretnina-form.component.html',
  styleUrls: ['./nekretnina-form.component.scss']
})
export class NekretninaFormComponent implements OnInit {
  nekretninaForm: FormGroup;
  isEditMode = false;
  nekretninaId: number | null = null;
  currentNekretnina: Nekretnina | null = null;

  tipoviNekretnine: TipNekretnine[] = [];
  agenti: Agent[] = [];
  statusOptions: any[] = [
    { label: 'Dostupno', value: 'Dostupno' },
    { label: 'Prodano', value: 'Prodano' },
    { label: 'Rezervirano', value: 'Rezervirano' },
    { label: 'Nije dostupno', value: 'Nije dostupno' }
  ];

  trenutnaLokacijaPrikaz: string = 'Nije odabrana';
  selectedLokacijaForDialog: Lokacija | null = null;
  displayLokacijaDialog: boolean = false;

  kontaktZahtjevi: KontaktZahtjev[] = [];

  selectedKontaktZahtjev: KontaktZahtjev | null = null;
  displayKontaktZahtjevDialog: boolean = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private angularLocation: AngularLocation,
    private nekretninaService: NekretninaService,
    private tipNekretnineService: TipNekretnineService,
    private agentService: AgentService,
    private kontaktZahtjevService: KontaktZahtjevService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {
    this.nekretninaForm = this.fb.group({
      naslov: ['', [
        Validators.required,
        NekretninaFormComponent.naslovValidator
      ]],
      opis: [''],
      cijena: [null, [
        Validators.required,
        Validators.min(1)
      ]],
      povrsina: [null, [
        Validators.required,
        Validators.min(1)
      ]],
      status: ['Dostupno', Validators.required],
      tip_nekretnine_id: [null, Validators.required],
      agent_id: [null, Validators.required],
      lokacija_id: [null]
    });
  }

  ngOnInit(): void {
    this.loadDropdownData();

    this.route.params.subscribe(params => {
      const id = params['id'];
      if (id) {
        this.isEditMode = true;
        this.nekretninaId = +id;
        this.loadNekretninaData(+id);
      }
    });
  }

  getNaslovErrorMessage(): string {
    const naslovControl = this.nekretninaForm.get('naslov');
    if (!naslovControl?.invalid) return '';

    if (naslovControl.hasError('required')) {
      return 'Naslov je obavezan.';
    }

    if (naslovControl.hasError('naslovSamoBrojevi')) {
      return 'Naslov ne može sadržavati samo brojeve.';
    }

    if (naslovControl.hasError('naslovNedozvoljeniZnakovi')) {
      return 'Naslov sadrži nedozvoljene znakove.';
    }

    return 'Naslov nije valjan.';
  }

  openNewKontaktZahtjevDialog(): void {
    this.selectedKontaktZahtjev = null;
    this.displayKontaktZahtjevDialog = true;
  }

  openEditKontaktZahtjevDialog(kontaktZahtjev: KontaktZahtjev): void {
    this.selectedKontaktZahtjev = { ...kontaktZahtjev };
    this.displayKontaktZahtjevDialog = true;
  }

  handleKontaktZahtjevSaved(zahtjev: KontaktZahtjev): void {
    if (this.nekretninaId) {
      this.loadKontaktZahtjevi(this.nekretninaId);
    }

    this.displayKontaktZahtjevDialog = false;
    this.selectedKontaktZahtjev = null;
  }

  deleteKontaktZahtjev(kz: KontaktZahtjev): void {
    this.confirmationService.confirm({
      message: 'Jeste li sigurni da želite obrisati ovaj kontakt zahtjev?',
      header: 'Potvrda brisanja',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        if (kz.zahtjev_id) {
          this.kontaktZahtjevService.delete(kz.zahtjev_id).subscribe({
            next: () => {
              this.messageService.add({
                severity: 'success',
                summary: 'Uspjeh',
                detail: 'Kontakt zahtjev je uspješno obrisan!'
              });
              this.loadKontaktZahtjevi(this.nekretninaId!);
            },
            error: (error) => {
              this.messageService.add({
                severity: 'error',
                summary: 'Greška',
                detail: 'Došlo je do greške prilikom brisanja kontakt zahtjeva.'
              });
            }
          });
        }
      }
    });
  }

  handleKontaktZahtjevDeleted(zahtjevId: number): void {
    this.kontaktZahtjevi = this.kontaktZahtjevi.filter(k => k.zahtjev_id !== zahtjevId);

    this.displayKontaktZahtjevDialog = false;
    this.selectedKontaktZahtjev = null;
  }

  getCijenaErrorMessage(): string {
    const cijenaControl = this.nekretninaForm.get('cijena');
    if (!cijenaControl?.invalid) return '';

    if (cijenaControl.hasError('required')) {
      return 'Cijena je obavezna.';
    }

    if (cijenaControl.hasError('min')) {
      return 'Cijena mora biti veća od 0.';
    }

    return 'Cijena nije valjana.';
  }

  getPovrsinaErrorMessage(): string {
    const povrsinaControl = this.nekretninaForm.get('povrsina');
    if (!povrsinaControl?.invalid) return '';

    if (povrsinaControl.hasError('required')) {
      return 'Površina je obavezna.';
    }

    if (povrsinaControl.hasError('min')) {
      return 'Površina mora biti veća od 0.';
    }

    return 'Površina nije valjana.';
  }

  loadDropdownData(): void {
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

    this.agentService.getAll().subscribe({
      next: (data) => {
        this.agenti = data;
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Greška',
          detail: 'Došlo je do greške pri dohvatu agenata.'
        });
      }
    });
  }

  loadNekretninaData(id: number): void {
    this.nekretninaService.getById(id).subscribe({
      next: (data) => {
        this.currentNekretnina = data;

        this.nekretninaForm.patchValue({
          naslov: data.naslov,
          opis: data.opis,
          cijena: data.cijena,
          povrsina: data.povrsina,
          status: data.status,
          tip_nekretnine_id: data.tipNekretnine?.tip_nekretnine_id,
          agent_id: data.agent?.agent_id,
          lokacija_id: data.lokacija?.lokacija_id
        });

        if (data.lokacija) {
          this.selectedLokacijaForDialog = data.lokacija;
          this.updateLokacijaPrikaz(data.lokacija);
        }

        this.loadKontaktZahtjevi(id);
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Greška',
          detail: 'Nekretnina nije pronađena ili je došlo do greške prilikom dohvata.'
        });
      }
    });
  }

  static naslovValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null;

    const naslov = control.value as string;

    if (/^\d+$/.test(naslov)) {
      return { naslovSamoBrojevi: true };
    }

    if (/[<>{}[\]\\\/]/.test(naslov)) {
      return { naslovNedozvoljeniZnakovi: true };
    }

    return null;
  }

  loadKontaktZahtjevi(nekretninaId: number): void {
    this.kontaktZahtjevService.getByNekretninaId(nekretninaId).subscribe({
      next: (data) => {
        this.kontaktZahtjevi = data;
      },
      error: (error) => {
        console.error('Greška pri dohvatu kontakt zahtjeva:', error);
      }
    });
  }

  openLokacijaDialog(): void {
    this.displayLokacijaDialog = true;
  }

  handleLokacijaSaved(spremljenaLokacija: Lokacija): void {
    this.selectedLokacijaForDialog = spremljenaLokacija;

    if (spremljenaLokacija.lokacija_id) {
      this.nekretninaForm.patchValue({
        lokacija_id: spremljenaLokacija.lokacija_id
      });
    } else {
      this.nekretninaForm.patchValue({
        lokacija_id: null
      });
    }

    this.updateLokacijaPrikaz(spremljenaLokacija);
    this.displayLokacijaDialog = false;
  }

  isLokacijaValid(): boolean {
    return this.selectedLokacijaForDialog !== null &&
      !!this.selectedLokacijaForDialog.adresa &&
      !!this.selectedLokacijaForDialog.grad &&
      !!this.selectedLokacijaForDialog.drzava;
  }

  updateLokacijaPrikaz(lokacija: Lokacija): void {
    this.trenutnaLokacijaPrikaz = `${lokacija.adresa}, ${lokacija.grad}, ${lokacija.drzava}`;
  }

  onSubmit(): void {
    if (!this.isLokacijaValid()) {
      this.messageService.add({
        severity: 'error',
        summary: 'Greška',
        detail: 'Lokacija mora biti popunjena. Kliknite na gumb olovke za unos adrese, grada i države.'
      });
      return;
    }

    if (this.nekretninaForm.invalid) {
      Object.keys(this.nekretninaForm.controls).forEach(key => {
        const control = this.nekretninaForm.get(key);
        control?.markAsTouched();
      });
      return;
    }

    const formValues = this.nekretninaForm.value;

    const nekretninaData = {
      naslov: formValues.naslov,
      opis: formValues.opis || '',
      cijena: formValues.cijena,
      povrsina: formValues.povrsina,
      status: formValues.status,
      tip_nekretnine_id: formValues.tip_nekretnine_id,
      agent_id: formValues.agent_id,
      lokacija_id: formValues.lokacija_id,
      kompletnaLokacija: this.selectedLokacijaForDialog
    };

    if (this.isEditMode && this.nekretninaId) {
      this.nekretninaService.update(this.nekretninaId, nekretninaData).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Uspjeh',
            detail: 'Nekretnina je uspješno ažurirana!'
          });
          this.router.navigate(['/nekretnine']);
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Greška',
            detail: 'Došlo je do greške prilikom ažuriranja nekretnine.'
          });
        }
      });
    } else {
      this.nekretninaService.create(nekretninaData).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Uspjeh',
            detail: 'Nekretnina je uspješno kreirana!'
          });
          this.router.navigate(['/nekretnine']);
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Greška',
            detail: 'Došlo je do greške prilikom kreiranja nekretnine.'
          });
        }
      });
    }
  }

  goBack(): void {
    this.angularLocation.back();
  }
}