import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { FormComponent } from '../../shared/form/form.component';
import { Account, AccountService } from '../../shared/account';
import { filter, first, Observable, of, switchMap, takeUntil } from 'rxjs';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../shared/auth';
import { ApplicationStateService } from '../../shared/application-state.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-account-form',
  templateUrl: './account-form.component.html',
  styleUrls: ['./account-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountFormComponent extends FormComponent<Account> implements OnInit {
  get account$() {
    return this.appStateService.account$;
  }

  get nameCtrl() {
    return this.getCtrl('name');
  }

  get participantsArray() {
    return this.getArray('participants');
  }

  get participantGroups() {
    return this.getArray('participants').controls as FormGroup[];
  }

  constructor(fb: FormBuilder, sb: MatSnackBar, private location: Location,
              private authService: AuthService, private accountService: AccountService,
              private appStateService: ApplicationStateService) {
    super(fb, sb);
  }

  ngOnInit() {
    this.account$.pipe(
      takeUntil(this.destroyed),
      filter(account => !!account),
      map(account => account as Account),
    ).subscribe(account => {
      this.nameCtrl.setValue(account.name);
      this.participantsArray.clear();
      account.participants.forEach(participant => {
        const grp = AccountFormComponent.createParticipantFormGroup();
        grp.setValue(participant);
        this.participantsArray.push(grp);
      });
    });
  }

  addParticipant() {
    this.participantsArray.push(AccountFormComponent.createParticipantFormGroup());
  }

  canRemoveParticipant(participantIndex: number) {
    if (participantIndex < 2) {
      return of(false);
    } else {
      return this.account$.pipe(map(account => account == null || participantIndex >= account.participants.length));
    }
  }

  removeParticipant(participantIndex: number) {
    this.participantsArray.removeAt(participantIndex);
  }

  hasParticipantError(grp: FormGroup, ctrlName: string, error: string) {
    const ctrl = grp.get(ctrlName);
    if (ctrl && ctrl.touched) {
      return ctrl.hasError(error);
    }
    return false;
  }

  protected createForm(fb: FormBuilder): FormGroup {
    return fb.group({
      name: [null, [Validators.required]],
      participants: fb.array([
        AccountFormComponent.createParticipantFormGroup(),
        AccountFormComponent.createParticipantFormGroup(),
      ]),
    });
  }

  protected doSubmit(): Observable<Account> {
    return this.account$.pipe(first(), switchMap(account => {
      if (account) {
        return this.accountService.update(account, this.form.value);
      } else {
        return this.authService.user.pipe(first(), switchMap(user => this.accountService.create(user, this.form.value)));
      }
    }));
  }

  protected success(object: Account): void {
    this.location.back();
  }

  protected override computeSuccessMsg(object: Account): string | Observable<string> {
    return `C'est enregistré !`;
  }

  protected computeErrorMsg(error: any): string {
    return '';
  }

  private static createParticipantFormGroup(): FormGroup {
    return new FormGroup({
      name: new FormControl(null, Validators.required),
      weight: new FormControl(1, [Validators.required, Validators.min(1)]),
    });
  }
}
