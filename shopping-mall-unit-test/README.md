> [섹션 3. 단위 테스트 작성하기](#섹션-3-단위-테스트-작성하기)

# 섹션 3. 단위 테스트 작성하기

## 3.1 단위 테스트 대상 선정하기

### 단위 테스트

- 앱에서 테스트 가능한 가장 작은 소프트웨어를 검증하는 테스트
- 검증 대상:
  - 함수의 **결괏값**
  - 컴포넌트의 **UI 상태**
  - 동작 시 발생하는 **행위**
- 다른 컴포넌트와의 **상호작용이 없는 공통 컴포넌트**가 단위 테스트에 적합

### 단위 테스트가 불필요한 경우

- **UI만 그리는 단순 컴포넌트**는 테스트할 필요가 없다.
  - Ex. `ProductInfoArea`: 상품 이름, 가격, 이미지 표시
  - 검증은 스토리북으로 충분하다.
- **간단한 로직만 있는 컴포넌트**는 통합 테스트에서 함께 검증한다.
  - Ex. `네비게이션 바`: 개별 버튼 단위 테스트 대신 네비게이션 바 통합 테스트로 상태 변화 확인
    - 로그인 상태 → 장바구니 버튼 제공
    - 비로그인 상태 → 로그인 버튼 제공
- Material UI 같은 **라이브러리 컴포넌트**는 이미 자체적으로 단위 테스트가 충분히 되어있기 때문에 별도의 단위 테스트를 작성할 필요가 없다.
  - 직접 만들 컴포넌트라면 반드시 단위 테스트를 해야 한다.

### 단위 테스트에 적합한 대상

- **공통 유틸 함수**
  - 다른 모듈과의 의존성이 거의 없다.
  - 프로젝트 전역에서 재사용된다.
  - 기능이 명확해 단위 테스트로 검증하기 좋다.
  - Ex. `pick` 함수: 특정 객체에서 지정한 key만 뽑아온다.
- 다른 컴포넌트와 **의존성이나 상호작용이 거의 없는 컴포넌트**
  - 장바구니 상품 없음 → `EmptyNotice`
  - 에러 발생 → `뒤로 이동` 버튼
  - NotFound → `홈으로 이동` 버튼
  - ⇒ 위의 컴포넌트들은 React Router DOM에 의존하므로 **mocking**이 필요하다.

### 예제: pick 함수 단위 테스트

`common.js`

```jsx
export const pick = (obj, ...propNames) => {
  if (!obj || !propNames) {
    return {};
  }

  return Object.keys(obj).reduce((acc, key) => {
    if (propNames.includes(key)) {
      acc[key] = obj[key];
    }

    return acc;
  }, {});
};
```

`common.spec.js`

```jsx
describe("pick util 단위테스트", () => {
  it("단일 인자로 전달된 키의 값을 객체에 담아 반환한다", () => {
    const obj = {
      a: "A",
      b: { c: "C" },
      d: null,
    };

    expect(pick(obj, "a")).toEqual({ a: "A" });
  });

  it("2개 이상의 인자로 전달된 키의 값을 객체에 담아 반환한다", () => {
    const obj = {
      a: "A",
      b: { c: "C" },
      d: null,
    };

    expect(pick(obj, "a", "b")).toEqual({ a: "A", b: { c: "C" } });
  });

  it("대상 객체로 아무 것도 전달 하지 않을 경우 빈 객체가 반환된다", () => {
    expect(pick()).toEqual({});
  });

  it("propNames를 지정하지 않을 경우 빈 객체가 반환된다", () => {
    const obj = {
      a: "A",
      b: { c: "C" },
      d: null,
    };

    expect(pick(obj)).toEqual({});
  });
});
```

- 단위 테스트로 각각의 기능을 상황에 맞게 손쉽게 검증할 수 있다.
- 앱에서의 편의성을 위해 만든 공통 유틸함수는 프로젝트 범용적으로 사용된다.
- 다른 모듈과의 의존성도 적기 때문에 유틸함수들도 단위 테스트로 검증하기 좋다.

### 정리

**쇼핑몰 예제 프로젝트의 단위 테스트 전략**

- state나 로직처리 없이 UI만 그리는 컴포넌트는 검증하지 않는다.
  - 해당 검증은 스토리북과 같은 도구를 통해 검증한다.
- 간단한 로직 처리만 하는 컴포넌트는 상위 컴포넌트의 통합 테스트에서 검증한다.
- 공통 유틸 함수는 단위 테스트로 검증한다.
  - 다른 모듈과의 의존성이 없다.
  - 여러 곳에서 사용되기 때문에 검증을 통해 안정성을 높여야 한다.

---

## 3.2 모듈 모킹(Mocking)

### 단위 테스트 대상 컴포넌트

아래 컴포넌트들은 독립적으로 사용되며, **React Router의 useNavigate 훅에 의존**한다. 단위 테스트 시 useNavigate 훅 자체를 검증할 필요는 없고, **해당 훅이 올바른 인자로 호출되는지만 검증**하면 된다.

- **EmptyNotice**: 장바구니 비었을 때 `"텅~"` + `홈으로 가기` 버튼
- **NotFoundPage**: 잘못된 경로 접근 시 `"페이지 경로가 잘못 되었습니다."` + `Home으로 이동` 버튼
- **ErrorPage**: 에러 발생 시 `"예상치 못한 에러가 발생했습니다"` + `뒤로 이동` 버튼

### 모킹(Mocking)

- 실제 모듈/객체를 대신하는 모의 객체(Mock) 생성
- 테스트 대상의 의존성을 제거하고, 필요한 동작만 검증할 수 있다.

**장점**

- 외부 모듈과 의존성을 제외한 필요한 부분만 검증할 수 있다.

**단점**

- 실제 모듈과 완전히 동일한 모의 객체를 구현하는 것은 큰 비용이 든다.
- 모의 객체를 남용하는 것은 테스트 신뢰성을 낮춘다.

### 모킹 사용 예시

`vi.mock()` 사용

```jsx
// 실제 모듈을 모킹한 모듈로 대체하여 테스트 실행
// useNavigate 훅으로 반환받은 navigate 함수가 올바르게 호출되었는가 -> 스파이 함수
const navigateFn = vi.fn();

vi.mock("react-router-dom", async () => {
  const original = await vi.importActual("react-router-dom");
  return { ...original, useNavigate: () => navigateFn };
});
```

- 첫 번째 인자: 모킹할 모듈 이름
- 두 번째 인자: 대체 구현
- `vi.importActual`로 실제 모듈을 가져온 뒤 필요한 부분만 재정의할 수 있다.

### 예제: EmptyNotice

EmptyNotice 컴포넌트

- **컴포넌트 - EmptyNotice.jsx**

  ```jsx
  import { Typography, Box, Link as MuiLink } from "@mui/material";
  import React from "react";
  import { useNavigate } from "react-router-dom";

  import { pageRoutes } from "@/apiRoutes";

  const EmptyNotice = () => {
    const navigate = useNavigate();

    const handleClickBack = () => {
      navigate(pageRoutes.main);
    };

    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          height: 400,
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <Typography sx={{ fontSize: "50px", fontWeight: "light" }}>
          텅~
        </Typography>
        <MuiLink
          underline="hover"
          onClick={handleClickBack}
          style={{ cursor: "pointer" }}
          role="link"
        >
          홈으로 가기
        </MuiLink>
      </Box>
    );
  };

  export default EmptyNotice;
  ```

**테스트 코드 - EmptyNotice.spec.jsx**

```jsx
it('"홈으로 가기" 링크를 클릭할 경우 "/" 경로로 navigate 함수가 호출된다', async () => {
  const { user } = await render(<EmptyNotice />);

  await user.click(screen.getByText("홈으로 가기"));

  expect(navigateFn).toHaveBeenNthCalledWith(1, "/");
});
```

### 예제: ErrorPage

ErrorPage 컴포넌트

- **컴포넌트 - ErrorPage.jsx**

  ```jsx
  import React from "react";
  import { useNavigate } from "react-router-dom";

  export const ErrorPage = () => {
    const navigate = useNavigate();
    const handleClickBackButton = () => {
      navigate(-1);
    };

    return (
      <div id="error-page">
        <h1>읔!</h1>
        <p>예상치 못한 에러가 발생했습니다.</p>
        <button onClick={handleClickBackButton}>뒤로 이동</button>
      </div>
    );
  };

  export default ErrorPage;
  ```

**테스트 코드 - ErrorPage.spec.jsx**

```jsx
it('"뒤로 이동" 버튼 클릭시 뒤로 이동하는 navigate(-1) 함수가 호출된다', async () => {
  const { user } = await render(<ErrorPage />);
  // button(role) 중에서 '뒤로 이동'(name)이란 텍스트를 가진 요소 지정
  const button = await screen.getByRole("button", { name: "뒤로 이동" });

  await user.click(button);

  expect(navigateFn).toHaveBeenNthCalledWith(1, -1);
});
```

### 예제: NotFoundPage

NotFoundPage 컴포넌트

- **컴포넌트 - NotFoundPage.jsx**

  ```jsx
  import React from "react";
  import { useNavigate } from "react-router-dom";

  import { pageRoutes } from "@/apiRoutes";

  export const NotFoundPage = () => {
    const navigate = useNavigate();
    const handleClickNavigateHomeButton = () => {
      navigate(pageRoutes.main, { replace: true });
    };

    return (
      <div id="error-page">
        <h1>404</h1>
        <p>페이지 경로가 잘못 되었습니다!</p>
        <button onClick={handleClickNavigateHomeButton}>Home으로 이동</button>
      </div>
    );
  };

  export default NotFoundPage;
  ```

**테스트 코드 - NotFoundPage.jsx**

```jsx
it("Home으로 이동 버튼 클릭시 홈 경로로 이동하는 navigate가 실행된다", async () => {
  const { user } = await render(<NotFoundPage />);
  const button = await screen.getByRole("button", { name: "Home으로 이동" });

  await user.click(button);

  expect(navigateFn).toHaveBeenNthCalledWith(1, "/", { replace: true });
});
```

### 모킹 초기화

- 특정 테스트의 모킹 작업이 다른 테스트에 영향을 준다면, 테스트의 신뢰성을 떨어뜨릴 수 있다.
- ⇒ 테스트를 실행한 뒤에는 명시적으로 모킹 초기화를 해야 한다.

**예시 teardown**

```jsx
afterEach(() => {
  server.resetHandlers();
  // 모킹된 모의 객체 호출에 대한 히스토리를 초기화
  // 모킹된 모듈의 구현을 초기화하지는 않는다. → 모킹된 상태로 유지됨
  // → 모킹 모듈 기반으로 작성한 테스트가 올바르게 실행
  // 반면, 모킹 히스토리가 계속 쌓임(호출 횟수나 인자가 계속 변경) → 다른 테스트에 영향을 줄 수 있음
  vi.clearAllMocks();
});

afterAll(() => {
  // 모킹 모듈에 대한 모든 구현을 초기화
  vi.resetAllMocks();
  server.close();
});
```

- `vi.clearAllMocks()` - 각 테스트가 종료된 후 호출
  - **모킹 함수 호출 히스토리 초기화** (구현 유지)
- `vi.resetAllMocks()` - 전체 테스트가 종료된 후 호출
  - mock 함수의 호출 기록과 구현 모두 제거. **mock은 유지되지만 빈 함수로 초기화**
- `vi.restoreAllMocks()`
  - mock 함수의 **mocking 자체를 해제하고 원래 함수로 복구** (히스토리 유지)

### 정리

**모킹**

- 실제 모듈/객체와 동일한 동작을 하도록 만든 모의 모듈/객체(Mock)로 실제를 대체하는 것
- `vi.mock()`을 사용해 **특정 모듈을 모킹**할 수 있다.
- 외부 모듈의 검증은 완전히 배제하고, 대상이 되는 컴포넌트의 테스트만 독립적으로 작성할 수 있다.
  - 단, 외부 모듈 역시 별도로 검증되어야 한다.

**모킹 초기화**

- 각 테스트의 **독립성과 안정성을 보장**하기 위해 teardown에서 모킹을 초기화
- vitest의 `resetAllMocks`, `clearAllMocks`, `restoreAllMocks`를 활용해 초기화한다.

---

## 3.3 리액트 훅 테스트 (feat. act 함수)

### 리액트 훅

- React 16.8부터 추가되었다.
- 컴포넌트 사이의 **로직이나 비즈니스 로직을 분리하여 재사용**할 수 있도록 도와준다.
  - 컴포넌트와 로직 사이의 결합도를 낮출 수 있다.
- 클래스 없이도 React 기능을 활용할 수 있게 한다.

### 예제: useConfirmModal

- `ConfirmModal` 컴포넌트를 보여주거나 닫을 때 사용하는 Hook
  - `ConfirmModal`: 상단 내비게이션 바에서 회원 이름을 눌러 로그아웃을 시도할 때 보여주는 모달 창
- 여러 컴포넌트에서 공통적으로 사용되므로, 안정성을 위해 **단위 테스트로 검증**해야 한다.
  - 외부 모듈 의존 없이 **독립적으로 동작하는 함수**이기 때문에 단위 테스트 작성에 적합하다.

**컴포넌트 - useConfirmModal**

```jsx
import { useState } from "react";

// - 호출 시 initialValue 인자를 지정하지 않은 경우, isModalOpened 상태가 false로 설정된다.
// - 호출 시 initialValue 인자를 boolean 값으로 지정하는 경우, 해당 값으로 isModalOpened 상태가 설정된다.
// - 훅의 toggleIsModalOpened()를 호출하면 isModalOpened 상태가 toggle된다.
const useConfirmModal = (initialValue = false) => {
  const [isModalOpened, setIsModalOpened] = useState(initialValue);

  const toggleIsModalOpened = () => {
    setIsModalOpened(!isModalOpened);
  };

  return {
    toggleIsModalOpened,
    isModalOpened,
  };
};

export default useConfirmModal;
```

### 커스텀 훅 테스트: renderHook()

대부분의 커스텀 훅은 내부에서 `useState`, `useEffect`를 사용하므로 **반드시 React 컴포넌트 내부에서 호출되어야만 실행**된다. 하지만 React Testing Library는 **`renderHook` API**를 제공하여 컴포넌트 없이도 **훅을 독립적으로 실행하고 검증**할 수 있게 해준다.

```jsx
const { result, rerender } = renderHook(useConfirmModal);
```

- `result`: 훅의 실행 결과를 담는다.
  - `result.current`를 통해 현재 상태를 추적할 수 있다.
- `rerender`: 인자를 바꿔 훅을 다시 렌더링해 상태가 제대로 갱신되는지 확인할 수 있다.

### 테스트 1. 초기값을 지정하지 않은 경우

```jsx
it("호출 시 initialValue 인자를 지정하지 않는 경우 isModalOpened 상태가 false로 설정된다.", () => {
  const { result } = renderHook(useConfirmModal);

  expect(result.current.isModalOpened).toBe(false);
});
```

### 테스트 2. 초기값을 true로 지정한 경우

- React Hook 역시 함수이기 때문에 원하는 인자를 함수 형태로 지정하여 렌더 훅 내에서 호출할 수 있다.

```jsx
it("호출 시 initialValue 인자를 boolean 값으로 지정하는 경우 해당 값으로 isModalOpened 상태가 설정된다.", () => {
  const { result } = renderHook(() => useConfirmModal(true));

  expect(result.current.isModalOpened).toBe(true);
});
```

### 테스트 3. 상태 토글 검증

- `toggleIsModalOpened` 함수 호출에 따라 `isModalOpend` 상태가 변경되는지 확인한다.

```jsx
// ❌ 테스트 실패
it("훅의 toggleIsModalOpened()를 호출하면 isModalOpened 상태가 toggle된다.", () => {
  const { result } = renderHook(useConfirmModal);

  result.current.toggleIsModalOpened();

  expect(result.current.isModalOpened).toBe(true);
});
```

테스트 실패

**왜 실패했을까?**

`toggleIsModalOpened()`는 내부적으로 `setIsModalOpened`를 호출한다. 이는 **React의 비동기 상태 업데이트**이기 때문에, 호출 직후엔 아직 `isModalOpened`가 변경되지 않은 상태일 수 있다.

테스트 환경(jsdom)에서는 React의 상태 변경이 렌더링 사이클에 완전히 반영되어야만 값을 검증할 수 있다. 이때 사용하는 함수가 바로 `act()`이다.

### act 함수

- React test utils에서 제공하는 유틸리티 함수
- **렌더링, 이펙트, 상태 변경 등 React 내부의 모든 업데이트를 한 사이클로 묶어서 실행**한다.
- 테스트 환경에서 act를 사용하면 **가상의 돔(jsdom)에 제대로 반영되었다는 가정**하에 테스트가 가능해진다. 즉, **실제 앱처럼 DOM이 완전히 갱신된 상태를 보장**하기 위한 함수이다.
- 컴포넌트를 렌더링한 뒤 업데이트하는 코드의 결과를 검증하고 싶을 때 사용한다.
- ⇒ 테스트 환경에서 컴포넌트 렌더링 결과를 jsdom에 반영하기 위해서는 반드시 act 함수를 호출해야 한다.

```jsx
it("훅의 toggleIsModalOpened()를 호출하면 isModalOpened 상태가 toggle된다.", () => {
  const { result } = renderHook(useConfirmModal);

  act(() => {
    result.current.toggleIsModalOpened();
  });

  expect(result.current.isModalOpened).toBe(true);
});
```

**왜 지금까지는 act 함수 없이 단위 테스트를 작성해도 통과했을까?**

- `render()`나 `userEvent.click()` 같은 Testing Library의 API는 내부적으로 `act()`를 호출한다.
  ```
  import { render } from "@testing-library/react";
  import userEvent from "@testing-library/user-event";
  ```
- 하지만 이번 예제처럼 **직접 상태를 변경하는 함수**(`toggleIsModalOpened`)를 호출할 때는 `act()`로 감싸야 React가 업데이트를 반영할 수 있다.

**Testing Llibrary의 act()**

- React Testing Library는 React의 기본 act보다 확장된 버전(비동기 업데이트까지 지원)을 제공한다.

```jsx
import { act } from "@testing-library/react";
```

### 정리

**리액트 훅**

- 컴포넌트 로직을 분리해 재사용성을 높인다.
- 리액트 렌더링 매커니즘을 따른 단순 함수이기 때문에 독립적인 **단위 테스트를 작성하기 적합**하다.
- React Testing Library의 **`renderHook` API를 사용하면 컴포넌트 없이 훅 테스트가 가능**하다.

**act()**

- 상호 작용(렌더링, 이펙트 등)을 함께 그룹화하고 실행하여 실제 앱에서 동작하는 것처럼 렌더링과 업데이트 상태를 반영하도록 도와준다.
- 테스트 환경에서 **컴포넌트의 렌더링, 업데이트 결과를 jsdom에 반영할 때 사용**해야 한다.
- React Testing Library의 `render` 함수와 `userEvent`는 내부적으로 `act` 함수를 호출한다.
- 이외에 **직접 상태를 변경하는 로직**은 반드시 `act`로 감싸서 `state`를 반영하도록 해야 한다.

---

## 섹션 3.4 타이머 테스트

### 예제: debounce 유틸 함수

```jsx
// 연이어 호출해도 마지막 호출 기준으로 지정된 타이머 시간이 지난 경우에만 콜백 호출
// -> 특정 함수의 호출 횟수를 제한하는 기능
export const debounce = (fn, wait) => {
  let timeout = null;

  return (...args) => {
    const later = () => {
      timeout = -1;
      fn(...args);
    };

    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = window.setTimeout(later, wait);
  };
};
```

### 예제: 특정 시간이 지난 후 함수가 호출된다.

콜백 함수를 spy로 감싸 특정 시간이 지난 후 호출되는지 검증한다.

```jsx
// ❌ 실패
it("특정 시간이 지난 후 함수가 호출된다.", () => {
  const spy = vi.fn();
  const debouncedFn = debounce(spy, 300);

  debouncedFn();

  expect(spy).toHaveBeenCalled();
});
```

**실패 원인**: 테스트 코드는 동기적으로 실행되므로, `setTimeout`에 의한 비동기 호출을 기다리지 못한다.

→ `debounce`의 타이머 실행을 테스트하기 위해 **타이머 모킹**이 필요하다.

### 타이머 모킹 (useFakeTimers)

`vi.useFakeTimers()`를 사용해 테스트 환경에서 타이머를 가짜로 만들고, `vi.advanceTimersByTime()`로 원하는 만큼 시간이 지난 것처럼 조작할 수 있다.

```jsx
describe("debounce", () => {
  beforeEach(() => {
    vi.useFakeTimers(); // 1. 타이머 모킹
  });

  it("특정 시간이 지난 후 함수가 호출된다.", () => {
    const spy = vi.fn();
    const debouncedFn = debounce(spy, 300);

    debouncedFn();
    vi.advanceTimersByTime(300); // 2. 0.3초 경과 시뮬레이션

    expect(spy).toHaveBeenCalled(); // 3. spy 함수 호출 확인
  });
});
```

### 예제: 연이어 호출해도 마지막 호출 기준으로만 실행된다.

```jsx
describe("debounce", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  it("특정 시간이 지난 후 함수가 호출된다.", () => {...});

  it("연이어 호출해도 마지막 호출 기준으로 지정된 타이머 시간이 지난 경우에만 함수가 호출된다.", () => {
    const spy = vi.fn();
    const debouncedFn = debounce(spy, 300);

    debouncedFn();

    // 최초 호출 후 0.2초 후 호출
    vi.advanceTimersByTime(200);
    debouncedFn();

    // 두 번째 호출 후 0.1초 후 호출
    vi.advanceTimersByTime(100);
    debouncedFn();

    // 세 번째 호출 후 0.2초 후 호출
    vi.advanceTimersByTime(200);
    debouncedFn();

    // 네 번째 호출 후 0.3초 후 호출
    // 최초 호출 후에 함수 호출 간격이 0.3초 이상인 경우는 다섯 번째 호출이 유일
    vi.advanceTimersByTime(300);
    debouncedFn();

    // 다섯 번을 호출했지만 실제 spy 함수는 단 한 번만 실행
    expect(spy).toBeCalledTimes(1);
  });
});
```

### 타이머 복원: useRealTimers

테스트가 끝난 후 다른 테스트에 영향을 주지 않도록, 모킹된 타이머를 원래대로 복원해야 한다.

```jsx
describe("debounce", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  // teardown에서 모킹 초기화 필수 (다른 테스트에 영향이 없어야 한다.)
  // -> 타이머 모킹도 초기화 필수
  // 3rd 파티 라이브러리, 전역의 teardown에서 타이머에 의존하는 로직 등이 fakeTimer로 인해 제대로 동작하지 않을 수 있기 때문
  afterEach(() => {
    vi.useRealTimers();
  });

  it("특정 시간이 지난 후 함수가 호출된다.", () => {...});
  it("연이어 호출해도 마지막 호출 기준으로 지정된 타이머 시간이 지난 경우에만 함수가 호출된다.", () => {...});
});
```

### 시스템 시간 고정: setSystemTime()

테스트 시점에 따라 현재 시간이 달라지는 경우, `vi.setSystemTime()`을 사용해 고정된 시간 환경을 만들 수 있다. → 시간에 의존하는 로직도 항상 일관된 환경에서 테스트할 수 있다. (Ex. 오늘 날짜 계산)

```jsx
vi.setSystemTime(new Date(’2023-12-25’)); // 2023년 12월 25일에 테스트하는 환경
```

### 정리

**타이머 테스트**

- 타이머를 원하는대로 제어하기 위해서는 **타이머 모킹**이 필요하다. (`vi.useFakeTimers()`)
- `vi.advanceTimersByTime()`으로 시간이 흐른 것처럼 제어할 수 있다.
- `vi.setSystemTime()`으로 테스트가 구동되는 시점을 정의할 수 있다.

**타이머 복원**

- 테스트 종료 후 다른 테스트에 영향을 주지 않기 위해 타이머 모킹을 해제해야 한다.
- vitest에서는 `vi.useRealTimers()`를 호출해 타이머를 원래대로 복원할 수 있다.

---

## 3.5 userEvent를 사용한 사용자 상호작용 테스트

### fireEvent

- React Testing Library(RTL)에 내장되어 있으므로, 별도의 설치가 필요 없다.
- 특정 DOM 이벤트만 발생시킬 수 있다.
- 단순히 이벤트 디스패치 수준으로 동작하므로 캡처링, 버블링만 제어 가능하다.

### 예제: fireEvent로 포커스 테스트

이전 예제에서 userEvent의 클릭 대신 fireEvent의 클릭을 사용해보자.

```jsx
// ❌ 실패
import { screen, fireEvent } from "@testing-library/react";

it("포커스가 활성화되면 onFocus prop으로 등록한 함수가 호출된다.", async () => {
  const spy = vi.fn();
  const textInput = screen.getByPlaceholderText("텍스트를 입력해 주세요.");

  await fireEvent.click(textInput);

  expect(spy).toHaveBeenCalled();
});
```

**실패 원인**: `fireEvent.click`은 단일 click 이벤트만 발생시킨다. 즉, focus 이벤트가 발생하지 않는다.

**fireEvent는 실제 상황과 거리가 있다.**

- **실제 상황**: 사용자가 실제 요소를 클릭할 때 `pointerdown` → `mousedown` → `pointerup` → `mouseup` → `click` → `focus` 등 이벤트가 연쇄적으로 발생한다.
- userEvent는 이러한 시나리오까지 모두 고려되어 있으므로 실제 상황과 유사하게 작성할 수 있다.

### useEvent

- 실제 사용자 동작과 유사하게 이벤트를 연쇄적으로 발생시킨다.
- `disabled`, `display` 상태 등을 고려하여 실제 동작과 유사하게 테스트할 수 있다.
  - 예: `disabled`된 텍스트 필드는 입력 불가
- 대부분의 사용자 상호작용 테스트에서 권장된다.
- useEvent에서 지원하지 않는 이벤트만 fireEvent로 검증하는 것이 좋다. (예: `scroll`)

### 정리

**fireEvent**

- `@testing-library/react` 모듈에 내장되어 제공된다.
- 특정 요소에서 원하는 이벤트만 쉽게 발생시킬 수 있다.

**fireEvent vs. userEvent**

- **fireEvent는 DOM 이벤트만 발생**시키는 반면, **userEvent는 다양한 상호 작용을 시뮬레이션**할 수 있다.
  - 클릭 이벤트가 발생한다면, 다른 이벤트들이 연쇄적으로 발생한다.
  - 실제 상황처럼 `disabled`된 버튼 클릭이나 인풋 입력이 불가능하다.
- **테스트 코드 작성 시에는 userEvent를 활용**해 실제 상황과 유사한 코드로 **테스트의 신뢰성**을 높이는 것이 좋다.
- userEvent에서 지원하지 않는 경우에만 fireEvent 활용을 고민하자.

---

## 3.6 단위 테스트의 한계

### 단위 테스트

- **공통 컴포넌트, 커스텀 훅, 공통 유틸**처럼 **외부 의존성이 거의 없는 모듈**에 적합하다.
- 모듈 자체의 **독립적 역할**을 효율적으로 검증할 수 있다.

### 한계

- 여러 모듈이 조합되었을 때 발생하는 이슈는 찾을 수 없다.
- 앱의 전반적인 기능이 **비즈니스 요구사항에 맞게 동작**하는지 보장할 수 없다.
- 단위 테스트에서 검증하지 못하는 부분은 **통합, E2E, 시각적 테스트** 등으로 보강해야 한다.

### (다음 섹션) 통합 테스트

- 여러 모듈이 조합되었을 때 **비즈니스 로직**을 검증한다.
- 비즈니스 로직 기준으로 **여러 컴포넌트 간의 상호 작용**을 한 번에 검증할 수 있다.
