import { ChangeDetectionStrategy, Component, Directive } from '@angular/core';
import { AppUpdateService } from '../../app-update.service';

@Directive({
  selector: '[appPageLayoutToolbar]',
})
export class PageLayoutToolbarDirective {
}

@Component({
  selector: 'app-page-layout',
  templateUrl: './page-layout.component.html',
  styleUrls: ['./page-layout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageLayoutComponent {
  constructor(public update: AppUpdateService) {
  }

  refresh() {
    document.location.reload();
  }
}
