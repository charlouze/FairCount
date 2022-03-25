import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormComponent } from '../../shared/form';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  combineLatest,
  combineLatestWith,
  filter,
  first,
  merge,
  Observable,
  of,
  partition,
  skip,
  switchMap,
  takeUntil,
} from 'rxjs';
import { map } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Transaction, TransactionService } from '../../shared/transaction';
import { ApplicationStateService } from '../../shared/application-state.service';
import { cache } from '../../shared/cache.operator';
import { Account } from '../../shared/account';
import { DateTime } from 'luxon';

@Component({
  selector: 'app-transaction-form',
  templateUrl: './transaction-form.component.html',
  styleUrls: ['./transaction-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TransactionFormComponent extends FormComponent<Transaction> {
  get transaction$() {
    return this.route.paramMap.pipe(switchMap(params => {
      if (params.has('accountId') && params.has('transactionId')) {
        return this.transactionService.getOneChanges({ id: params.get('accountId')! }, params.get('transactionId')!)
          .pipe(cache);
      } else {
        return of(null);
      }
    }));
  }

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

  get debtorCtrls() {
    return this.debtorsArray.controls as FormGroup[];
  }

  get participants$() {
    return this.account$.pipe(map(account => account.participants));
  }

  get edit$() {
    return this.route.data.pipe(map(data => data['edit'] as boolean));
  }

  constructor(private route: ActivatedRoute, fb: FormBuilder, sb: MatSnackBar, private appStateService: ApplicationStateService,
              private transactionService: TransactionService, private location: Location) {
    super(fb, sb);
    combineLatest([this.participants$, this.transaction$]).pipe(takeUntil(this.destroyed)).subscribe(([participants, transaction]) => {
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

        if (transaction) {
          this.debtorsArray.patchValue(participants.map((participant, index) => {
            const debtor = transaction?.debtors.find(debtor => debtor.participant === index);
            return {
              selected: debtor != null,
              weight: debtor == null ? participant.weight : debtor.weight,
            };
          }));
        }
      });
    });

    this.route.data.pipe(
      map(data => data['edit'] as boolean),
      filter(edit => edit),
      switchMap(() => this.transaction$),
      takeUntil(this.destroyed),
    ).subscribe((transaction) => {
      this.form.patchValue({
        date: transaction?.date,
        label: transaction?.label,
        amount: transaction?.amount,
        creditor: transaction?.creditor,
      });
    });
  }

  getParticipantName(particpantIndex: number) {
    return this.participants$.pipe(map(particpants => particpants[particpantIndex]), map(participant => participant.name));
  }

  hasDebtorError(index: number, name: string, error: string) {
    return this.debtorsArray.at(index).get(name)?.hasError(error);
  }

  protected createForm(fb: FormBuilder): FormGroup {
    return fb.group({
      date: [DateTime.now(), [Validators.required]],
      label: [null, [Validators.required]],
      amount: [null, [Validators.required]],
      creditor: [null, [Validators.required]],
      debtors: fb.array([]),
    });
  }

  protected doSubmit(): Observable<Transaction> {
    const newTransaction = { ...this.form.value } as Omit<Transaction, 'id'>;
    newTransaction.debtors = [];
    (this.debtorsArray.value as { selected: boolean, weight: number }[]).forEach((debtor, participant) => {
      if (debtor.selected) {
        newTransaction.debtors.push({ participant, weight: debtor.weight });
      }
    });
    const [editObs, createObs] = partition(combineLatest([this.edit$, this.account$]).pipe(first()), ([edit]) => edit);
    const accountMapper = (editAndAccount: [boolean, Account]) => editAndAccount[1];
    return merge(
      createObs.pipe(
        map(accountMapper),
        switchMap(account => this.transactionService.create(account, newTransaction)),
      ),
      editObs.pipe(
        map(accountMapper), combineLatestWith(this.transaction$), first(),
        switchMap(([account, transaction]) => this.transactionService.update(account, transaction!, newTransaction)),
      ),
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
