//구체적구현 - 콘크리트 그림판
import Grimpan from './AbstractGrimpan.js';
export default class IEGrimpan extends Grimpan {
  private static instance: IEGrimpan;

  initialize() {}

  static override getInstance() {
    if (!this.instance) {
      this.instance = new IEGrimpan(document.querySelector('canvas'));
    }
    return this.instance;
  }
}
