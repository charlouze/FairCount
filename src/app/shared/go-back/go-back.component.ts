import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-go-back',
  templateUrl: './go-back.component.html',
  styleUrls: ['./go-back.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GoBackComponent {
  constructor(private location: Location) {
  }

  goBack() {
    this.location.back();
  }
}
