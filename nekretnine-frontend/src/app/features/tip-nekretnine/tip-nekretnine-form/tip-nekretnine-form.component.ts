import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextarea } from 'primeng/inputtextarea';
import { TipNekretnine } from '../../../models/nekretnina.model';

@Component({
  selector: 'app-tip-nekretnine-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    InputTextarea
  ],
  templateUrl: './tip-nekretnine-form.component.html',
  styleUrls: ['./tip-nekretnine-form.component.scss']
})
export class TipNekretnineFormComponent implements OnChanges {
  @Input() tip: TipNekretnine | null = null;
  @Input() isEditMode: boolean = false;
  @Output() formSubmitted = new EventEmitter<TipNekretnine>();
  @Output() formCancelled = new EventEmitter<void>();

  tipForm!: FormGroup;

  constructor(private fb: FormBuilder) { 
    this.createForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['tip'] && this.tip && this.tipForm) {
      this.tipForm.patchValue({
        tip_nekretnine_id: this.tip.tip_nekretnine_id,
        naziv: this.tip.naziv,
        opis: this.tip.opis
      });
    }
  }

  createForm(): void {
    this.tipForm = this.fb.group({
      tip_nekretnine_id: [null],
      naziv: ['', Validators.required],
      opis: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.tipForm.invalid) {
      Object.keys(this.tipForm.controls).forEach(key => {
        const control = this.tipForm.get(key);
        control?.markAsTouched();
      });
      return;
    }

    const formData = this.tipForm.value;
    this.formSubmitted.emit(formData);
  }

  onCancel(): void {
    this.formCancelled.emit();
  }
}