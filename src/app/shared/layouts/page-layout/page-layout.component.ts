import { ChangeDetectionStrategy, Component, Directive } from '@angular/core';

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
}
