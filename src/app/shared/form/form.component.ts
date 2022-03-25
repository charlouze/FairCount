import { FormBuilder } from '@angular/forms';
import { finalize, first, Observable } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SubFormComponent } from './sub-form.component';

export abstract class FormComponent<T> extends SubFormComponent {
  submitted = false;

  protected constructor(fb: FormBuilder, private sb: MatSnackBar) {
    super(fb);
    this.form = this.createForm(fb);
  }

  protected abstract doSubmit(): Observable<T>;

  protected abstract success(object: T): void;

  protected abstract computeSuccessMsg(object: T): null | string | Observable<string>;

  protected abstract computeErrorMsg(error: any): string;

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
