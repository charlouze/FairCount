import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { first, Observable, switchMap, takeUntil } from 'rxjs';
import { Account, AccountService } from '../../shared/account';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { FormComponent } from '../../shared/form/form.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApplicationStateService } from '../../shared/application-state.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-account-member',
  templateUrl: './account-member.component.html',
  styleUrls: ['./account-member.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountMemberComponent extends FormComponent<Account> implements OnInit {
  get account$(): Observable<Account> {
    return this.appStateService.nonNullAccount$;
  }

  get membersArray() {
    return this.getArray('members');
  }

  get memberCtrls() {
    return this.membersArray.controls as FormControl[];
  }

  constructor(fb: FormBuilder, sb: MatSnackBar, private location: Location,
              private appStateService: ApplicationStateService, private accountService: AccountService) {
    super(fb, sb);
  }

  ngOnInit() {
    this.account$.pipe(takeUntil(this.destroyed)).subscribe(account => {
      this.membersArray.clear();
      account.members.forEach(member => {
        this.membersArray.push(AccountMemberComponent.createMemberFormControl(member));
      });
    });
  }

  addMember() {
    this.membersArray.push(AccountMemberComponent.createMemberFormControl());
  }

  removeMember(index: number) {
    this.membersArray.removeAt(index);
  }

  protected createForm(fb: FormBuilder): FormGroup {
    return fb.group({
      members: fb.array([]),
    });
  }

  protected doSubmit(): Observable<Account> {
    return this.account$.pipe(
      first(),
      switchMap(account => this.accountService.update(account, { members: this.membersArray.value })),
    );
  }

  protected success(object: Account): void {
    this.location.back();
  }

  protected override computeSuccessMsg(object: Account): string | Observable<string> | null {
    return `C'est enregistré !`;
  }

  protected computeErrorMsg(error: any): string {
    return '';
  }

  private static createMemberFormControl(name?: string): FormControl {
    return new FormControl(name, [Validators.required, Validators.email]);
  }
}
