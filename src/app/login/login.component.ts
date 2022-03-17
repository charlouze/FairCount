import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { FormComponent } from '../shared/form/form.component';
import { Observable } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService, User } from '../shared/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent extends FormComponent<User> {
  get emailCtrl() {
    return this.form.get('email') as FormControl;
  }

  get passwordCtrl() {
    return this.form.get('password') as FormControl;
  }

  constructor(fb: FormBuilder, sb: MatSnackBar, private authService: AuthService, private router: Router) {
    super(fb, sb);
  }

  protected createForm(fb: FormBuilder): FormGroup {
    return fb.group({
      email: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required, Validators.minLength(6)]],
    });
  }

  protected doSubmit(): Observable<User> {
    return this.authService.login(this.emailCtrl.value, this.passwordCtrl.value);
  }

  protected success(object: User) {
    this.router.navigate(['/home']);
  }

  protected override computeSuccessMsg(object: User): null | string | Observable<string> {
    return null;
  }

  protected computeErrorMsg(error: any): string {
    return error.code;
  }
}
