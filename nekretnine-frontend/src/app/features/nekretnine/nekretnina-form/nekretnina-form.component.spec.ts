import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';

import { NekretninaFormComponent } from './nekretnina-form.component';
import { MessageService, ConfirmationService } from 'primeng/api';
import { NekretninaService } from '../../../services/nekretnina.service';
import { TipNekretnineService } from '../../../services/tip-nekretnine.service';
import { AgentService } from '../../../services/agent.service';
import { KontaktZahtjevService } from '../../../services/kontakt-zahtjev.service';

import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TableModule } from 'primeng/table';
import { CalendarModule } from 'primeng/calendar'; 
import { InputTextarea } from 'primeng/inputtextarea'; 

describe('NekretninaFormComponent', () => {
  let component: NekretninaFormComponent;
  let fixture: ComponentFixture<NekretninaFormComponent>;
  let mockNekretninaService: jasmine.SpyObj<NekretninaService>;
  let mockTipNekretnineService: jasmine.SpyObj<TipNekretnineService>;
  let mockAgentService: jasmine.SpyObj<AgentService>;
  let mockKontaktZahtjevService: jasmine.SpyObj<KontaktZahtjevService>;
  let mockMessageService: jasmine.SpyObj<MessageService>;
  let mockConfirmationService: jasmine.SpyObj<ConfirmationService>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    mockNekretninaService = jasmine.createSpyObj('NekretninaService', ['getById', 'create', 'update']);
    mockTipNekretnineService = jasmine.createSpyObj('TipNekretnineService', ['getAll']);
    mockAgentService = jasmine.createSpyObj('AgentService', ['getAll']);
    mockKontaktZahtjevService = jasmine.createSpyObj('KontaktZahtjevService', ['getByNekretninaId', 'delete']);
    mockMessageService = jasmine.createSpyObj('MessageService', ['add']);
    mockConfirmationService = jasmine.createSpyObj('ConfirmationService', ['confirm']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [
        NekretninaFormComponent,
        ReactiveFormsModule,
        HttpClientTestingModule, 
        RouterTestingModule,
        NoopAnimationsModule,
        DropdownModule,
        InputNumberModule,
        InputTextModule,
        ButtonModule,
        ToastModule,
        ConfirmDialogModule,
        TableModule,
        CalendarModule,
        InputTextarea,
      ],
      providers: [
        { provide: ActivatedRoute, useValue: { params: of({ id: null }), snapshot: { paramMap: { get: (key: string) => null } } } },
        { provide: NekretninaService, useValue: mockNekretninaService },
        { provide: TipNekretnineService, useValue: mockTipNekretnineService },
        { provide: AgentService, useValue: mockAgentService },
        { provide: KontaktZahtjevService, useValue: mockKontaktZahtjevService },
        { provide: MessageService, useValue: mockMessageService },
        { provide: ConfirmationService, useValue: mockConfirmationService }
      ]
    }).compileComponents();

    mockNekretninaService.getById.and.returnValue(of({ nekretnina_id: 1, naslov: 'Test', cijena: 100, povrsina: 50, status: 'Dostupno' } as any));
    mockTipNekretnineService.getAll.and.returnValue(of([]));
    mockAgentService.getAll.and.returnValue(of([]));
    mockKontaktZahtjevService.getByNekretninaId.and.returnValue(of([]));

    fixture = TestBed.createComponent(NekretninaFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});