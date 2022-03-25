import { Observable, shareReplay } from 'rxjs';

export const cache = <T> (source: Observable<T>) => source.pipe(shareReplay({ bufferSize: 1, refCount: true }));
