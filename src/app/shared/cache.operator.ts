import { Observable, shareReplay } from 'rxjs';

export const cache = (source: Observable<any>) => source.pipe(shareReplay({ bufferSize: 1, refCount: true }));
