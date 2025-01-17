import Grimpan from './AbstractGrimpan';
import AbstractGrimpanFactory from './AbstractGrimpanFactory';
import ChromeGrimpan from './ChromeGrimpan';
import IEGrimpan from './IEGrimpan';

//팩토리메소드 패턴으로 구현
class ChromeGrimpanFactory extends AbstractGrimpanFactory {
  static override createGrimpan() {
    return ChromeGrimpan.getInstance();
}

class IEGrimpanFactory extends AbstractGrimpanFactory {
    static override createGrimpan() {
    return IEGrimpan.getInstance();
  }
}

function main() {
  const grimpan =  ChromeGrimpanFactory.createGrimpan();
  grimpan.initialize();
  grimpan.initializeMenu();
}



