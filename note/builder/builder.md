## 🏗️ 빌더 패턴을 활용한 GrimpanMenuBtn 객체 생성

프론트엔드 개발에서는 UI 요소를 동적으로 생성하고 조작하는 일이 많습니다. 특히 **버튼과 같은 UI 컴포넌트**는 다양한 상태와 동작을 가지므로 유연한 설계가 필요합니다. 이 글에서는 **빌더 패턴을 활용한 버튼 객체 생성 방식**을 소개합니다.

---

### 📌 기존 방식의 문제점

기존에는 `GrimpanMenuBtn` 클래스를 직접 생성하고, 필요할 때 setter 메서드를 이용해 값을 변경했습니다.

```typescript
const backBtn = new GrimpanMenuBtn('뒤로', 'back', () => {
  console.log('뒤로가기 클릭');
});

const longValue = ''; // 오래 걸리는 작업
backBtn.setValue(longValue);
```

**❗ 문제점:**

1. **객체가 완성된 상태인지 불명확** → `setValue()` 등을 호출해야 완성되는 상태라고 가정
2. **옵셔널 값의 구분이 어려움** → 필수 속성과 선택 속성이 섞여 있음
3. **실수로 잘못된 상태의 객체를 사용할 가능성**이 있음

---

### 🏗️ 빌더 패턴 적용

빌더 패턴을 적용하면 **객체를 단계적으로 생성**할 수 있고, **완성되지 않은 객체를 방지**할 수 있습니다.

#### **1️⃣ GrimpanMenuBtn 클래스**

```typescript
class GrimpanMenuBtn {
  private name: string;
  private type: string;
  private onClick?: () => void;
  private onChange?: () => void;
  private active?: boolean;
  private value?: string | number;

  private constructor(
    name: string,
    type: string,
    onClick?: () => void,
    onChange?: () => void,
    active?: boolean,
    value?: string | number,
  ) {
    this.name = name;
    this.type = type;
    this.onClick = onClick;
    this.onChange = onChange;
    this.active = active;
    this.value = value;
  }
```

#### **2️⃣ 빌더 클래스 추가**

```typescript
  static Builder = class GrimpanMenuBtnBuilder {
    private btn: GrimpanMenuBtn;

    constructor(name: string, type: string) {
      this.btn = new GrimpanMenuBtn(name, type);
    }

    setOnClick(onClick: () => void) {
      this.btn.onClick = onClick;
      return this;
    }

    setOnChange(onChange: () => void) {
      this.btn.onChange = onChange;
      return this;
    }

    setActive(active: boolean) {
      this.btn.active = active;
      return this;
    }

    setValue(value: string | number) {
      this.btn.value = value;
      return this;
    }

    build() {
      return this.btn;
    }
  };
}
```

#### **3️⃣ 빌더 패턴을 활용한 객체 생성**

```typescript
const backBtnBuilder = new GrimpanMenuBtn.Builder('뒤로', 'back')
  .setOnClick(() => console.log('뒤로가기 클릭'))
  .setActive(false)
  .build();
```

**✅ 장점:**

- **메소드 체이닝으로 가독성이 좋아짐**
- **필수 속성과 선택 속성이 명확하게 구분됨**
- **완성되지 않은 객체를 사용할 위험이 줄어듦**

---

### 🚀 빌더 패턴 확장 (Chrome, IE 버전 적용)

빌더 패턴을 확장하여 **브라우저별로 다른 버튼 객체를 생성**할 수도 있습니다.

#### **1️⃣ 공통 빌더 인터페이스**

```typescript
interface GrimpanMenuBtnBuilder {
  setName(name: string): this;
  setType(type: string): this;
  setOnClick(onClick: () => void): this;
  setOnChange(onChange: () => void): this;
  setActive(active: boolean): this;
  setValue(value: string | number): this;
  build(): GrimpanMenuBtn;
}
```

#### **2️⃣ 크롬 & IE 전용 빌더**

```typescript
class ChromeGrimpanMenuBtnBuilder implements GrimpanMenuBtnBuilder {
  private btn: GrimpanMenuBtn;
  constructor() {
    this.btn = new GrimpanMenuBtn();
  }
  setName(name: string) {
    this.btn.name = name;
    return this;
  }
  setType(type: string) {
    this.btn.type = type;
    return this;
  }
  setOnClick(onClick: () => void) {
    this.btn.onClick = onClick;
    return this;
  }
  setOnChange(onChange: () => void) {
    this.btn.onChange = onChange;
    return this;
  }
  setActive(active: boolean) {
    this.btn.active = active;
    return this;
  }
  setValue(value: string | number) {
    this.btn.value = value;
    return this;
  }
  build() {
    return this.btn;
  }
}
```

```typescript
class IEGrimpanMenuBtnBuilder implements GrimpanMenuBtnBuilder {
  private btn: GrimpanMenuBtn;
  constructor() {
    this.btn = new GrimpanMenuBtn();
  }
  setName(name: string) {
    this.btn.name = name;
    return this;
  }
  setType(type: string) {
    this.btn.type = type;
    return this;
  }
  setOnClick(onClick: () => void) {
    this.btn.onClick = onClick;
    return this;
  }
  setOnChange(onChange: () => void) {
    this.btn.onChange = onChange;
    return this;
  }
  setActive(active: boolean) {
    this.btn.active = active;
    return this;
  }
  setValue(value: string | number) {
    this.btn.value = value;
    return this;
  }
  build() {
    return this.btn;
  }
}
```

#### **3️⃣ 디렉터 활용 (객체 생성을 중앙에서 관리)**

```typescript
class GrimpanMenuBtnDirector {
  static createBackBtn(builder: GrimpanMenuBtnBuilder) {
    return builder
      .setName('뒤로')
      .setType('back')
      .setOnChange(() => {})
      .setActive(false);
  }
}

const backBtn = GrimpanMenuBtnDirector.createBackBtn(
  new ChromeGrimpanMenuBtnBuilder(),
).build();
```

---

### 🏆 결론

✅ **빌더 패턴을 활용하면**

- 객체가 완성된 상태로만 사용되도록 강제할 수 있음
- 필수/옵셔널 속성을 명확히 구분할 수 있음
- 유지보수성과 확장성이 좋아짐
