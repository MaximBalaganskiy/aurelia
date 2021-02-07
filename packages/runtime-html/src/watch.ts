import { Constructable, Protocol, Metadata, emptyArray } from '@aurelia/kernel';
import type { IConnectable } from '@aurelia/runtime';

export type IDepCollectionFn<TType extends object, TReturn = unknown> = (vm: TType, watcher: IConnectable) => TReturn;
export type IWatcherCallback<TType extends object, TValue = unknown>
  = (this: TType, newValue: TValue, oldValue: TValue, vm: TType) => unknown;

export interface IWatchDefinition<T extends object = object> {
  expression: PropertyKey | IDepCollectionFn<T>;
  callback: keyof T | IWatcherCallback<T>;
}

type AnyMethod<R = unknown> = (...args: unknown[]) => R;
type WatchClassDecorator<T extends object> = <K extends Constructable<T>>(target: K) => void;
type WatchMethodDecorator<T> = <R, K extends AnyMethod<R> = AnyMethod<R>>(target: T, key: string | symbol, descriptor: PropertyDescriptor) => PropertyDescriptor;
type MethodsOf<Type> = {
  [Key in keyof Type]: Type[Key] extends AnyMethod ? Key : never
}[keyof Type];

// for
//    @watch('some.expression', (v) => ...)
//    @watch('some.expression', 'method')
//    @watch(Symbol, (v) => ...)
//    @watch(Symbol, 'method')
//    @watch(a => ..., 'method')
//    @watch(a => ..., v => ...)
//    class A {
//      method() {...}
//    }
export function watch<T extends object, D = unknown>(
  expressionOrPropertyAccessFn: PropertyKey,
  changeHandlerOrCallback: MethodsOf<T> | IWatcherCallback<T, D>,
): WatchClassDecorator<T>;

export function watch<T extends object, D = unknown>(
  expressionOrPropertyAccessFn: IDepCollectionFn<T, D>,
  changeHandlerOrCallback: MethodsOf<T> | IWatcherCallback<T, D>,
): WatchClassDecorator<T>;

// for
// class A {
//    @watch('some.expression')
//    @watch(Symbol)
//    @watch(a => ...)
//    method() {...}
// }
export function watch<T extends object = object, D = unknown>(
  expressionOrPropertyAccessFn: PropertyKey | IDepCollectionFn<T, D>
): WatchMethodDecorator<T>;

export function watch<T extends object = object>(
  expressionOrPropertyAccessFn: PropertyKey | IDepCollectionFn<object>,
  changeHandlerOrCallback?: PropertyKey | IWatcherCallback<T>,
): WatchClassDecorator<T> | WatchMethodDecorator<T> {
  if (!expressionOrPropertyAccessFn) {
    throw new Error('Invalid watch config. Expected an expression or a fn');
  }

  return function decorator(
    target: Constructable<T> | Constructable<T>['prototype'],
    key?: PropertyKey,
    descriptor?: PropertyDescriptor,
  ): void {
    const isClassDecorator = key == null;
    const Type = isClassDecorator ? target : target.constructor;

    // basic validation
    if (isClassDecorator) {
      if (typeof changeHandlerOrCallback !== 'function'
        && (changeHandlerOrCallback == null || !(changeHandlerOrCallback in Type.prototype))
      ) {
        throw new Error(`Invalid change handler config. Method "${String(changeHandlerOrCallback)}" not found in class ${Type.name}`);
      }
    } else if (typeof descriptor?.value !== 'function') {
      throw new Error(`decorated target ${String(key)} is not a class method.`);
    }

    Watch.add(
      Type,
      new WatchDefinition(expressionOrPropertyAccessFn, isClassDecorator ? changeHandlerOrCallback : descriptor!.value)
    );
  };
}

class WatchDefinition<T extends object> implements IWatchDefinition<T> {
  public constructor(
    public expression: PropertyKey | IDepCollectionFn<T>,
    public callback: IWatcherCallback<T>,
  ) {}
}

const noDefinitions: IWatchDefinition[] = emptyArray;
export const Watch = {
  name: Protocol.annotation.keyFor('watch'),
  add(Type: Constructable, definition: IWatchDefinition): void {
    let watchDefinitions: IWatchDefinition[] = Metadata.getOwn(Watch.name, Type);
    if (watchDefinitions == null) {
      Metadata.define(Watch.name, watchDefinitions = [], Type);
    }
    watchDefinitions.push(definition);
  },
  getAnnotation(Type: Constructable): IWatchDefinition[] {
    return Metadata.getOwn(Watch.name, Type) ?? noDefinitions;
  },
};
