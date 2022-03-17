import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountHomeComponent } from './account-home.component';
import { RouterTestingModule } from '@angular/router/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { PageLayoutModule } from '../../shared/layouts';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { ApplicationStateService } from '../../shared/application-state.service';
import { of } from 'rxjs';
import { Account } from '../../shared/account';
import createSpyObj = jasmine.createSpyObj;

describe('AccountHomeComponent', () => {
  let component: AccountHomeComponent;
  let fixture: ComponentFixture<AccountHomeComponent>;
  const appStateService = createSpyObj<ApplicationStateService>('applicationStateService', [], {
    nonNullAccount$: of({} as Account),
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AccountHomeComponent],
      providers: [
        { provide: ApplicationStateService, useValue: appStateService },
      ],
      imports: [
        RouterTestingModule,
        PageLayoutModule,
        MatSnackBarModule,
        MatIconModule,
        MatMenuModule,
        MatBottomSheetModule,
      ],
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
