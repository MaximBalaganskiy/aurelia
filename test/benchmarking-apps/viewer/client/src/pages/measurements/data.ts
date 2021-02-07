import { DI, IHttpClient, ILogger, PLATFORM } from 'aurelia';

export const IApi = DI.createInterface<IApi>('IApi', x => x.singleton(Api));
export interface IApi extends Api {}
export class Api {
  public constructor(
    @IHttpClient private readonly http: IHttpClient,
    @ILogger private readonly logger: ILogger,
  ) {
    this.logger = logger.scopeTo('Api');
    // http.configure(c => c.withDefaults({ mode: 'cors' }).withBaseUrl(`http://localhost:8080/api/`));
    http.configure(c => c.withDefaults({ mode: 'no-cors' }).withBaseUrl(`${PLATFORM.location.protocol}//${PLATFORM.location.host}/api/`));
  }

  public async getData(): Promise<DataSet> {
    const items = await (await this.http.get('measurements')).json() as DataItem[];
    const data = DataSet.create(items);
    this.logger.debug(`getData()`, data);
    return data;
  }
}

const durationKeys = [
  'durationInitialLoad',
  'durationPopulation',
  'durationUpdate',
  'durationShowDetails',
  'durationHideDetails',
  'durationLocaleDe',
  'durationLocaleEn',
  'durationSortFirstName',
  'durationSortFirstNameDesc',
  'durationSortLastName',
  'durationSortLastNameDesc',
  'durationSortDob',
  'durationSortDobDesc',
  'durationFilterEmployed',
  'durationFilterUnemployed',
  'durationFilterNone',
  'durationSelectFirst',
  'durationDeleteFirst',
  'durationDeleteAll',
] as const;

export class DataSet {
  public readonly durationKeys = durationKeys;
  public readonly items: DataItem[];

  public constructor(
    items: DataItem[],
  ) {
    this.items = items.map(DataItem.create, this);
  }

  public static create(items: DataItem[]): DataSet {
    return new DataSet(items);
  }
}

function from_0_to_100(m: Measurement): boolean {
  return m.initialPopulation === 0 && m.totalPopulation === 100;
}
function from_100_to_100(m: Measurement): boolean {
  return m.initialPopulation === 100 && m.totalPopulation === 100;
}
function from_0_to_1000(m: Measurement): boolean {
  return m.initialPopulation === 0 && m.totalPopulation === 1000;
}
function from_1000_to_1000(m: Measurement): boolean {
  return m.initialPopulation === 1000 && m.totalPopulation === 1000;
}

export class DataItem {
  public readonly measurements: Measurement[];
  public readonly measurement_0_100: Measurement;
  public readonly measurement_100_100: Measurement;
  public readonly measurement_0_1000: Measurement;
  public readonly measurement_1000_1000: Measurement;

  public constructor(
    public readonly dataSet: DataSet,
    public readonly ts_start: number,
    public readonly ts_end: number,
    public readonly branch: string,
    public readonly commit: string,
    measurements: Measurement[],
  ) {
    this.measurements = measurements.map(Measurement.create, this);
    this.measurement_0_100 = this.measurements.find(from_0_to_100)!;
    this.measurement_100_100 = this.measurements.find(from_100_to_100)!;
    this.measurement_0_1000 = this.measurements.find(from_0_to_1000)!;
    this.measurement_1000_1000 = this.measurements.find(from_1000_to_1000)!;
  }

  public static create(this: DataSet, d: DataItem): DataItem {
    return new DataItem(
      this,
      d.ts_start,
      d.ts_end,
      d.branch,
      d.commit,
      d.measurements,
    );
  }

  public isValid(): boolean {
    return (
      Number.isFinite(this.ts_start) &&
      Number.isFinite(this.ts_end) &&
      typeof this.branch === 'string' &&
      typeof this.commit === 'string' &&
      this.measurements.every(isValid)
    );
  }
}

function isValid(m: Measurement): boolean {
  return m.isValid();
}

export class Measurement {
  public constructor(
    public readonly dataItem: DataItem,

    public readonly framework: string,
    public readonly frameworkVersion: string,
    public readonly browser: string,
    public readonly browserVersion: string,

    public readonly initialPopulation: number,
    public readonly totalPopulation: number,

    public readonly durationInitialLoad: number,
    public readonly durationPopulation: number | undefined,
    public readonly durationUpdate: number,
    public readonly durationShowDetails: number,
    public readonly durationHideDetails: number,
    public readonly durationLocaleDe: number,
    public readonly durationLocaleEn: number,
    public readonly durationSortFirstName: number,
    public readonly durationSortFirstNameDesc: number,
    public readonly durationSortLastName: number,
    public readonly durationSortLastNameDesc: number,
    public readonly durationSortDob: number,
    public readonly durationSortDobDesc: number,
    public readonly durationFilterEmployed: number,
    public readonly durationFilterUnemployed: number,
    public readonly durationFilterNone: number,
    public readonly durationSelectFirst: number,
    public readonly durationDeleteFirst: number,
    public readonly durationDeleteAll: number,
  ) {}

  public static create(this: DataItem, m: Measurement): Measurement {
    return new Measurement(
      this,

      m.framework,
      m.frameworkVersion,
      m.browser,
      m.browserVersion,

      m.initialPopulation,
      m.totalPopulation,

      m.durationInitialLoad,
      m.durationPopulation,
      m.durationUpdate,
      m.durationShowDetails,
      m.durationHideDetails,
      m.durationLocaleDe,
      m.durationLocaleEn,
      m.durationSortFirstName,
      m.durationSortFirstNameDesc,
      m.durationSortLastName,
      m.durationSortLastNameDesc,
      m.durationSortDob,
      m.durationSortDobDesc,
      m.durationFilterEmployed,
      m.durationFilterUnemployed,
      m.durationFilterNone,
      m.durationSelectFirst,
      m.durationDeleteFirst,
      m.durationDeleteAll,
    );
  }

  public isValid(): boolean {
    return (
      typeof this.framework === 'string' &&
      typeof this.frameworkVersion === 'string' &&
      typeof this.browser === 'string' &&
      typeof this.browserVersion === 'string' &&

      Number.isFinite(this.initialPopulation) &&
      Number.isFinite(this.totalPopulation) &&

      this.dataItem.dataSet.durationKeys.every(isFiniteNumber, this)
    );
  }
}

function isFiniteNumber(this: Record<string, unknown>, key: string): boolean {
  return Number.isFinite(this[key]);
}
