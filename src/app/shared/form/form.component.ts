import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { finalize, first, Observable } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Destroyed } from '../destroyed';

export abstract class FormComponent<T> extends Destroyed {
  form: FormGroup;

  submitted = false;

  protected constructor(fb: FormBuilder, private sb: MatSnackBar) {
    super();
    this.form = this.createForm(fb);
  }

  protected abstract createForm(fb: FormBuilder): FormGroup;

  protected abstract doSubmit(): Observable<T>;

  protected abstract success(object: T): void;

  protected abstract computeSuccessMsg(object: T): null | string | Observable<string>;

  protected abstract computeErrorMsg(error: any): string;

  protected getCtrl(path: string) {
    return this.form.get(path) as FormControl;
  }

  protected getArray(path: string) {
    return this.form.get(path) as FormArray;
  }

  canSubmit() {
    return this.form.valid && !this.submitted;
  }

  submit() {
    if (this.canSubmit()) {
      this.submitted = true;
      this.doSubmit().pipe(finalize(() => this.submitted = false)).subscribe({
        next: object => {
          const msg = this.computeSuccessMsg(object);
          if (msg) {
            if (typeof msg === 'string') {
              this.showSuccessSnack(msg);
            } else {
              msg.pipe(first()).subscribe(msg => this.showSuccessSnack(msg));
            }
          }
          this.success(object);
        },
        error: error => this.sb.open(this.computeErrorMsg(error), 'Ok'),
      });
    }
  }

  private showSuccessSnack(msg: string) {
    this.sb.open(msg, 'Ok', { duration: 3000 });
  }
}
