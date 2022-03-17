import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormComponent } from '../../shared/form/form.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { first, Observable, skip, switchMap, takeUntil } from 'rxjs';
import { map } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Transaction, TransactionService } from '../../shared/transaction';
import { ApplicationStateService } from '../../shared/application-state.service';

@Component({
  selector: 'app-transaction-form',
  templateUrl: './transaction-form.component.html',
  styleUrls: ['./transaction-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TransactionFormComponent extends FormComponent<Transaction> {
  get account$() {
    return this.appStateService.nonNullAccount$;
  }

  get creditorCtrl() {
    return this.getCtrl('creditor');
  }

  get dateCtrl() {
    return this.getCtrl('date');
  }

  get labelCtrl() {
    return this.getCtrl('label');
  }

  get amountCtrl() {
    return this.getCtrl('amount');
  }

  get debtorsArray() {
    return this.getArray('debtors');
  }

  get participants$() {
    return this.account$.pipe(map(account => account.participants));
  }

  constructor(route: ActivatedRoute, fb: FormBuilder, sb: MatSnackBar, private appStateService: ApplicationStateService,
              private transactionService: TransactionService, private location: Location) {
    super(fb, sb);
    this.participants$.pipe(takeUntil(this.destroyed)).subscribe(participants => {
      this.debtorsArray.clear();
      participants.forEach(participant => {
        const debtorForm = fb.group({
          selected: [true, [Validators.required]],
          weight: [participant.weight, [Validators.required, Validators.min(1)]],
        });
        debtorForm.get('selected')!.valueChanges.pipe(takeUntil(this.participants$.pipe(skip(1))))
          .subscribe(selected => {
            const weightCtrl = debtorForm.get('weight')!;
            if (selected) {
              weightCtrl.enable();
            } else {
              weightCtrl.disable();
            }
          });
        this.debtorsArray.push(debtorForm);
      });
    });
  }

  hasDebtorError(index: number, name: string, error: string) {
    return this.debtorsArray.at(index).get(name)?.hasError(error);
  }

  protected createForm(fb: FormBuilder): FormGroup {
    return fb.group({
      date: [new Date(), [Validators.required]],
      label: [null, [Validators.required]],
      amount: [null, [Validators.required]],
      creditor: [null, [Validators.required]],
      debtors: fb.array([]),
    });
  }

  protected doSubmit(): Observable<Transaction> {
    return this.account$.pipe(
      first(),
      switchMap(account => {
        const transaction = { ...this.form.value } as Omit<Transaction, 'id'>;
        transaction.debtors = [];
        (this.debtorsArray.value as { selected: boolean, weight: number }[]).forEach((debtor, participant) => {
          if (debtor.selected) {
            transaction.debtors.push({ participant, weight: debtor.weight });
          }
        });
        return this.transactionService.create(account, transaction);
      }),
    );
  }

  protected success(object: Transaction): void {
    this.location.back();
  }

  protected override computeSuccessMsg(object: Transaction): string | Observable<string> {
    return `C'est enregistré !`;
  }

  protected computeErrorMsg(error: any): string {
    return error.code;
  }
}
