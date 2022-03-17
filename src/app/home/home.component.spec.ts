import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeComponent } from './home.component';
import { of } from 'rxjs';
import { AccountService } from '../shared/account';
import { AuthService, User } from '../shared/auth';
import createSpyObj = jasmine.createSpyObj;

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  const authService = createSpyObj<AuthService>('AuthService', ['login'], { user: of({} as User) });
  const accountService = createSpyObj<AccountService>('accountService', ['getAllChanges']);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HomeComponent],
      providers: [
        { provide: AuthService, useValue: authService },
        { provide: AccountService, useValue: accountService },
      ],
    })
      .compileComponents();
  });

  beforeEach(() => {
    accountService.getAllChanges.and.returnValue(of([]));
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
