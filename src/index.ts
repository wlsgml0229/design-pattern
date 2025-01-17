import ChromeGrimpan from './ChromeGrimpan';
import IEGrimpan from './IEGrimpan';

// 단일책임원칙위반 - if 문이 생기면 확률 높아짐
// 타입을 판단하는 역할, 객체를 생성하는 역할 2가지
function grimpanFactory(type: string) {
  if (type === 'ie') {
    return IEGrimpan.getInstance();
  } else if (type === 'chrome') {
    return ChromeGrimpan.getInstance();
  } else {
    throw new Error('일치하는 Grimpan이 없습니다!');
  }
}

function main() {
  const grimpan = grimpanFactory('chrome');
  grimpan.initialize();
  grimpan.initializeMenu();
}
