interface Clonable {
  clone(): Clonable;
}

class HistoryStack extends Array implements Clonable {
  clone() {
    return this.slice() as HistoryStack;
  }
}

//클론메소드를 사용하면 히스토리스택은 불변배열이됨
// 기존연관관계가 끊어짐으로써
// 얕은복사긴하니까 내부는 참조관계가있을수있지만 배열자체는 끊김
// 로대시나 라이브러리통해서 진행해야하며 JSON.stringfy는 clone메소드는 복사가 안될수있음 (왜???)

/**프로토타입패턴은 복제하기 패턴이다.
 * 프로토타입패턴을 쓰기좋을때 전체 구조가 비슷한 속성이 여러개있을때
 * 일부만 바꾸는경우에 쓰기좋다. (통째로 복사후 일부만 변경)
 */
const a = new A(1, 2, 3, 4, 5, 6, 7, 8);
a.clone();
a.four = 40;

/**
 * 만약 엄청난 계산을 해서 나오는 결과값일경우
 * 캐싱할바에 캐싱로직을 밖에두지말고 클론으로 퉁침
 */
const a = new a({ very: 'heavy' });
const a2 = a.clone();

/**
 * 클론 자체 구현할때 깊은복사등 잘못되어서ㅓ 잘못구현되는경우가있을수있으니 유의가 필요하다
 * 원본객체가 따라서 수정되거나.. 상속관계가 복잡할떄 부모클래스 private값들이 많이쓰인경우 프로토 타입 적용하기 어렵다.
 * 프로토 타입패턴은
 */
