import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';

import { LokacijaDialogComponent } from './lokacija-dialog.component';
import { Lokacija } from '../../../models/nekretnina.model';
import { By } from '@angular/platform-browser';

describe('LokacijaDialogComponent', () => {
  let component: LokacijaDialogComponent;
  let fixture: ComponentFixture<LokacijaDialogComponent>;
  let fb: FormBuilder;

  const mockLokacija: Lokacija = {
    lokacija_id: 1,
    adresa: 'Ilica 123',
    grad: 'Zagreb',
    drzava: 'Hrvatska'
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        LokacijaDialogComponent,
        ReactiveFormsModule,
        NoopAnimationsModule,
        DialogModule,
        ButtonModule,
        InputTextModule
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LokacijaDialogComponent);
    component = fixture.componentInstance;
    fb = TestBed.inject(FormBuilder); 
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with empty values', () => {
    expect(component.lokacijaForm).toBeDefined();
    expect(component.lokacijaForm.get('adresa')?.value).toBe('');
    expect(component.lokacijaForm.get('grad')?.value).toBe('');
    expect(component.lokacijaForm.get('drzava')?.value).toBe('');
  });

  describe('Form Validation', () => {
    it('should make form invalid if adresa is empty', () => {
      component.lokacijaForm.patchValue({ adresa: '', grad: 'Zagreb', drzava: 'Hrvatska' });
      expect(component.lokacijaForm.get('adresa')?.hasError('required')).toBeTrue();
      expect(component.lokacijaForm.invalid).toBeTrue();
    });

    it('should make form invalid if adresa does not contain a number (custom validator)', () => {
      component.lokacijaForm.patchValue({ adresa: 'Ilica Bez Broja', grad: 'Zagreb', drzava: 'Hrvatska' });
      expect(component.lokacijaForm.get('adresa')?.hasError('adresaBezBroja')).toBeTrue();
      expect(component.lokacijaForm.invalid).toBeTrue();
    });

    it('should make form valid if adresa is correct', () => {
      component.lokacijaForm.patchValue({ adresa: 'Ilica 123b', grad: 'Zagreb', drzava: 'Hrvatska' });
      expect(component.lokacijaForm.get('adresa')?.valid).toBeTrue();
    });

    it('should make form invalid if grad does not start with a capital letter (custom validator)', () => {
      component.lokacijaForm.patchValue({ adresa: 'Ilica 123', grad: 'zagreb', drzava: 'Hrvatska' });
      expect(component.lokacijaForm.get('grad')?.hasError('gradNePocinjeVelikimSlovom')).toBeTrue();
      expect(component.lokacijaForm.invalid).toBeTrue();
    });

    it('should make form valid if grad is correct', () => {
      component.lokacijaForm.patchValue({ adresa: 'Ilica 123', grad: 'Zagreb', drzava: 'Hrvatska' });
      expect(component.lokacijaForm.get('grad')?.valid).toBeTrue();
    });

    it('should make form invalid if drzava does not start with a capital letter (custom validator)', () => {
      component.lokacijaForm.patchValue({ adresa: 'Ilica 123', grad: 'Zagreb', drzava: 'hrvatska' });
      expect(component.lokacijaForm.get('drzava')?.hasError('drzavaNePocinjeVelikimSlovom')).toBeTrue();
      expect(component.lokacijaForm.invalid).toBeTrue();
    });

    it('should make form valid if drzava is correct', () => {
      component.lokacijaForm.patchValue({ adresa: 'Ilica 123', grad: 'Zagreb', drzava: 'Hrvatska' });
      expect(component.lokacijaForm.get('drzava')?.valid).toBeTrue();
    });

    it('should make form valid with all correct inputs', () => {
      component.lokacijaForm.patchValue(mockLokacija);
      expect(component.lokacijaForm.valid).toBeTrue();
    });
  });

  describe('saveLokacija', () => {
    it('should emit lokacijaSaved and call closeDialog if form is valid', () => {
      spyOn(component.lokacijaSaved, 'emit');
      spyOn(component, 'closeDialog').and.callThrough();

      component.lokacija = mockLokacija;
      component.lokacijaForm.patchValue(mockLokacija);
      fixture.detectChanges();
      component.saveLokacija();

      expect(component.lokacijaSaved.emit).toHaveBeenCalledWith(jasmine.objectContaining(mockLokacija));
      expect(component.closeDialog).toHaveBeenCalled();
    });

    it('should merge with existing lokacija_id if @Input lokacija was provided', () => {
      const existingLokacija: Lokacija = { lokacija_id: 5, adresa: 'Stara 1', grad: 'Stari', drzava: 'Stara' };
      component.lokacija = existingLokacija;
      fixture.detectChanges();

      spyOn(component.lokacijaSaved, 'emit');
      const newValues = { adresa: 'Nova Adresa 7', grad: 'Novi Grad', drzava: 'Nova Drzava' };
      component.lokacijaForm.patchValue(newValues);
      component.saveLokacija();

      const expectedEmitValue: Lokacija = {
        lokacija_id: existingLokacija.lokacija_id,
        ...newValues
      };
      expect(component.lokacijaSaved.emit).toHaveBeenCalledWith(expectedEmitValue);
    });
  });

  describe('Error Messages', () => {
    it('getAdresaErrorMessage should return correct message for required', () => {
      component.lokacijaForm.get('adresa')?.setValue('');
      component.lokacijaForm.get('adresa')?.markAsTouched();
      expect(component.getAdresaErrorMessage()).toBe('Adresa je obavezna.');
    });

    it('getAdresaErrorMessage should return correct message for adresaBezBroja', () => {
      component.lokacijaForm.get('adresa')?.setValue('Ulica bez broja');
      component.lokacijaForm.get('adresa')?.markAsTouched();
      expect(component.getAdresaErrorMessage()).toBe('Adresa mora sadržavati kućni broj.');
    });

    it('getAdresaErrorMessage should return correct message for adresaNedozvoljeniZnakovi', () => {
      component.lokacijaForm.get('adresa')?.setValue('Ulica <123>');
      component.lokacijaForm.get('adresa')?.markAsTouched();
      expect(component.getAdresaErrorMessage()).toBe('Adresa sadrži nedozvoljene znakove.');
    });

    it('getGradErrorMessage should return correct message for gradNePocinjeVelikimSlovom', () => {
      component.lokacijaForm.get('grad')?.setValue('zagreb');
      component.lokacijaForm.get('grad')?.markAsTouched();
      expect(component.getGradErrorMessage()).toBe('Grad mora početi velikim slovom.');
    });

    it('getDrzavaErrorMessage should return correct message for drzavaNePocinjeVelikimSlovom', () => {
      component.lokacijaForm.get('drzava')?.setValue('hrvatska');
      component.lokacijaForm.get('drzava')?.markAsTouched();
      expect(component.getDrzavaErrorMessage()).toBe('Država mora početi velikim slovom.');
    });
  });

  describe('DOM Interaction', () => {
    beforeEach(() => {
      component.display = true;
      fixture.detectChanges();
    });

    it('should call saveLokacija when "Spremi" button is clicked and form is valid', () => {
      spyOn(component, 'saveLokacija');
      component.lokacijaForm.patchValue(mockLokacija); 
      fixture.detectChanges();

      const spremiButton = fixture.debugElement.query(By.css('p-dialog button[type="submit"]')).nativeElement;
      spremiButton.click();

      expect(component.saveLokacija).toHaveBeenCalled();
    });

    it('"Spremi" button should be disabled if form is invalid', () => {
      component.lokacijaForm.patchValue({ adresa: '', grad: 'Test', drzava: 'Test' });
      fixture.detectChanges();
      const spremiButton = fixture.debugElement.query(By.css('p-dialog button[type="submit"]')).nativeElement;
      expect(spremiButton.disabled).toBeTrue();
    });

    it('should call closeDialog when "Odustani" button is clicked', () => {
      spyOn(component, 'closeDialog');

      const odustaniButton = fixture.debugElement.query(By.css('p-dialog button[label="Odustani"]')).nativeElement;
      odustaniButton.click();

      expect(component.closeDialog).toHaveBeenCalled();
    });
  });
});
