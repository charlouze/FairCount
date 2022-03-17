import { ApplicationRef, Injectable } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { concat, filter, first, interval } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from './confirm-dialog';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AppUpdateService {
  constructor(private appRef: ApplicationRef, private update: SwUpdate, private snackbar: MatSnackBar,
              private dialog: MatDialog) {
  }

  init() {
    if (!environment.production) return;

    const appIsStable$ = this.appRef.isStable.pipe(first(isStable => isStable));
    const everySixHours$ = interval(6 * 60 * 60 * 1000);
    const everySixHoursOnceAppIsStable$ = concat(appIsStable$, everySixHours$);
    everySixHoursOnceAppIsStable$.subscribe(() => this.update.checkForUpdate());

    this.update.versionUpdates.subscribe(event => {
      switch (event.type) {
        case 'VERSION_READY':
          this.promptReload(`Une nouvelle version est prête. Recharger l'application pour en profiter.`);
          break;
        case 'VERSION_INSTALLATION_FAILED':
          this.error(`Une erreur est survenue lors de l'installation de la nouvelle version.`);
          break;
      }
    });

    this.update.unrecoverable.subscribe(() => this.promptReload(
      `Une erreur est survenue avec l'installation de la nouvelle version. Recharger l'application pour éviter tout désagrément.`));
  }

  private promptReload(msg: string) {
    this.dialog.open(ConfirmDialogComponent, {
      data: { msg: msg, action: 'Recharger' },
      hasBackdrop: false,
    }).afterClosed().pipe(filter(reload => reload)).subscribe(() => document.location.reload());
  }

  private error(msg: string) {
    this.snackbar.open(msg, 'OK');
  }
}
