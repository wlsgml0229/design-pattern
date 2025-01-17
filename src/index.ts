import { ChromeGrimpanFactory } from './GrimpanFactory';

//OCP위반 없음
function main() {
  const grimpan = ChromeGrimpanFactory.createGrimpan();
  const grimpanMenu = ChromeGrimpanFactory.createGrimpanMenu(grimpan);
  grimpan.initialize();
  grimpanMenu.initializeMenu();
}

main();
