import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms'; 
import { TipNekretnineListComponent } from './tip-nekretnine-list.component';
import { TipNekretnineService } from '../../../services/tip-nekretnine.service';
import { MessageService, ConfirmationService } from 'primeng/api';

import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { ToolbarModule } from 'primeng/toolbar';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { of } from 'rxjs';

describe('TipNekretnineListComponent', () => {
  let component: TipNekretnineListComponent;
  let fixture: ComponentFixture<TipNekretnineListComponent>;
  let mockTipNekretnineService: jasmine.SpyObj<TipNekretnineService>;
  let mockMessageService: jasmine.SpyObj<MessageService>;
  let mockConfirmationService: jasmine.SpyObj<ConfirmationService>;

  beforeEach(async () => {
    mockTipNekretnineService = jasmine.createSpyObj('TipNekretnineService', ['getAll', 'delete', 'create', 'update']);
    mockMessageService = jasmine.createSpyObj('MessageService', ['add']);
    mockConfirmationService = jasmine.createSpyObj('ConfirmationService', ['confirm']);

    mockTipNekretnineService.getAll.and.returnValue(of([])); 

    await TestBed.configureTestingModule({
      imports: [
        TipNekretnineListComponent,
        RouterTestingModule,
        NoopAnimationsModule,
        FormsModule,
        TableModule,
        ButtonModule,
        DialogModule,
        InputTextModule,
        ToolbarModule,
        ConfirmDialogModule,
      ],
      providers: [
        { provide: TipNekretnineService, useValue: mockTipNekretnineService },
        { provide: MessageService, useValue: mockMessageService },
        { provide: ConfirmationService, useValue: mockConfirmationService }
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(TipNekretnineListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
