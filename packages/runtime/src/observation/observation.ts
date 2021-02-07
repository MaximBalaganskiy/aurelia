import { DI } from '@aurelia/kernel';
import { connectable } from '../binding/connectable.js';
import { enterConnectable, exitConnectable } from './connectable-switcher.js';
import { IObserverLocator } from './observer-locator.js';

import type { ICollectionSubscriber, IConnectable, ISubscriber } from '../observation.js';
import type { BindingObserverRecord } from '../binding/connectable.js';

export interface IObservation extends Observation {}
export const IObservation = DI.createInterface<IObservation>('IObservation', x => x.singleton(Observation));

export class Observation implements IObservation {

  public static get inject() { return [IObserverLocator]; }

  public constructor(
    public readonly observerLocator: IObserverLocator,
  ) {}

  /**
   * Run an effect function an track the dependencies inside it,
   * to re-run whenever a dependency has changed
   */
  public run(fn: EffectFunc): IEffect {
    const effect = new Effect(this.observerLocator, fn);
    // todo: batch effect run after it's in
    effect.run();
    return effect;
  }
}

export type EffectFunc = (runner: IConnectable) => void;
export interface IEffect extends IConnectable {
  run(): void;
  stop(): void;
}

interface Effect extends IConnectable {}
class Effect implements IEffect, ISubscriber, ICollectionSubscriber {

  public readonly interceptor: this = this;
  public readonly obs!: BindingObserverRecord;
  // to configure this, potentially a 2nd parameter is needed for run
  public maxRunCount: number = 10;
  private queued: boolean = false;
  private running: boolean = false;
  private runCount: number = 0;
  private stopped: boolean = false;

  public constructor(
    public readonly observerLocator: IObserverLocator,
    public readonly fn: EffectFunc,
  ) {
    connectable.assignIdTo(this);
  }

  public handleChange(): void {
    this.queued = true;
    this.run();
  }

  public handleCollectionChange(): void {
    this.queued = true;
    this.run();
  }

  public run(): void {
    if (this.stopped) {
      throw new Error('Effect has already been stopped');
    }
    if (this.running) {
      return;
    }
    ++this.runCount;
    this.running = true;
    this.queued = false;
    ++this.obs.version;
    try {
      enterConnectable(this);
      this.fn(this);
    } finally {
      this.obs.clear(false);
      this.running = false;
      exitConnectable(this);
    }
    // when doing this.fn(this), there's a chance that it has recursive effect
    // continue to run for a certain number before bailing
    // whenever there's a dependency change while running, this.queued will be true
    // so we use it as an indicator to continue to run the effect
    if (this.queued) {
      if (this.runCount > this.maxRunCount) {
        this.runCount = 0;
        throw new Error('Maximum number of recursive effect run reached. Consider handle effect dependencies differently.');
      }
      this.run();
    } else {
      this.runCount = 0;
    }
  }

  public stop(): void {
    this.stopped = true;
    this.obs.clear(true);
  }
}

connectable(Effect);
