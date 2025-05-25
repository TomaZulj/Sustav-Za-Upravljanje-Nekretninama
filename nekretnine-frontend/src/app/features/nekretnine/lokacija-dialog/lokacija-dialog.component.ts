import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { Lokacija } from '../../../models/nekretnina.model';

@Component({
  selector: 'app-lokacija-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DialogModule,
    ButtonModule,
    InputTextModule
  ],
  templateUrl: './lokacija-dialog.component.html',
  styleUrls: ['./lokacija-dialog.component.scss']
})
export class LokacijaDialogComponent implements OnChanges {
  @Input() display: boolean = false;
  @Input() lokacija: Lokacija | null = null;
  @Output() displayChange = new EventEmitter<boolean>();
  @Output() lokacijaSaved = new EventEmitter<Lokacija>();

  lokacijaForm: FormGroup;

  constructor(
    private fb: FormBuilder
  ) {
    this.lokacijaForm = this.fb.group({
      adresa: ['', [
        Validators.required,
        LokacijaDialogComponent.adresaValidator
      ]],
      grad: ['', [
        Validators.required,
        LokacijaDialogComponent.gradValidator
      ]],
      drzava: ['', [
        Validators.required,
        LokacijaDialogComponent.drzavaValidator
      ]]
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['lokacija'] && this.lokacija) {
      this.lokacijaForm.patchValue({
        adresa: this.lokacija.adresa,
        grad: this.lokacija.grad,
        drzava: this.lokacija.drzava
      });
    }

    if (changes['display'] && changes['display'].currentValue === true && this.lokacija) {
      this.resetForm();
    }

  }

  static adresaValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null;

    const adresa = control.value as string;

    if (!/\d/.test(adresa)) {
      return { adresaBezBroja: true };
    }

    if (/[<>{}[\]\\\/]/.test(adresa)) {
      return { adresaNedozvoljeniZnakovi: true };
    }

    return null;
  }

  static gradValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null;

    const grad = control.value as string;

    if (!/^[A-ZŠĐČĆŽ]/.test(grad)) {
      return { gradNePocinjeVelikimSlovom: true };
    }

    return null;
  }

  private resetForm(): void {
    this.lokacijaForm.patchValue({
      adresa: this.lokacija?.adresa || '',
      grad: this.lokacija?.grad || '',
      drzava: this.lokacija?.drzava || ''
    });
  }

  closeDialog(): void {
    this.display = false;
    this.displayChange.emit(false);
    this.lokacijaForm.reset();
  }

  saveLokacija(): void {
    if (this.lokacijaForm.invalid) {
      Object.keys(this.lokacijaForm.controls).forEach(key => {
        const control = this.lokacijaForm.get(key);
        control?.markAsTouched();
      });
      return;
    }

    const formValues = this.lokacijaForm.value;

    const lokacija: Lokacija = {
      ...(this.lokacija || {}),
      adresa: formValues.adresa,
      grad: formValues.grad,
      drzava: formValues.drzava
    };

    this.lokacijaSaved.emit(lokacija);
    this.closeDialog();
  }

  getAdresaErrorMessage(): string {
    const adresaControl = this.lokacijaForm.get('adresa');
    if (!adresaControl?.invalid) return '';

    if (adresaControl.hasError('required')) {
      return 'Adresa je obavezna.';
    }

    if (adresaControl.hasError('adresaBezBroja')) {
      return 'Adresa mora sadržavati kućni broj.';
    }

    if (adresaControl.hasError('adresaNedozvoljeniZnakovi')) {
      return 'Adresa sadrži nedozvoljene znakove.';
    }

    return 'Adresa nije valjana.';
  }

  static drzavaValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null;

    const drzava = control.value as string;

    if (!/^[A-ZŠĐČĆŽ]/.test(drzava)) {
      return { drzavaNePocinjeVelikimSlovom: true };
    }

    return null;
  }

  getGradErrorMessage(): string {
    const gradControl = this.lokacijaForm.get('grad');
    if (!gradControl?.invalid) return '';

    if (gradControl.hasError('required')) {
      return 'Grad je obavezan.';
    }

    if (gradControl.hasError('gradNePocinjeVelikimSlovom')) {
      return 'Grad mora početi velikim slovom.';
    }

    return 'Grad nije valjan.';
  }

  getDrzavaErrorMessage(): string {
    const drzavaControl = this.lokacijaForm.get('drzava');
    if (!drzavaControl?.invalid) return '';

    if (drzavaControl.hasError('required')) {
      return 'Država je obavezna.';
    }

    if (drzavaControl.hasError('drzavaNePocinjeVelikimSlovom')) {
      return 'Država mora početi velikim slovom.';
    }

    return 'Država nije valjana.';
  }
}