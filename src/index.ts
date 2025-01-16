import Grimpan from './grimpan.js';

/**
 * 외부주입 패턴
 */
function main(instance: any) {
  instance.initialize();
}

main(Grimpan.getInstance());
