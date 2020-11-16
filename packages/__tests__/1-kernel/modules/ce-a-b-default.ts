import { customElement } from '@aurelia/runtime-html';

@customElement({ name: 'a' })
export class A {}

@customElement({ name: 'b' })
export class B {}

@customElement({ name: 'default' })
export default class {}
