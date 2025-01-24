import {
  AbstractGrimpanFactory,
  ChromeGrimpanFactory,
  IEGrimpanFactory,
} from './GrimpanFactory.js';
import { GrimpanHistory } from './GrimpanHistory.js';
import { GrimpanMenu } from './GrimpanMenu.js';

// GrimpanOption 타입 정의 (추정)
export interface GrimpanOption {
  menu: any; // 정확한 타입이 필요하면 수정
}

export type GrimpanMode = 'pen' | 'eraser' | 'pipette' | 'circle' | 'rectangle';

export abstract class Grimpan {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  history!: GrimpanHistory;
  menu!: GrimpanMenu;
  mode: GrimpanMode;

  protected constructor(
    canvas: HTMLElement | null,
    factory: typeof AbstractGrimpanFactory,
  ) {
    if (!canvas || !(canvas instanceof HTMLCanvasElement)) {
      throw new Error('canvas 엘리먼트를 입력하세요');
    }
    this.canvas = canvas;
    this.ctx = this.canvas.getContext('2d')!;
    this.mode = 'pen';
  }

  setMode(mode: GrimpanMode) {
    console.log('mode change', mode);
    this.mode = mode;
  }

  abstract initialize(option: GrimpanOption): void;
  static getInstance(): Grimpan {
    throw new Error('getInstance()는 하위 클래스에서 구현해야 합니다.');
  }
}

export class ChromeGrimpan extends Grimpan {
  static instance?: ChromeGrimpan;
  menu: GrimpanMenu;
  history: GrimpanHistory;

  private constructor(
    canvas: HTMLCanvasElement,
    factory: typeof ChromeGrimpanFactory,
  ) {
    super(canvas, factory);
    this.menu = factory.createGrimpanMenu(
      this,
      document.querySelector('#menu') as HTMLElement,
    );
    this.history = factory.createGrimpanHistory(this);
  }

  initialize(option: GrimpanOption) {
    this.menu.initialize(option.menu);
    this.history.initialize();
  }

  static getInstance(): ChromeGrimpan {
    if (!this.instance) {
      const canvas = document.querySelector('canvas') as HTMLCanvasElement;
      if (!canvas) throw new Error('캔버스를 찾을 수 없습니다.');
      this.instance = new ChromeGrimpan(canvas, ChromeGrimpanFactory);
    }
    return this.instance;
  }
}

export class IEGrimpan extends Grimpan {
  static instance?: IEGrimpan;

  private constructor(
    canvas: HTMLCanvasElement,
    factory: typeof IEGrimpanFactory,
  ) {
    super(canvas, factory);
  }

  initialize(): void {}

  static getInstance(): IEGrimpan {
    if (!this.instance) {
      const canvas = document.querySelector('canvas') as HTMLCanvasElement;
      if (!canvas) throw new Error('캔버스를 찾을 수 없습니다.');
      this.instance = new IEGrimpan(canvas, IEGrimpanFactory);
    }
    return this.instance;
  }
}
