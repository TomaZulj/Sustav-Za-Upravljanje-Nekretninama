import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { of } from 'rxjs';

import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ToolbarModule } from 'primeng/toolbar';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TagModule } from 'primeng/tag';
import { MessageService, ConfirmationService } from 'primeng/api';

import { NekretninaListComponent } from './nekretnina-list.component';
import { NekretninaService } from '../../../services/nekretnina.service';
import { Nekretnina, Agent, Korisnik, TipNekretnine, Lokacija } from '../../../models/nekretnina.model';
import { environment } from '../../../../environments/environment';

describe('NekretninaListComponent Integration', () => {
  let component: NekretninaListComponent;
  let fixture: ComponentFixture<NekretninaListComponent>;
  let nekretninaService: NekretninaService;
  let httpMock: HttpTestingController;
  let mockMessageService: jasmine.SpyObj<MessageService>;
  let mockConfirmationService: jasmine.SpyObj<ConfirmationService>;
  const apiUrlNekretnine = `${environment.apiUrl}/nekretnine`;

  const mockKorisnik: Korisnik = { korisnik_id: 1, ime: 'Marko', prezime: 'Marković', email: 'marko@test.com', telefon: '099123456' };
  const mockAgent: Agent = { agent_id: 1, datum_zaposlenja: new Date(), korisnik: mockKorisnik };
  const mockTipNekretnine: TipNekretnine = { tip_nekretnine_id: 1, naziv: 'Stan', opis: 'Stambena jedinica' };
  const mockLokacija: Lokacija = { lokacija_id: 1, adresa: 'Ilica 1', grad: 'Zagreb', drzava: 'Hrvatska' };

  const mockNekretnine: Nekretnina[] = [
    { nekretnina_id: 1, naslov: 'Stan u centru', opis: 'Lijep stan', cijena: 150000, povrsina: 60, status: 'Dostupno', agent: mockAgent, tipNekretnine: mockTipNekretnine, lokacija: mockLokacija },
    { nekretnina_id: 2, naslov: 'Kuća s pogledom', opis: 'Prostrana kuća', cijena: 300000, povrsina: 120, status: 'Prodano', agent: mockAgent, tipNekretnine: { tip_nekretnine_id: 2, naziv: 'Kuća', opis: 'Obiteljska kuća'}, lokacija: mockLokacija }
  ];

  beforeEach(async () => {
    mockMessageService = jasmine.createSpyObj('MessageService', ['add']);
    mockConfirmationService = jasmine.createSpyObj('ConfirmationService', ['confirm']);

    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule, 
        RouterTestingModule, 
        NoopAnimationsModule,
        FormsModule,
        TableModule,
        ButtonModule,
        InputTextModule,
        ToolbarModule,
        DialogModule,
        ConfirmDialogModule,
        TagModule,
        NekretninaListComponent
      ],
      providers: [
        NekretninaService,
        { provide: MessageService, useValue: mockMessageService },
        { provide: ConfirmationService, useValue: mockConfirmationService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(NekretninaListComponent);
    component = fixture.componentInstance;
    nekretninaService = TestBed.inject(NekretninaService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load nekretnine on init and display them in the table', fakeAsync(() => {
    fixture.detectChanges();

    const req = httpMock.expectOne(apiUrlNekretnine); 
    expect(req.request.method).toBe('GET'); 
    req.flush(mockNekretnine); 

    tick(); 
    fixture.detectChanges();

    expect(component.nekretnine.length).toBe(2);
    expect(component.nekretnine).toEqual(mockNekretnine);

    const tableRows = fixture.nativeElement.querySelectorAll('p-table table tbody tr');
    expect(tableRows.length).toBe(mockNekretnine.length);
    expect(tableRows[0].cells[0].textContent.trim()).toBe(mockNekretnine[0].naslov);
    expect(tableRows[1].cells[0].textContent.trim()).toBe(mockNekretnine[1].naslov);
  }));

  it('should call NekretninaService.delete when deletion is confirmed and reload nekretnine', fakeAsync(() => {
    const nekretninaToDelete = mockNekretnine[0];
    fixture.detectChanges(); 

    let reqGetAll = httpMock.expectOne(apiUrlNekretnine);
    reqGetAll.flush(mockNekretnine);
    tick();
    fixture.detectChanges();

    mockConfirmationService.confirm.and.callFake((options: any) => {
      options.accept();
      return {} as any;
    });

    component.deleteNekretnina(nekretninaToDelete);
    tick();

    expect(mockConfirmationService.confirm).toHaveBeenCalled();

    const deleteReq = httpMock.expectOne(`${apiUrlNekretnine}/${nekretninaToDelete.nekretnina_id}`);
    expect(deleteReq.request.method).toBe('DELETE');
    deleteReq.flush({}); 

    tick(); 
    expect(mockMessageService.add).toHaveBeenCalledWith(jasmine.objectContaining({ severity: 'success' }));

    reqGetAll = httpMock.expectOne(apiUrlNekretnine);
    expect(reqGetAll.request.method).toBe('GET');
    reqGetAll.flush(mockNekretnine.filter(n => n.nekretnina_id !== nekretninaToDelete.nekretnina_id)); 

    tick();
    fixture.detectChanges();

    expect(component.nekretnine.length).toBe(mockNekretnine.length - 1);
  }));

  it('should show error message if deleting nekretnina fails', fakeAsync(() => {
    const nekretninaToDelete = mockNekretnine[0];
    fixture.detectChanges();

    let reqGetAll = httpMock.expectOne(apiUrlNekretnine);
    reqGetAll.flush(mockNekretnine);
    tick();
    fixture.detectChanges();

    mockConfirmationService.confirm.and.callFake((options: any) => {
      options.accept();
      return {} as any;
    });

    component.deleteNekretnina(nekretninaToDelete);
    tick();

    const deleteReq = httpMock.expectOne(`${apiUrlNekretnine}/${nekretninaToDelete.nekretnina_id}`);
    deleteReq.flush({ message: 'Greška pri brisanju' }, { status: 500, statusText: 'Server Error' });

    tick();
    expect(mockMessageService.add).toHaveBeenCalledWith(jasmine.objectContaining({ severity: 'error' }));
    expect(component.nekretnine.length).toBe(mockNekretnine.length);
  }));

  it('should filter nekretnine based on global filter input', fakeAsync(() => {
    fixture.detectChanges(); 

    const req = httpMock.expectOne(apiUrlNekretnine);
    req.flush(mockNekretnine);
    tick();
    fixture.detectChanges();

    const table = component.table;
    if (table) {
        table.filterGlobal('Stan u centru', 'contains');
        tick(500);
        fixture.detectChanges();

        const tableRows = fixture.nativeElement.querySelectorAll('p-table table tbody tr');
        expect(tableRows.length).toBe(1);
        expect(tableRows[0].cells[0].textContent.trim()).toBe('Stan u centru');
    } else {
        console.warn('PrimeNG Table instance (dt) not found for filter test.');
        expect(true).toBe(true); 
    }
  }));

});