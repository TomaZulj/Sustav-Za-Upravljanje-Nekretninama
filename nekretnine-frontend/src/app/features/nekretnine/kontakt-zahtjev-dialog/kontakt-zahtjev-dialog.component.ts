import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextarea } from 'primeng/inputtextarea';
import { DropdownModule } from 'primeng/dropdown';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MessageService, ConfirmationService } from 'primeng/api';
import { Agent, KontaktZahtjev, Korisnik } from '../../../models/nekretnina.model';
import { KontaktZahtjevService } from '../../../services/kontakt-zahtjev.service';
import { KorisnikService } from '../../../services/korisnik.service';
import { map } from 'rxjs/operators';
import { NekretninaService } from '../../../services/nekretnina.service';

@Component({
  selector: 'app-kontakt-zahtjev-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DialogModule,
    ButtonModule,
    InputTextarea,
    DropdownModule,
    ConfirmDialogModule
  ],
  templateUrl: './kontakt-zahtjev-dialog.component.html',
  styleUrl: './kontakt-zahtjev-dialog.component.scss'
})
export class KontaktZahtjevDialogComponent implements OnInit, OnChanges {
  @Input() display: boolean = false;
  @Input() kontaktZahtjev: KontaktZahtjev | null = null;
  @Input() nekretninaId: number | undefined = undefined;
  @Output() displayChange = new EventEmitter<boolean>();
  @Output() kontaktZahtjevSaved = new EventEmitter<KontaktZahtjev>();
  @Output() kontaktZahtjevDeleted = new EventEmitter<number>();
  @Input() currentAgent?: Agent | null = null;

  kontaktZahtjevForm: FormGroup;
  korisnici: Korisnik[] = [];

  constructor(
    private fb: FormBuilder,
    private kontaktZahtjevService: KontaktZahtjevService,
    private korisnikService: KorisnikService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private nekretninaService: NekretninaService,
  ) {
    this.kontaktZahtjevForm = this.fb.group({
      poruka: ['', [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(1000)
      ]],
      korisnik_id: [null, Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadKorisnici();

    if (!this.currentAgent && this.nekretninaId) {
      this.nekretninaService.getById(this.nekretninaId).subscribe({
        next: (nekretnina) => {
          if (nekretnina.agent) {
            this.currentAgent = nekretnina.agent;
          }
        },
        error: (err) => console.error('Greška pri dohvaćanju nekretnine:', err)
      });
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['kontaktZahtjev'] || (changes['display'] && this.display)) {
      if (this.kontaktZahtjev) {
        this.kontaktZahtjevForm.patchValue({
          poruka: this.kontaktZahtjev.poruka,
          korisnik_id: this.kontaktZahtjev.korisnik?.korisnik_id || this.kontaktZahtjev.korisnik_id
        });
      } else if (this.display) {
        this.resetForm();
      }
    }
  }

  loadKorisnici(): void {
    this.korisnikService.getAll().pipe(
      map(korisnici => korisnici.map(korisnik => ({
        ...korisnik,
        imePrezime: `${korisnik.ime} ${korisnik.prezime}`
      })))
    ).subscribe({
      next: (data) => {
        this.korisnici = data;
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Greška',
          detail: 'Došlo je do greške pri dohvatu korisnika.'
        });
      }
    });
  }

  resetForm(): void {
    this.kontaktZahtjevForm.reset({
      poruka: '',
      korisnik_id: null
    });
  }

  closeDialog(): void {
    this.displayChange.emit(false);
  }

  saveKontaktZahtjev(): void {
    if (this.kontaktZahtjevForm.invalid) {
      Object.keys(this.kontaktZahtjevForm.controls).forEach(key => {
        const control = this.kontaktZahtjevForm.get(key);
        control?.markAsTouched();
      });
      return;
    }

    const formValues = this.kontaktZahtjevForm.value;

    const selectedKorisnik = this.korisnici.find(k => k.korisnik_id === formValues.korisnik_id);

    const kontaktZahtjevData: Partial<KontaktZahtjev> = {
      poruka: formValues.poruka,
      korisnik_id: formValues.korisnik_id,
      nekretnina_id: this.nekretninaId,
      korisnik: selectedKorisnik || undefined,
      agent_id: this.currentAgent?.agent_id,
      agent: this.currentAgent ?? undefined
    };

    if (this.kontaktZahtjev?.zahtjev_id) {
      this.kontaktZahtjevService.update(this.kontaktZahtjev.zahtjev_id, kontaktZahtjevData).subscribe({
        next: (updatedZahtjev) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Uspjeh',
            detail: 'Kontakt zahtjev uspješno ažuriran!'
          });
          this.kontaktZahtjevSaved.emit(updatedZahtjev);
          this.closeDialog();
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Greška',
            detail: 'Došlo je do greške prilikom ažuriranja kontakt zahtjeva.'
          });
        }
      });
    } else {
      this.kontaktZahtjevService.create(kontaktZahtjevData).subscribe({
        next: (newZahtjev) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Uspjeh',
            detail: 'Kontakt zahtjev uspješno kreiran!'
          });
          this.kontaktZahtjevSaved.emit(newZahtjev);
          this.closeDialog();
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Greška',
            detail: 'Došlo je do greške prilikom kreiranja kontakt zahtjeva.'
          });
        }
      });
    }
  }

  deleteKontaktZahtjev(): void {
    if (!this.kontaktZahtjev?.zahtjev_id) return;

    this.confirmationService.confirm({
      message: `Jeste li sigurni da želite obrisati ovaj kontakt zahtjev?`,
      header: 'Potvrda brisanja',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        const zahtjevId = this.kontaktZahtjev!.zahtjev_id!;

        this.kontaktZahtjevService.delete(zahtjevId).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Uspjeh',
              detail: 'Kontakt zahtjev je uspješno obrisan!'
            });
            this.kontaktZahtjevDeleted.emit(zahtjevId);
            this.closeDialog();
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
    });
  }

  getPorukaErrorMessage(): string {
    const porukaControl = this.kontaktZahtjevForm.get('poruka');
    if (!porukaControl?.invalid) return '';

    if (porukaControl.hasError('required')) {
      return 'Poruka je obavezna.';
    }

    if (porukaControl.hasError('minlength')) {
      return 'Poruka mora sadržavati najmanje 10 znakova.';
    }

    if (porukaControl.hasError('maxlength')) {
      return 'Poruka ne smije biti duža od 1000 znakova.';
    }

    return 'Poruka nije valjana.';
  }
}