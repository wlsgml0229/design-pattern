import { ChromeGrimpanMenu } from './\bGrimpanMenu';
import Grimpan from './AbstractGrimpan';
import ChromeGrimpan from './ChromeGrimpan';
import IEGrimpan from './IEGrimpan';

abstract class AbstractGrimpanFactory {
  static createGrimpan() {
    throw new Error('하위 클래스에서 구현');
  }

  static createGrimpanMenu(grimpan: Grimpan) {
    throw new Error('하위 클래스에서 구현');
  }
}

export class ChromeGrimpanFactory extends AbstractGrimpanFactory {
  static override createGrimpan() {
    return ChromeGrimpan.getInstance();
  }
  static override createGrimpanMenu(grimpan: Grimpan) {
    return ChromeGrimpanMenu.getInstance(grimpan);
  }
}

export class IEGrimpanFactory extends AbstractGrimpanFactory {
  static override createGrimpan() {
    return IEGrimpan.getInstance();
  }
  static override createGrimpanMenu(grimpan: Grimpan) {
    return ChromeGrimpanMenu.getInstance(grimpan);
  }
}

export default AbstractGrimpanFactory;
