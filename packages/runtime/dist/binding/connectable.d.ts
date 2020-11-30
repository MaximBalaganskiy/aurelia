import { Class, IServiceLocator, ResourceDefinition } from '@aurelia/kernel';
import { IConnectable, ISubscribable, ISubscriber, IBinding, LifecycleFlags } from '../observation.js';
import { IObserverLocator } from '../observation/observer-locator.js';
import type { Scope } from '../observation/binding-context.js';
export interface IPartialConnectableBinding extends IBinding, ISubscriber {
    observerLocator: IObserverLocator;
}
export interface IConnectableBinding extends IPartialConnectableBinding, IConnectable {
    id: number;
    record: BindingObserverRecord;
    addObserver(observer: ISubscribable): void;
    unobserve(all?: boolean): void;
}
export declare function getRecord(this: IConnectableBinding): BindingObserverRecord;
declare type ObservationRecordImplType = {
    id: number;
    version: number;
    count: number;
    binding: IConnectableBinding;
} & ISubscriber & Record<string, unknown>;
export interface BindingObserverRecord extends ISubscriber, ObservationRecordImplType {
}
export declare class BindingObserverRecord implements ISubscriber {
    binding: IConnectableBinding;
    id: number;
    version: number;
    count: number;
    constructor(binding: IConnectableBinding);
    handleChange(value: unknown, oldValue: unknown, flags: LifecycleFlags): unknown;
    add(observer: ISubscribable & {
        [id: number]: number;
    }): void;
    clear(all?: boolean): void;
}
declare type DecoratableConnectable<TProto, TClass> = Class<TProto & Partial<IConnectableBinding> & IPartialConnectableBinding, TClass>;
declare type DecoratedConnectable<TProto, TClass> = Class<TProto & IConnectableBinding, TClass>;
declare function connectableDecorator<TProto, TClass>(target: DecoratableConnectable<TProto, TClass>): DecoratedConnectable<TProto, TClass>;
export declare function connectable(): typeof connectableDecorator;
export declare namespace connectable {
    var assignIdTo: (instance: IConnectableBinding | BindingObserverRecord) => void;
}
export declare function connectable<TProto, TClass>(target: DecoratableConnectable<TProto, TClass>): DecoratedConnectable<TProto, TClass>;
export declare namespace connectable {
    var assignIdTo: (instance: IConnectableBinding | BindingObserverRecord) => void;
}
export declare type MediatedBinding<K extends string> = {
    [key in K]: (newValue: unknown, previousValue: unknown, flags: LifecycleFlags) => void;
};
export interface BindingMediator<K extends string> extends IConnectableBinding {
}
export declare class BindingMediator<K extends string> implements IConnectableBinding {
    readonly key: K;
    readonly binding: MediatedBinding<K>;
    observerLocator: IObserverLocator;
    locator: IServiceLocator;
    interceptor: this;
    constructor(key: K, binding: MediatedBinding<K>, observerLocator: IObserverLocator, locator: IServiceLocator);
    $bind(flags: LifecycleFlags, scope: Scope, hostScope?: Scope | null, projection?: ResourceDefinition): void;
    $unbind(flags: LifecycleFlags): void;
    handleChange(newValue: unknown, previousValue: unknown, flags: LifecycleFlags): void;
}
export {};
//# sourceMappingURL=connectable.d.ts.map