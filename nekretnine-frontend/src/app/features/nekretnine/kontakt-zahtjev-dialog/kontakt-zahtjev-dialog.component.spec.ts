import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing'; 
import { ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextarea } from 'primeng/inputtextarea';
import { DropdownModule } from 'primeng/dropdown';
import { MessageService, ConfirmationService } from 'primeng/api'; 

import { KontaktZahtjevDialogComponent } from './kontakt-zahtjev-dialog.component';
import { KontaktZahtjevService } from '../../../services/kontakt-zahtjev.service';
import { KorisnikService } from '../../../services/korisnik.service';
import { NekretninaService } from '../../../services/nekretnina.service';
import { of } from 'rxjs';

describe('KontaktZahtjevDialogComponent', () => {
  let component: KontaktZahtjevDialogComponent;
  let fixture: ComponentFixture<KontaktZahtjevDialogComponent>;

  let mockKontaktZahtjevService: jasmine.SpyObj<KontaktZahtjevService>;
  let mockKorisnikService: jasmine.SpyObj<KorisnikService>;
  let mockNekretninaService: jasmine.SpyObj<NekretninaService>;
  let mockMessageService: jasmine.SpyObj<MessageService>;
  let mockConfirmationService: jasmine.SpyObj<ConfirmationService>;


  beforeEach(async () => {
    mockKontaktZahtjevService = jasmine.createSpyObj('KontaktZahtjevService', ['create', 'update', 'delete', 'getByNekretninaId']);
    mockKorisnikService = jasmine.createSpyObj('KorisnikService', ['getAll']);
    mockNekretninaService = jasmine.createSpyObj('NekretninaService', ['getById']);
    mockMessageService = jasmine.createSpyObj('MessageService', ['add']);
    mockConfirmationService = jasmine.createSpyObj('ConfirmationService', ['confirm']);

    mockKorisnikService.getAll.and.returnValue(of([])); 
    mockNekretninaService.getById.and.returnValue(of({ agent: { agent_id: 1 } } as any));

    await TestBed.configureTestingModule({
      imports: [
        KontaktZahtjevDialogComponent,
        ReactiveFormsModule,
        NoopAnimationsModule,
        DialogModule,
        ButtonModule,
        InputTextarea,
        DropdownModule,
      ],
      providers: [
        { provide: KontaktZahtjevService, useValue: mockKontaktZahtjevService },
        { provide: KorisnikService, useValue: mockKorisnikService },
        { provide: NekretninaService, useValue: mockNekretninaService },
        { provide: MessageService, useValue: mockMessageService },
        { provide: ConfirmationService, useValue: mockConfirmationService }
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(KontaktZahtjevDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); 
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});