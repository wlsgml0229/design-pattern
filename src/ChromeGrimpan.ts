//구체적구현 - 콘크리트 그림판
import Grimpan from './AbstractGrimpan.js';
export default class ChromeGrimpan extends Grimpan {
  private static instance: ChromeGrimpan;

  initialize() {}

  static override getInstance() {
    if (!this.instance) {
      this.instance = new ChromeGrimpan(document.querySelector('canvas'));
    }
    return this.instance;
  }
}
