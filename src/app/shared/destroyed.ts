import { Subject } from 'rxjs';
import { Injectable, OnDestroy } from '@angular/core';

@Injectable()
export abstract class Destroyed implements OnDestroy {
  protected destroyed = new Subject<void>();

  ngOnDestroy(): void {
    this.destroyed.next();
  }
}
