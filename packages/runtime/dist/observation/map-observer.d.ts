import { CollectionKind, AccessorType, LifecycleFlags } from '../observation.js';
import { CollectionSizeObserver } from './collection-size-observer.js';
import type { ICollectionObserver, ICollectionIndexObserver, ILifecycle } from '../observation.js';
export declare function enableMapObservation(): void;
export declare function disableMapObservation(): void;
export interface MapObserver extends ICollectionObserver<CollectionKind.map> {
}
export declare class MapObserver {
    inBatch: boolean;
    type: AccessorType;
    constructor(map: Map<unknown, unknown>);
    notify(): void;
    getLengthObserver(): CollectionSizeObserver;
    getIndexObserver(index: number): ICollectionIndexObserver;
    flushBatch(flags: LifecycleFlags): void;
}
export declare function getMapObserver(map: Map<unknown, unknown>, lifecycle: ILifecycle | null): MapObserver;
//# sourceMappingURL=map-observer.d.ts.map