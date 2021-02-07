import { DI, Metadata, Protocol, Registration } from '@aurelia/kernel';
import type { Constructable, IContainer } from '@aurelia/kernel';

type FuncPropNames<T> = {
  // eslint-disable-next-line @typescript-eslint/ban-types
  [K in keyof T]: K extends 'constructor' ? never : Required<T>[K] extends Function ? K : never;
}[keyof T];
export type LifecycleHook<TViewModel, TKey extends FuncPropNames<TViewModel>> = (vm: TViewModel, ...args: Parameters<Required<TViewModel>[TKey]>) => ReturnType<Required<TViewModel>[TKey]>;

export type ILifecycleHooks<TViewModel = {}, TKey extends FuncPropNames<TViewModel> = FuncPropNames<TViewModel>> = { [K in TKey]: LifecycleHook<TViewModel, K>; };
export const ILifecycleHooks = DI.createInterface<ILifecycleHooks>('ILifecycleHooks');

export type LifecycleHooksLookup<TViewModel = {}> = {
  [K in FuncPropNames<TViewModel>]?: readonly LifecycleHooksEntry<TViewModel, K>[];
};
export class LifecycleHooksEntry<TViewModel = {}, TKey extends FuncPropNames<TViewModel> = FuncPropNames<TViewModel>, THooks extends Constructable = Constructable> {
  public constructor(
    public readonly definition: LifecycleHooksDefinition<THooks>,
    public readonly instance: ILifecycleHooks<TViewModel, TKey>,
  ) {}
}

/**
 * This definition has no specific properties yet other than the type, but is in place for future extensions.
 *
 * See: https://github.com/aurelia/aurelia/issues/1044
 */
export class LifecycleHooksDefinition<T extends Constructable = Constructable> {
  private constructor(
    public readonly Type: T,
    public readonly propertyNames: ReadonlySet<string>,
  ) {}

  /**
   * @param def - Placeholder for future extensions. Currently always an empty object.
   */
  public static create<T extends Constructable>(def: {}, Type: T): LifecycleHooksDefinition<T> {
    const propertyNames = new Set<string>();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    let proto = Type.prototype;
    while (proto !== Object.prototype) {
      for (const name of Object.getOwnPropertyNames(proto)) {
        // This is the only check we will do for now. Filtering on e.g. function types might not always work properly when decorators come into play. This would need more testing first.
        if (name !== 'constructor') {
          propertyNames.add(name);
        }
      }
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      proto = Object.getPrototypeOf(proto);
    }

    return new LifecycleHooksDefinition(Type, propertyNames);
  }

  public register(container: IContainer): void {
    Registration.singleton(ILifecycleHooks, this.Type).register(container);
  }
}

const containerLookup = new WeakMap<IContainer, LifecycleHooksLookup<any>>();

export const LifecycleHooks = {
  name: Protocol.annotation.keyFor('lifecycle-hooks'),
  /**
   * @param def - Placeholder for future extensions. Currently always an empty object.
   */
  define<T extends Constructable>(def: {}, Type: T): T {
    const definition = LifecycleHooksDefinition.create(def, Type);
    Metadata.define(LifecycleHooks.name, definition, Type);
    Protocol.resource.appendTo(Type, LifecycleHooks.name);
    return definition.Type;
  },
  resolve(ctx: IContainer): LifecycleHooksLookup {
    let lookup = containerLookup.get(ctx);
    if (lookup === void 0) {
      lookup = {};
      const instances = [
        ...ctx.root.getAll(ILifecycleHooks, false),
        ...ctx.getAll(ILifecycleHooks, false),
      ];
      for (const instance of instances) {
        const definition = Metadata.getOwn(LifecycleHooks.name, instance.constructor) as LifecycleHooksDefinition;
        const entry = new LifecycleHooksEntry(definition, instance);
        for (const name of definition.propertyNames) {
          const entries = lookup[name];
          if (entries === void 0) {
            lookup[name] = [entry];
          } else {
            (entries as LifecycleHooksEntry[]).push(entry);
          }
        }
      }
    }
    return lookup;
  },
};

/**
 * Decorator: Indicates that the decorated class is a custom element.
 */
export function lifecycleHooks(): <T extends Constructable>(target: T) => T {
  return function decorator<T extends Constructable>(target: T): T {
    return LifecycleHooks.define({}, target);
  };
}
