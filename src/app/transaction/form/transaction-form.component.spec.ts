import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionFormComponent } from './transaction-form.component';
import { RouterTestingModule } from '@angular/router/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { TransactionService } from '../../shared/transaction';
import { of } from 'rxjs';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatLuxonDateModule } from '@angular/material-luxon-adapter';
import { PageLayoutModule } from '../../shared/layouts';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ApplicationStateService } from '../../shared/application-state.service';
import { Account } from '../../shared/account';
import { ServiceWorkerModule } from '@angular/service-worker';
import { MatDialogModule } from '@angular/material/dialog';
import createSpyObj = jasmine.createSpyObj;

describe('TransactionFormComponent', () => {
  let component: TransactionFormComponent;
  let fixture: ComponentFixture<TransactionFormComponent>;
  const appStateService = createSpyObj<ApplicationStateService>('applicationStateService', [], {
    nonNullAccount$: of({} as Account),
  });
  const transactionService = createSpyObj<TransactionService>('TransactionService', ['create']);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TransactionFormComponent],
      providers: [
        { provide: ApplicationStateService, useValue: appStateService },
        { provide: TransactionService, useValue: transactionService },
      ],
      imports: [
        RouterTestingModule,
        ReactiveFormsModule,
        MatSnackBarModule,
        MatSelectModule,
        MatInputModule,
        MatFormFieldModule,
        MatDatepickerModule,
        MatLuxonDateModule,
        PageLayoutModule,
        MatIconModule,
        NoopAnimationsModule,
        MatDialogModule,
        ServiceWorkerModule.register('ngsw-worker.js', { enabled: false }),
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TransactionFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
