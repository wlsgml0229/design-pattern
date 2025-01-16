//개선된 버전의 그림판 클래스
class Grimpan {
  private static instance: Grimpan;
  constructor(canvas: HTMLElement | null) {
    if (!canvas || !(canvas instanceof HTMLCanvasElement)) {
      throw new Error('canvas 엘리먼트를 입력하세요');
    }
  }

  initialize() {}
  initializeMenu() {}

  static getInstance() {
    if (!this.instance) {
      this.instance = new Grimpan(document.querySelector('canvas'));
    }
    return this.instance;
  }
}

export default Grimpan;
