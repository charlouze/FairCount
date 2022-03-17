import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApplicationStateService } from '../../shared/application-state.service';

@Component({
  selector: 'app-account-home',
  templateUrl: './account-home.component.html',
  styleUrls: ['./account-home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountHomeComponent {
  get account$() {
    return this.appStateService.nonNullAccount$;
  }

  get transactions$() {
    return this.appStateService.nonNullTransactions$;
  }

  constructor(private route: ActivatedRoute, private router: Router, private sb: MatSnackBar,
              private appStateService: ApplicationStateService) {
  }
}
