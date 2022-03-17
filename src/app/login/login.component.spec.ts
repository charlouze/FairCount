import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginComponent } from './login.component';
import { CommonModule } from '@angular/common';
import { PageLayoutModule } from '../shared/layouts';
import { MatListModule } from '@angular/material/list';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthService, User } from '../shared/auth';
import { ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import createSpyObj = jasmine.createSpyObj;

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  const authService = createSpyObj<AuthService>('AuthService', ['login']);
  const router = createSpyObj<Router>('Router', ['navigate']);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      providers: [
        { provide: AuthService, useValue: authService },
        { provide: Router, useValue: router },
      ],
      imports: [
        CommonModule,
        PageLayoutModule,
        NoopAnimationsModule,
        MatListModule,
        MatFormFieldModule,
        ReactiveFormsModule,
        MatInputModule,
        MatButtonModule,
        MatSnackBarModule,
        RouterTestingModule,
      ],
    }).overrideComponent(LoginComponent, {
      set: { changeDetection: ChangeDetectionStrategy.Default },
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    authService.login.calls.reset();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('submit', () => {
    it('should not do anything when form is not valid', () => {
      component.form.setValue({ email: '', password: '' }, { emitEvent: false });
      component.submitted = false;
      component.submit();
      expect(authService.login).not.toHaveBeenCalled();
    });
    it('should not do anything when already submitted', () => {
      component.form.setValue({ email: 'test@test', password: '123456' }, { emitEvent: false });
      component.submitted = true;
      component.submit();
      expect(authService.login).not.toHaveBeenCalled();
    });
    it('should try to login with email and password', () => {
      const email = 'test@test';
      const password = '123456';
      component.form.setValue({ email, password }, { emitEvent: false });
      component.submitted = false;
      authService.login.and.returnValue(of({} as User));
      component.submit();
      expect(authService.login).toHaveBeenCalledOnceWith(email, password);
    });
  });

  describe('Form', () => {
    describe('Login button', () => {
      it('should be disabled on invalid form', () => {
        component.form.setValue({ email: '', password: '' }, { emitEvent: false });
        component.submitted = false;
        fixture.detectChanges();
        const compiled = fixture.nativeElement as HTMLElement;
        expect(compiled.querySelector('button[type="submit"]')?.getAttribute('disabled')).toEqual("true");
      });
      it('should be disabled if submitted', () => {
        component.form.setValue({ email: 'test@test', password: '123456' }, { emitEvent: false });
        component.submitted = true;
        fixture.detectChanges(true);
        const compiled = fixture.nativeElement as HTMLElement;
        expect(compiled.querySelector('button[type="submit"]')?.getAttribute('disabled')).toEqual("true");
      });
      it('should be enabled otherwise', () => {
        component.form.setValue({ email: 'test@test', password: '123456' }, { emitEvent: false });
        component.submitted = false;
        fixture.detectChanges();
        const compiled = fixture.nativeElement as HTMLElement;
        expect(compiled.querySelector('button[type="submit"]')?.getAttribute('disabled')).toBeNull();
      });
    });
  });
});
