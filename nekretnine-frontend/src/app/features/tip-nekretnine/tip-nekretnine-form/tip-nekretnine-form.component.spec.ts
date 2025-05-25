import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TipNekretnineFormComponent } from './tip-nekretnine-form.component';

describe('TipNekretnineFormComponent', () => {
  let component: TipNekretnineFormComponent;
  let fixture: ComponentFixture<TipNekretnineFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TipNekretnineFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TipNekretnineFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
