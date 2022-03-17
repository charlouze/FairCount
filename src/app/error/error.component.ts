import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ErrorComponent {
  get code() {
    return this.route.queryParamMap.pipe(map(queryParam => queryParam.get('code')));
  }

  constructor(private route: ActivatedRoute) {
  }
}
