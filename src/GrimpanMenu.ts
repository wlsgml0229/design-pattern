import Grimpan from './AbstractGrimpan.js';
import ChromeGrimpan from './ChromeGrimpan.js';
import IEGrimpan from './IEGrimpan.js';

export default abstract class GrimpanMenu {
  grimpan: Grimpan;
  protected constructor(grimpan: Grimpan) {
    this.grimpan = grimpan;
  }
  abstract initialize(): void;
  //그림판정보받기
  static getInstance(grimpan: Grimpan) {}
}

export class IEGrimpanMenu extends GrimpanMenu {
  private static instance: IEGrimpanMenu;

  override initialize(): void {}
  initializeMenu() {}

  static override getInstance(grimpan: IEGrimpan): IEGrimpanMenu {
    if (!this.instance) {
      this.instance = new IEGrimpanMenu(grimpan);
    }
    return this.instance;
  }
}

export class ChromeGrimpanMenu extends GrimpanMenu {
  private static instance: ChromeGrimpanMenu;

  override initialize(): void {}
  initializeMenu() {}

  static override getInstance(grimpan: ChromeGrimpan): ChromeGrimpanMenu {
    if (!this.instance) {
      this.instance = new IEGrimpanMenu(grimpan);
    }
    return this.instance;
  }
}
