> [섹션 4. 통합 테스트란?](#섹션-4-통합-테스트란)

# 섹션 4. 통합 테스트란?

## 4.1 통합 테스트란 무엇일까?

### 단위 테스트와 통합 테스트

**단위 테스트**

- 독립된 일부 모듈만을 대상으로 검증하므로 기능을 세밀하고 빠르게 검증할 수 있다.
- **여러 모듈이 조합되었을 때의 동작은 검증할 수 없다.**

**통합 테스트**

- 두 개 이상의 모듈이 상호 작용하며 발생하는 상태를 검증한다.
- 단위 테스트에 비해 모킹의 비중이 적고, 모듈 간 연결에서 발생하는 에러를 검증할 수 있다.
- 실제 앱의 **비즈니스 로직 흐름과 가깝게 기능을 검증**할 수 있다.

### 통합 테스트 항목

- 특정 **상태를 기준으로 동작하는 컴포넌트 조합**
- **API와 상호 작용하는 컴포넌트 조합**
- 단순 UI 렌더링부터 로직 실행까지 **한 번에 효율적으로 검증**할 수 있다.
- 예를 들어, `ProductCard` 컴포넌트는 상품 이미지, 이름, 가격 등 단일 데이터 렌더링을 담당하지만, `ProductList`는 API 연동, 이벤트 처리, 상태 관리 등 **실제 사용자와의 상호작용 로직**을 포함한다.

### ProductCard (단위 테스트) vs. ProductList (통합 테스트)

| **구분**    | **ProductCard (단위 테스트)**                                           | **ProductList (통합 테스트)**                                                                            |
| ----------- | ----------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| 렌더링 검증 | prop 기준으로 가격과 상품명이 제대로 렌더링 되는지                      | 상품 리스트 조회 API에 맞게 가격과 상품명이 제대로 렌더링되는지                                          |
| 클릭 이벤트 | 상품을 클릭했을 때 navigate 모킹을 통해 상세화면으로 이동하는지         | 상품을 클릭했을 때 navigate 모킹을 통해 상세화면으로 이동하는지                                          |
| 버튼 이벤트 | 장바구니와 구매 버튼을 눌렀을 때 spy 함수를 통해 각 핸들러가 호출되는지 | 장바구니와 구매 버튼을 눌렀을 때 (로그인: 상품 추가 후 장바구니로 이동 / 비로그인: 로그인 페이지로 이동) |
| 추가 기능   |                                                                         | 상품 리스트가 더 있는 경우 ‘show more’ 버튼이 노출되며 이를 통해 데이터를 더 가져올 수 있는지            |

- 비슷한 검증 부분에 대해 ProductCard 단위 테스트와 ProductList 통합 테스트 모두 작성할 수 있다.
- 단위 테스트로 세밀히 검증할 수 있지만, **통합 테스트에서는 한 번에 실제 시나리오 전체를 검증할 수 있어 효율적**이다.

### 통합 테스트의 핵심

- **상태나 데이터를 관리하는 컴포넌트**를 기준으로 하위 컴포넌트가 제대로 렌더링되는지 검증한다.
- 효율적인 통합 테스트를 위해서는 **컴포넌트 간 책임과 데이터 흐름이 명확히 설계되어야 한다**.
- 데이터 관리 로직이 산재되어 있으면 통합 테스트 작성이 어렵다.
- → 즉, **좋은 설계가 곧 좋은 통합 테스트의 기반**이 된다.

### 정리

**통합 테스트의 장점**

- 여러 모듈이 상호 작용하는 상황을 테스트하므로 단위 테스트에 비해 모킹의 비중이 적으며, 모듈 간에 발생하는 에러를 검증할 수 있다.
- 실제 앱이 동작하는 **비즈니스 로직에 가깝게 기능을 검증**할 수 있다.
- 하위 모듈의 단위 테스트에서 검증하던 부분까지 **한 번에 효율적으로 검증**할 수 있다.

**결국 중요한 건**

- 컴포넌트의 상태 및 데이터를 어디서 관리하고 변경할지 **구조적인 설계**가 잘 되어야 한다.
- 통합 테스트는 단순 검증을 넘어, **좋은 설계를 위한 도구이자 기준**이 된다.

---

## 4.2 통합 테스트 대상 선정하기

### 통합 테스트는 무엇을 검증할까

- **API, 상태 관리 스토어, 리액트 컨텍스트 등 다양한 요소들이 결합된 컴포넌트가 특정 비스니스 로직을 올바르게 수행하는지** 검증한다.
- 주로 **컴포넌트 간 상호작용, API 호출 및 상태 변경에 따른 UI 변경 사항**을 검증한다.
- **큰 책임을 가진 비즈니스 로직을 적절히 분리하여 컴포넌트 집합 단위로 테스트 코드를 작성**한다.

### 예제: 메인 페이지의 비즈니스 로직

- 네비게이션 영역의 로그인 여부에 따른 동작
- API를 통해 필터의 카테고리 데이터를 올바르게 렌더링 하는지 여부
- 필터 항목을 수정했을 때 올바르게 반영되는지 여부
- API 응답에 따라 상품 리스트가 적절하게 렌더링되는지 여부
- 장바구니 버튼과 구매 버튼을 눌렀을 때의 동작

→ 이런 다양한 기능을 검증하려면 **API, 상태 관리 스토어 등의 모킹**이 필요하다.

**모킹(Mocking)** 은 테스트를 독립적으로 분리하여 효과적으로 검증할 수 있게 도와주지만, 지나치게 많아지면 테스트의 **신뢰성이 떨어지고 유지 보수 비용이 증가**한다.

거대한 통합 테스트는 모킹 코드가 증가하게 되며, 일부 컴포넌트만 수정해도 많은 테스트가 깨질 수 있다. 따라서 **적절한 단위로 나눠 통합 테스트를 작성하는 것이 중요**하다.

### 비즈니스 로직이란

- 프로그램의 핵심 기능을 구현하는 코드
- 사용자가 원하는 결과를 얻기 위한 **계산, 처리, 의사 결정**을 수행한다.
- 서비스의 **정책, 절차, 규칙 등을 코드로 구현**하며, 데이터의 조회, 수정, 삭제 등을 담당한다.

**비즈니스 로직을 기준으로 통합 테스트를 작성하면**

- 서비스의 핵심 비즈니스 로직을 **독립적인 기능 관점**에서 효율적으로 검증할 수 있다.
- 테스트를 **명세 자체로 볼 수 있어** 앱을 이해하는데 큰 도움을 받을 수 있다.
- 불필요한 단일 테스트를 줄여 **유지 보수 효율성**이 높아진다.

### 예제: 비즈니스 로직 분리

쇼핑몰 메인 페이지의 경우, 어떻게 비즈니스 로직을 나눌 수 있을까?

1. **네비게이션 바 영역**: 사용자 로그인 여부에 따른 UI 렌더링 및 상호작용 (로그인 / 로그아웃)
2. **상품 검색 영역**: 필터 요소에 따른 검색 조건 설정
3. **상품 리스트 영역**: 검색 결과 렌더링 및 버튼 클릭(장바구니, 구매)에 따른 상호작용

만약 이 모든 기능을 하나의 비즈니스 로직 안에서 처리한다면?

- 필터 항목이 변경되거나 상품 리스트 구조가 바뀌는 것만으로도 테스트 코드 전체를 수정해야 한다.

즉, **거대한 단일 로직 구조는 유지보수가 어렵고 변경에 취약**하다.

따라서 메인 페이지의 비즈니스 로직을 **로그인 / 상품 검색 / 상품 리스트** 세 영역으로 나누어 점검하는 것이 좋다.

- 페이지 전체의 상호작용을 모두 검증하지는 못하더라도 핵심 기능 단위로 효율적인 테스트가 가능하다.
- 각 영역별로 필요한 부분만 모킹하므로 **테스트 코드의 복잡도도 감소**한다.

### 비즈니스 로직을 고려한 통합 테스트 범위 설정

- 가능한 **모킹을 최소화**하고 앱의 실제 기능과 유사하게 검증한다.
- 비즈니스 로직을 처리하는 **상태 관리나 API 로직은 상위 컴포넌트로 응집**해 관리한다.
  - 예: 로그인/로그아웃 버튼 각각에서 사용자의 상태를 조회하지 말고, 상위 컴포넌트에서 상태를 통합 관리하도록 설계한다.
  - **테스트 범위를 명확히 나누고 관리하기 쉬워진다.**
- 여러 도메인 기능이 조합된 비즈니스 로직은 변경 가능성을 고려해 **분리된 통합 테스트 단위로 작성**한다.
  - 예: 메인 홈페이지 → 사용자 로그인 + 상품 검색 + 상품 리스트

### 예제: 장바구니 페이지의 통합 테스트 범위 나누기

장바구니 페이지의 핵심 기능은 상품의 **수량 수정 및 삭제**와 **총합 계산**이다.

**장바구니 페이지의 비즈니스 로직을 크게 보면**

1. **상품 리스트 영역**: 상품 리스트 렌더링 및 수량 수정, 삭제 버튼 클릭에 따른 상호 작용
2. **가격 계산 영역**: 모든 상품의 수량과 가격을 계산

현재는 간단하지만, 쿠폰 적용이나 옵션 변경 등 기능이 추가될 경우, **하나의 통합 테스트로 관리하기 어려워지므로 영역별로 분리**하는 것이 좋다.

### 정리

- 통합 테스트는 구성된 **비즈니스 로직을 적절한 단위로 나눠 컴포넌트 집합을 검증**해야 한다.
- 테스트 작성 시 다음 원칙을 따른다:
  - **모킹은 최소화**하고, **실제 동작과 유사하게 검증**한다.
  - **상위 컴포넌트에서 상태를 응집 관리**해 테스트 범위를 명확히 한다.
  - **변경 가능성을 고려해 도메인 기능별로 분리**한다.
- 예시:
  - 메인 페이지 → 네비게이션 바 / 상품 검색 / 상품 리스트
  - 장바구니 페이지 → 상품 리스트 / 가격 계산
- 이를 통해 **컴포넌트 간 결합도를 낮추고, 구조적으로 견고한 코드와 테스트 설계**가 가능하다.

---

## 4.3 상태 관리 모킹하기

통합 테스트는 실제 사용자 흐름처럼 **비즈니스 로직을 기준으로 상태 변화**를 검증해야 한다.

- 주로 API를 통해 가져온 데이터나 앱에서 사용하는 상태를 기준으로 비즈니스 로직을 검증한다.
- 예제에서는 로그인 사용자의 정보, 장바구니 상태 등을 관리하기 위해 **zustand**를 사용한다.

### 예제: 장바구니 상태 관리

- 장바구니 상품 정보는 로그인한 사용자와 매핑되며, 앱 전역에서 공유되는 데이터다.
- → zustand store를 만들어 상태(state)와 액션(action)을 함께 관리한다.

```jsx
export const useCartStore = create(set => ({
  cart: {}, // 장바구니 상품 목록
  totalCount: 0, // 총 상품 개수
  totalPrice: 0, // 총 가격

  // 유저 ID 기준으로 기존 장바구니 불러오기
  initCart: userId =>
    set(state => {
      if (!userId) {
        return state;
      }

      const prevCartItem = getCartFromLocalStorage(userId);
      const total = calculateTotal(prevCartItem);

      return {
        ...total,
        cart: prevCartItem,
      };
    }),

  // 장바구니 상태 초기화
  resetCart: userId =>
    set(() => {
      resetCartAtLocalStorage(userId);

      return {
        totalCount: 0,
        totalPrice: 0,
        cart: {},
      };
    }),

  // 상품 추가
  addCartItem: (item, userId, count) =>
    set(state => {
      const cart = {
        ...state.cart,
        [item.id]: {
          ...item,
          count: (state.cart[item.id]?.count ?? 0) + count,
        },
      };
      const total = calculateTotal(cart);

      setCartToLocalStorage(cart, userId);

      return { ...total, cart };
    }),

  // 상품 삭제
  removeCartItem: (itemId, userId) =>
    set(state => {
      const cart = { ...state.cart };
      delete cart[itemId];
      const total = calculateTotal(cart);

      setCartToLocalStorage(cart, userId);

      return { ...total, cart };
    }),

  // 상품 수량 변경
  changeCartItemCount: ({ itemId, count, userId }) =>
    set(state => {
      const cart = {
        ...state.cart,
        [itemId]: {
          ...state.cart[itemId],
          count,
        },
      };
      const total = calculateTotal(cart);

      setCartToLocalStorage(cart, userId);

      return { ...total, cart };
    }),
}));
```

**사용 예시:**

```jsx
const PriceSummary = () => {
	// 필요한 state만 골라 사용
  const { totalCount, totalPrice } = useCartStore(state =>
    pick(state, 'totalPrice', 'totalCount'),
  );

  ...
}
```

장바구니가 상태에 따라 다음 컴포넌트가 렌더링된다:

- **비어 있으면** → `EmptyNotice.jsx` (단위 테스트)
- **상품이 있으면** → `CartTable.jsx` (통합 테스트)

`CartTable` 안에는 다음과 같은 구조가 있다:

```jsx
const CartTable = () => {
  return (
    <>
      <PageTitle />
      <ProductInfoTable /> {/* 상품 정보 */}
      <Divider sx={{ padding: 2 }} />
      <PriceSummary /> {/* 합계 정보 */}
    </>
  );
};
```

- `ProductInfoTable`와 `PriceSummary`는 각각 zustand store를 참조하므로 이 두 컴포넌트를 중심으로 **통합 테스트**를 작성한다.
- 너무 큰 범위를 통합 테스트로 잡으면 모킹해야 하는 데이터가 많아지고 변경 시 깨지기 쉬워진다.

### zustand 테스트 준비하기

zustand store를 테스트하려면, 테스트 실행 전에 **원하는 상태를 직접 주입할 수 있어야 한다**.

- 예: 장바구니에 특정 상품이 담긴 상태로 시작하기, 로그인한 유저 정보 설정하기

이를 위해 **zustand를 모킹(mocking)** 해야 한다.

→ 대부분의 상태 관리 라이브러리(Redux, Recoil 등)는 테스트용 모킹 가이드를 제공한다.

- 참고: https://zustand.docs.pmnd.rs/guides/testing

### **mocks**/zustand.js : zustand 자동 모킹

- Vitest나 Jest는 `__mocks__` 폴더 내 모듈을 **자동 모킹**한다.
- `vi.mock('zustand')`를 호출하면 `__mocks__/zustand.js` 파일을 사용한다.

```jsx
const { create: actualCreate } = await vi.importActual('zustand');
import { act } from '@testing-library/react';

// 앱에 선언된 모든 스토어에 대해 재설정 함수를 저장
// (앱 내의 모든 스토어를 초기화할 수 있도록 저장)
const storeResetFns = new Set();

// 스토어를 생성할 때 초기 상태를 가져와 리셋 함수를 생성하고 set에 추가한다.
// (store 생성 시 초기 상태를 기록하고 reset 함수 등록)
export const create = createState => {
  const store = actualCreate(createState);
  const initialState = store.getState();
  storeResetFns.add(() => store.setState(initialState, true)); // reset 함수 등록
  return store;
};

// 테스트가 구동되기 전 모든 스토어를 리셋한다.
// (테스트 실행 전 모든 store 초기화)
beforeEach(() => {
  act(() => storeResetFns.forEach(resetFn => resetFn()));
});
```

1. `vi.importActual`로 실제 zustand를 불러온다.
2. store가 생성될 때 **초기 상태(initialState)**를 저장한다.
3. `beforeEach` 훅에서 store를 초기화해 **테스트 간 독립성**을 유지한다.

### mockZustandStore.jsx : 테스트 전 상태 설정 유틸

테스트를 실행하기 전에 원하는 상태를 직접 store에 반영하려면 `mockZustandStore.jsx`를 사용한다.

- 테스트 시 store 상태를 원하는 형태로 세팅할 수 있다.
- 테스트 종료 시에는 `zustand.js`의 reset 로직이 실행되어 자동 초기화된다.

```jsx
import { useCartStore } from '@/store/cart';
import { useFilterStore } from '@/store/filter';
import { useUserStore } from '@/store/user';

// 적용하고자 하는 state를 인자로 받아 기존의 initialState와 병합
// (공통 로직: 기존 state와 병합)
const mockStore = (hook, state) => {
  const initStore = hook.getState();
  hook.setState({ ...initStore, ...state }, true);
};

// mockStore 함수를 사용하면 user, cart, filter와 같은 zustand store의 초기 상태와
// 특정 state를 병합하여 원하는 데이터로 store state를 변경할 수 있다.
// 유틸 함수를 사용하여 테스트 실행 전 원하는 형태로 store 데이터를 맞춰 테스트를 실행할 수 있다.

// 각 store별 헬퍼 함수 제공
export const mockUseUserStore = state => {
  mockStore(useUserStore, state);
};

export const mockUseCartStore = state => {
  mockStore(useCartStore, state);
};

export const mockUseFilterStore = state => {
  mockStore(useFilterStore, state);
};
```

**사용 예시:**

```jsx
mockUseCartStore({
  cart: {
    6: {
      id: 6,
      title: 'Handmade Cotton Fish',
      price: 100,
      description: 'The slim & simple Maple Gaming Keyboard from Dev Byte comes with a sleek body and 7- Color RGB LED Back-lighting for smart functionality',
      images: [ 'https://user-images.githubusercontent.com/35371660/230712070-afa23da8-1bda-4cc4-9a59-50a263ee629f.png', ],
      count: 3,
    },
    7: { ... }
  },
  totalCount: 7,
  totalPrice: 500,
});
```

### 정리

**상태 관리와 통함 테스트**

- 예제에서는 zustand를 사용하여 앱의 상태를 관리한다.
- → 원하는 상태로 통합 테스트를 하기 위해 **앱의 전역 상태(zustand 등)를 모킹**해야 한다.
  - 예: 장바구니에 상품이 담긴 상태

**앱의 전역 상태를 모킹해 테스트 전/후에 값을 변경하고 초기화해야 한다.**

- 테스트 간 독립성을 유지해 신뢰할 수 있는 테스트 환경을 구축한다.
  - `mockZustandStore.jsx`의 유틸 함수를 통해 zustand 스토어의 상태를 변경한다.
  - `__mocks__/zustand.js`를 통해 자동 모킹을 적용하여 스토어를 초기화한다.
- Redux나 Recoil과 같은 상태 관리 라이브러리도 모킹 가이드를 제공한다.

---

## 4.4 통합 테스트 작성하기 - 상태 관리 모킹

### ProductInfoTable 컴포넌트의 주요 기능

- 장바구니에 담긴 상품별로 **이름, 수량, 가격 합계**가 정확히 렌더링되어야 한다.
- 특정 상품의 **수량을 변경**하면 가격이 재계산되어야 한다.
- **1,000개 이상 입력 시 alert** 경고가 노출되어야 한다.
- **삭제 버튼 클릭 시 상품이 사라져야 한다.**

테스트 계획:

```jsx
it('장바구니에 포함된 아이템들의 이름, 수량, 합계가 제대로 노출된다', async () => {});
it('특정 아이템의 수량이 변경되었을 때 값이 재계산되어 올바르게 업데이트 된다', async () => {});
it('특정 아이템의 수량이 1000개로 변경될 경우 "최대 999개 까지 가능합니다!"라고 경고 문구가 노출된다', async () => {});
it('특정 아이템의 삭제 버튼을 클릭할 경우 해당 아이템이 사라진다', async () => {});
```

### 컴포넌트의 내부 구조

**ProductInfoTable**

- zustand의 `cart` 상태와 액션을 구독한다.
- 각 상품 정보를 `ProductInfoTableRow`에 전달한다.

```jsx
const ProductInfoTable = () => {
  const { cart, removeCartItem, changeCartItemCount } = useCartStore(state =>
    pick(state, 'cart', 'removeCartItem', 'changeCartItemCount'),
  );
  const { user } = useUserStore(state => pick(state, 'user'));

  return (
    <TableContainer component={Paper} sx={{ wordBreak: 'break-word' }}>
      <Table aria-label="장바구니 리스트">
        <TableBody>
          {Object.values(cart).map(item => (
            <ProductInfoTableRow
              key={item.id}
              item={item}
              user={user}
              removeCartItem={removeCartItem}
              changeCartItemCount={changeCartItemCount}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
```

**ProductInfoTableRow**

- 상품명, 수량, 합계, 삭제 버튼 등 UI를 렌더링한다.
- 수량 변경 및 삭제 이벤트를 처리한다.

```jsx
const ProductInfoTableRow = ({
  item,
  user,
  removeCartItem,
  changeCartItemCount,
}) => {
  const { id, title, count, images, price } = item;

  const handleClickDeleteItem = itemId => () => {
    removeCartItem(itemId, user.id);
  };

  const handleChangeCount = itemId => ev => {
    const newCount = Number(ev.target.value);

    if (newCount > MAX_CART_VALUE) {
      alert(cartValidationMessages.MAX_INPUT_VALUE);
      return;
    }

    changeCartItemCount({ itemId, userId: user.id, count: newCount });
  };

  return (
    <TableRow>
      <TableCell sx={{ textAlign: 'center' }}>
        <img src={images[0]} height="80px" />
      </TableCell>
      <TableCell>{title}</TableCell>
      <TableCell>
        <TextField
          variant="standard"
          onChange={handleChangeCount(id)}
          defaultValue={count}
          size="small"
          sx={{ width: '10ch' }}
          InputProps={{
            endAdornment: <InputAdornment position="end">개</InputAdornment>,
          }}
        />
      </TableCell>
      <TableCell>{formatPrice(price * count)}</TableCell>
      <TableCell>
        <IconButton
          aria-label="delete button"
          size="small"
          onClick={handleClickDeleteItem(id)}
        >
          <DeleteIcon fontSize="inherit" />
        </IconButton>
      </TableCell>
    </TableRow>
  );
};
```

### 테스트 범위 선정 이유

- `ProductInfoTableRow` 단위로 테스트하면 액션 호출만 검증할 수 있다.
  - → UI 반영(가격 재계산, 삭제 등)은 확인할 수 없다.
- 반면 `ProductInfoTable`을 테스트하면 `removeCartItem`, `changeCartItemCount` 등 s**tore 액션과 UI 반응을 함께 검증**할 수 있다.
  - → 실제 앱과 유사한 **통합 테스트** 작성이 가능하다.
- 또한 state, API 제어 로직을 한 컴포넌트(`ProductInfoTable`)에 응집하면 로직 파악이 용이하고 유지보수성도 높아진다.

### 테스트코드 작성하기

- 테스트 실행 전, 모킹한 zustand store를 통해 초기 데이터 설정을 해야 한다.
- `beforeEach` 훅으로 통합 테스트 공통 설정을 추가한다.

```jsx
beforeEach(() => {
  mockUseUserStore({ user: { id: 10 } });
  mockUseCartStore({
    cart: {
      6: {
        id: 6,
        title: 'Handmade Cotton Fish',
        price: 809,
        description:
          'The slim & simple Maple Gaming Keyboard from Dev Byte comes with a sleek body and 7- Color RGB LED Back-lighting for smart functionality',
        images: [
          'https://user-images.githubusercontent.com/35371660/230712070-afa23da8-1bda-4cc4-9a59-50a263ee629f.png',
          'https://user-images.githubusercontent.com/35371660/230711992-01a1a621-cb3d-44a7-b499-20e8d0e1a4bc.png',
          'https://user-images.githubusercontent.com/35371660/230712056-2c468ef4-45c9-4bad-b379-a9a19d9b79a9.png',
        ],
        count: 3,
      },
      7: {
        id: 7,
        title: 'Awesome Concrete Shirt',
        price: 442,
        description:
          'The Nagasaki Lander is the trademarked name of several series of Nagasaki sport bikes, that started with the 1984 ABC800J',
        images: [
          'https://user-images.githubusercontent.com/35371660/230762100-b119d836-3c5b-4980-9846-b7d32ea4a08f.png',
          'https://user-images.githubusercontent.com/35371660/230762118-46d965ab-7ea8-4e8a-9c0f-3ed90f96e1cd.png',
          'https://user-images.githubusercontent.com/35371660/230762139-002578da-092d-4f34-8cae-2cf3b0dfabe9.png',
        ],
        count: 4,
      },
    },
  });
});
```

### 테스트 1: 장바구니 데이터 렌더링

- `within()` 함수를 이용해 각 row 내부 요소를 선택한다.

```jsx
it('장바구니에 포함된 아이템들의 이름, 수량, 합계가 제대로 노출된다', async () => {
  await render(<ProductInfoTable />);
  const [firstItem, secondItem] = screen.getAllByRole('row');

  expect(
    within(firstItem).getByText('Handmade Cotton Fish'),
  ).toBeInTheDocument();
  expect(within(firstItem).getByRole('textbox')).toHaveValue('3');
  expect(within(firstItem).getByText('$2,427.00')).toBeInTheDocument();

  expect(
    within(secondItem).getByText('Awesome Concrete Shirt'),
  ).toBeInTheDocument();
  expect(within(secondItem).getByRole('textbox')).toHaveValue('4');
  expect(within(secondItem).getByText('$1,768.00')).toBeInTheDocument();
});
```

### 테스트 2: 수량 변경 시 가격 재계산

- 사용자 입력 이벤트를 시뮬레이션하여 가격이 즉시 반영되는지 검증한다.

```jsx
it('특정 아이템의 수량이 변경되었을 때 값이 재계산되어 올바르게 업데이트 된다', async () => {
  const { user } = await render(<ProductInfoTable />);
  const [firstItem] = screen.getAllByRole('row');
  const input = within(firstItem).getByRole('textbox');

  await user.clear(input);
  await user.type(input, '5');

  expect(screen.getByText('$4,045.00')).toBeInTheDocument(); // 809 * 5
});
```

### 테스트 3: 최대 수량 제한 alert 확인

- `window.alert`를 spy 함수로 대체하여 호출 여부를 검증한다.

```jsx
it('특정 아이템의 수량이 1000개로 변경될 경우 "최대 999개 까지 가능합니다!"라고 경고 문구가 노출된다', async () => {
  const alertSpy = vi.fn();
  // window.alert → alertSpy로 대체
  vi.stubGlobal('alert', alertSpy);

  const { user } = await render(<ProductInfoTable />);
  const [firstItem] = screen.getAllByRole('row');
  const input = within(firstItem).getByRole('textbox');

  await user.clear(input);
  await user.type(input, '1000');

  expect(alert).toHaveBeenNthCalledWith(1, '최대 999개 까지 가능합니다!');
});
```

### 테스트 4: 상품 삭제 기능 검증

- 삭제 버튼 클릭 후, 해당 상품이 DOM에서 제거되는지 확인한다.
- 요소 존재 여부를 확인할 때는 `queryBy`를 사용한다.

```jsx
it('특정 아이템의 삭제 버튼을 클릭할 경우 해당 아이템이 사라진다', async () => {
  const { user } = await render(<ProductInfoTable />);
  const [, secondItem] = screen.getAllByRole('row');
  const deleteButton = within(secondItem).getByRole('button');

  expect(screen.getByText('Awesome Concrete Shirt')).toBeInTheDocument();

  await user.click(deleteButton);

  expect(screen.queryByText('Awesome Concrete Shirt')).not.toBeInTheDocument();
});
```

### 정리

**ProductInfoTable 통합 테스트**

- `cart`, `user` 스토어와 `ProductInfoTableRow`(MUI)가 결합된 컴포넌트
- `ProductInfoTable`과 같은 컴포넌트에 **state와 API에 대한 제어 코드를 응집해 관리**하는 것이 좋다.
  - **로직 파악 및 유지 보수**에 좋으며, 통합 테스트의 단위를 깔끔하게 나눌 수 있다.
- 통합 테스트는 단위 테스트보다 범위가 넓지만 **실제 사용자 시나리오에 근접한 비즈니스 로직 검증이 가능**하다.
- zustand 모킹으로 상태를 제어하고, 사용자 이벤트를 시뮬레이션하여 UI, 상태, 액션이 유기적으로 동작하는지를 테스트할 수 있다.

---

## 4.5 msw로 API 모킹하기

앱에서 **API 결과 데이터를 기반으로 전역 상태나 비즈니스 로직 실행**이 자주 일어난다.

예를 들어,

- **NavigationBar**: 로그인한 사용자의 정보를 전역 상태로 저장한다.
  ```jsx
  const { data, remove } = useProfile({
    config: {
      onSuccess: profile => {
        setUserData(profile);
        initCart(profile.id);
      },
      enabled: !!isLogin,
    },
  });
  ```
- **메인 홈**: 상품 리스트를 API로 가져와 렌더링한다.
  ```jsx
  const { data, ...productsMethods } = useProducts({
    limit,
    params: filter,
  });
  ```

이런 API 호출이 **UI 렌더링과 비즈니스 로직에 직접 연결**되기 때문에 테스트에서도 ‘API가 정상 응답할 때, 컴포넌트가 올바르게 렌더링되는가’를 검증해야 한다.

### 통합 테스트 필요성

단위 테스트로는 개별 함수만 검증할 수 있지만, **API 호출 + 상태 변경 + UI 반응**은 여러 모듈이 함께 작동해야 확인 가능하다.

즉, 실제 API 서버 대신 **모킹(Mock)**을 통해 API 요청-응답을 시뮬레이션하는 **통합 테스트 환경**이 필요하다.

### 예시: ProductList 컴포넌트

메인 페이지의 상품 리스트는 다음과 같이 작동한다.

1. Zustand에서 `filter`, `user`, `addCartItem` 등의 전역 상태를 가져온다.
2. `useProducts()` 훅으로 상품 데이터를 불러온다. (내부에서 TanStack Query를 사용한다.)
3. TanStack Query는 `Product.getAPI()`를 호출해 상품 리스트를 가져온다.

```jsx
const { data, ...productsMethods } = useProducts({
  limit,
  params: filter,
});

// 내부적으로 useInfiniteQuery 사용
const context = useInfiniteQuery(
  [url, params],
  ({ queryKey, pageParam = 0 }) =>
    defaultFetcher({
      queryKey,
      pageParam: { offset: pageParam * others.limit, limit: others.limit },
    }),
  {
    getNextPageParam: (lastPage, pages) => {
      return lastPage.lastPage ? false : pages.length;
    },
  },
);
```

→ 이 흐름을 테스트하려면 실제 API 대신 **모킹된 응답**을 주입해야 한다.

### TanStack Query 테스트 환경 설정

TanStack Query는 기본적으로 API 호출 실패 시 3번 재시도하고, 에러 로그를 콘솔에 출력한다.

→ 테스트에서는 이런 동작이 **불필요하게 시간을 끌거나 콘솔을 어지럽히기 때문에** 다음과 같이 설정을 수정한다.

- https://tanstack.com/query/v4/docs/framework/react/guides/testing

```jsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { Toaster } from 'react-hot-toast';
import { MemoryRouter } from 'react-router-dom';

export default async (component, options = {}) => {
  const { routerProps } = options;
  const user = userEvent.setup();

  // 테스트 전용 QueryClient 설정
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        // ✅ turns retries off // 테스트 실패 시 재시도하지 않음
        retry: false,
      },
    },
    logger: {
      log: console.log,
      warn: console.warn,
      // ✅ no more errors on the console for tests // 테스트 중 콘솔에 에러 출력 막기
      error: process.env.NODE_ENV === 'test' ? () => {} : console.error,
    },
  });

  return {
    user,
    ...render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter {...routerProps}>{component}</MemoryRouter>
        <Toaster />
      </QueryClientProvider>,
    ),
  };
};
```

### MSW(Mock Service Worker)

**실제 API 요청을 가로채서 미리 정의한 응답을 반환해주는 라이브러리**

- 브라우저: Service Worker를 사용해 네트워크 요청을 인터셉트한다.
- Node.js(테스트 환경): XHR / fetch 모듈을 오버라이드하여 가로챈다.
- 서버를 직접 띄울 필요 없이, API 규격만으로 응답을 흉내낼 수 있다.
  - 프론트엔드 개발자는 서버 API가 개발되기 전에 가짜 응답으로 개발과 테스트를 할 수 있다.

### Handlers.js - 요청별 응답 정의

MSW는 요청에 따라 어떤 응답을 줄지 **Request Handler**로 정의한다.

- MSW의 REST 모듈을 활용하여 모킹하고 싶은 경로와 REST API 규격에 맞는 메서드를 정의한 뒤 응답을 설정한다.

```jsx
import { rest } from 'msw';
import response from '@/__mocks__/response';
import { apiRoutes } from '@/apiRoutes';

const API_DOMAIN = 'http://localhost:3000';

// 모든 모팅된 요청 정의
export const handlers = [
  ...[
    // 공통 GET API 모킹
    // 4가지 API를 대상으로 GET API에 대한 모킹
    apiRoutes.users,
    apiRoutes.product,
    apiRoutes.categories,
    apiRoutes.couponList,
  ].map(path =>
    // request 쿼리 파라미터에 따라 응답을 변경
    // http status를 변경하는 것과 같은 다양한 처리 가능
    rest.get(`${API_DOMAIN}${path}`, (_, res, ctx) =>
      // 일괄적으로 200 응답 코드와 미리 만들어둔 응답 데이터가 설정되도록 만듦
      res(ctx.status(200), ctx.json(response[path])),
    ),
  ),

  // 상품 리스트 (pagination 반영)
  rest.get(`${API_DOMAIN}${apiRoutes.products}`, (req, res, ctx) => {
    const data = response[apiRoutes.products];
    const offset = Number(req.url.searchParams.get('offset'));
    const limit = Number(req.url.searchParams.get('limit'));

    const products = data.products.filter(
      (_, index) => index >= offset && index < offset + limit,
    );

    return res(
      ctx.status(200),
      ctx.json({ products, lastPage: data.products.length <= offset + limit }),
    );
  }),

  rest.get(`${API_DOMAIN}${apiRoutes.profile}`, (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(null));
  }),

  // 로그인, 회원가입 등의 상황별 응답 제어
  rest.post(`${API_DOMAIN}${apiRoutes.users}`, (req, res, ctx) => {
    if (req.body.name === 'FAIL') return res(ctx.status(500));
    return res(ctx.status(200));
  }),

  rest.post(`${API_DOMAIN}${apiRoutes.login}`, (req, res, ctx) => {
    if (req.body.email === 'FAIL@gmail.com') return res(ctx.status(401));
    return res(ctx.status(200), ctx.json({ access_token: 'access_token' }));
  }),

  rest.post(`${API_DOMAIN}${apiRoutes.log}`, (_, res, ctx) => {
    return res(ctx.status(200));
  }),
];
```

→ 이 handlers는 테스트 실행 중 실제 서버 대신 **가짜 서버 역할**을 한다.

### setupTest.js - 테스트 환경에 MSW 적용

테스트 실행 시, 핸들러를 활성화하고 종료 시 해제한다.

```jsx
import { setupServer } from 'msw/node';
import { handlers } from '@/__mocks__/handlers';

/* MSW 서버 생성 */
export const server = setupServer(...handlers);

// 테스트 전/후 서버 설정
beforeAll(() => {
  server.listen(); // 서버 구동
});

afterEach(() => {
  // 런타임에 변경한 MSW의 모킹을 초기화하는 역할
  server.resetHandlers(); // 변경된 모킹 초기화
  vi.clearAllMocks(); // jest/vi mock 초기화
});

afterAll(() => {
  vi.resetAllMocks();
  server.close(); // 서버 종료
});
```

이제 테스트 코드에서 API를 호출하더라도 **MSW가 요청을 가로채고 핸들러에서 정의한 응답을 반환**한다.

즉, 실제 서버가 없어도 일관된 환경에서 테스트가 가능하다.

### 정리

- **TanStack Query**: API 호출, 로딩/에러 상태, 캐싱, 페이지네이션 등을 관리하는 서버 상태 관리 라이브러리
- **테스트 설정**: 기본 retry, console.error 등이 테스트 시간을 늘리거나 콜솔을 어지럽히지 않도록 테스트 설정 진행
- **MSW(Mock Service Worker)**: 실제 API 요청을 가로채고, 미리 정의한 응답을 반환하는 라이브러리
- **Node.js 환경에서의 동작**: XHR / fetch를 오버라이드하여 요청을 인터셉트
- **setup / teardown**: 테스트 실행 전 서버 시작 / 실행 후 서버 종료

즉, **TanStack Query로 서버 상태를 관리하고, MSW로 서버 응답을 흉내 내면** 실제 서버가 없어도 API 기반 컴포넌틑의 통합 테스트를 안정적으로 수행할 수 있다.

---

## 4.6 RTL 비동기 유틸 함수를 통한 노출 테스트 작성

### ProductList 전반적인 기능

- 상품 목록을 가져와 보여주는 컴포넌트
- 기본적으로 useProducts 훅을 통해 데이터를 요청하며, 내부적으로 TanStack Query의 useInfiniteQuery를 사용한다.

**주요 기능 요약**

- 상단 카테고리 선택(필터)
- 상품 목록 20개씩 노출 → `Show more` 버튼으로 추가 요청
- 필터 정보: Zustand store에서 관리
- 데이터 요청: `useProducts` → 내부적으로 `useInfinieQuery` 사용
  - `fetchNextPage`, `isFetchingNextPage`, `hasNextPage` 사용
  - 다음 페이지 존재 여부 및 버튼 활성화 제어

**로그인 관련 동작**

- 로그인 여부: `useUserStore`로 확인
- 버튼 클릭 시 동작
  - 로그인 O
    - 장바구니: `addCartITem` 호출 + toast
    - 구매: `addCartItem` 호출 + `/cart`로 이동
  - 로그인 X
    - 로그인 페이지(`/login`)으로 이동

### ProductList 컴포넌트 코드

```jsx
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { Grid, Button } from '@mui/material';
import React from 'react';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

import { pageRoutes } from '@/apiRoutes';
import { TOAST_ID } from '@/constants';
import ProductCard from '@/pages/home/components/ProductCard';
import useProducts from '@/pages/home/hooks/useProducts';
import { useCartStore } from '@/store/cart';
import { useFilterStore } from '@/store/filter';
import { useUserStore } from '@/store/user';
import { pick } from '@/utils/common';

const PRODUCT_PAGE_LIMIT = 20;

const ProductList = ({ limit = PRODUCT_PAGE_LIMIT }) => {
  const navigate = useNavigate();
  const filter = useFilterStore(state =>
    pick(state, 'categoryId', 'title', 'minPrice', 'maxPrice'),
  );
  const { user, isLogin } = useUserStore(state =>
    pick(state, 'user', 'isLogin'),
  );
  const { addCartItem } = useCartStore(state => pick(state, 'addCartItem'));

  const { data, ...productsMethods } = useProducts({
    limit,
    params: filter,
  });

  const products =
    data?.pages.reduce((acc, cur) => [...acc, ...cur.products], []) ?? [];
  const { fetchNextPage, isFetchingNextPage, hasNextPage } = productsMethods;

  // 장바구니 버튼
  const handleClickCart = (ev, product) => {
    ev.stopPropagation();
    if (isLogin) {
      addCartItem(product, user.id, 1);
      toast.success(`${product.title} 장바구니 추가 완료!`, { id: TOAST_ID });
    } else {
      navigate(pageRoutes.login);
    }
  };

  // 구매 버튼
  const handleClickPurchase = (ev, product) => {
    ev.stopPropagation();
    if (isLogin) {
      addCartItem(product, user.id, 1);
      navigate(pageRoutes.cart);
    } else {
      navigate(pageRoutes.login);
    }
  };

  return (
    <Grid container spacing={1} rowSpacing={1} justifyContent="center">
      {products.map((product, index) => (
        <ProductCard
          key={`${product.id}_${index}`}
          product={product}
          onClickAddCartButton={handleClickCart}
          onClickPurchaseButton={handleClickPurchase}
        />
      ))}
      {hasNextPage && (
        <Grid item>
          <Button
            variant="contained"
            endIcon={<KeyboardArrowDownIcon />}
            onClick={fetchNextPage}
            disabled={isFetchingNextPage}
          >
            Show more
          </Button>
        </Grid>
      )}
    </Grid>
  );
};

export default ProductList;
```

### MSW(Mock Service Worker) API 모킹

- MSW를 이용해 **상품 목록 API를 페이징 단위로 응답하도록** 모킹한다.
- 요청 시 `offset`, `limit` 쿼리 파라미터를 이용해 데이터를 자르고 반환한다.

```jsx
rest.get(`${API_DOMAIN}${apiRoutes.products}`, (req, res, ctx) => {
  const data = response[apiRoutes.products];
  const offset = Number(req.url.searchParams.get('offset'));
  const limit = Number(req.url.searchParams.get('limit'));

  // offset, limit 기반으로 페이지 단위 데이터 추출
  const products = data.products.filter(
    (_, index) => index >= offset && index < offset + limit,
  );

  return res(
    ctx.status(200),
    ctx.json({ products, lastPage: data.products.length <= offset + limit }),
  );
}),
```

**동작 흐름**

1. 테스트 중 ProductList에서 API 요청이 발생한다.
2. MSW가 요청을 가로채서 모킹 데이터(products.json)를 페이징 단위로 잘라 응답한다.
3. 항상 동일한 mock 데이터를 사용하므로 **안정적이고 일관된 테스트가 가능**하다.

### 테스트 1: 상품 목록 조회 테스트

- 비동기 데이터 렌더링이므로, **`findBy` 계열 쿼리**를 사용해야 한다.

**`findBy` 특징**

- 비동기적으로 동작하는 코드로 인한 요소를 쿼리할 때 사용된다.
- 내부적으로 `waitFor`를 사용한다.
- 쿼리가 통과하거나 시간 초과될 때까지 재시도한다. (기본 설정: 1초 동안 50ms 간격으로 재시도)
- Promise를 반환하기 때문에 해당 Query를 사용하려면 `await`나 `then`을 사용해야 한다.

```jsx
it('로딩이 완료된 경우 상품 리스트가 제대로 모두 노출된다', async () => {
  await render(<ProductList limit={PRODUCT_PAGE_LIMIT} />);

  // const productCards = screen.getAllByTestId('product-card');
  // findAllBy~: 비동기 쿼리 → 렌더 완료될 때까지 기다린다.
  // 1초 동안 50ms마다 요소가 있는지 조회한다.
  const productCards = await screen.findAllByTestId('product-card');

  expect(productCards).toHaveLength(PRODUCT_PAGE_LIMIT);

  productCards.forEach((el, idx) => {
    const productCard = within(el);
    const product = data.products[idx];

    expect(productCard.getByText(product.title)).toBeInTheDocument();
    expect(productCard.getByText(product.category.name)).toBeInTheDocument();
    expect(
      productCard.getByText(formatPrice(product.price)),
    ).toBeInTheDocument();
    expect(
      productCard.getByRole('button', { name: '장바구니' }),
    ).toBeInTheDocument();
    expect(
      productCard.getByRole('button', { name: '구매' }),
    ).toBeInTheDocument();
  });
});
```

### 테스트 2: show more 버튼 테스트

```jsx
it('보여줄 상품 리스트가 더 있는 경우 show more 버튼이 노출되며, 버튼을 누르면 상품 리스트를 더 가져온다.', async () => {
  const { user } = await render(<ProductList limit={PRODUCT_PAGE_LIMIT} />);

  // 첫 페이지 로딩 완료 대기
  // show more 버튼의 노출 여부를 정확하게 판단하기 위해
  // findBy 쿼리를 사용하여 먼저 첫 페이지에 해당하는 상품 목록이 렌더링되는 것을 기다려야 한다.
  await screen.findAllByTestId('product-card');

  // 버튼 노출 확인
  expect(screen.getByRole('button', { name: 'Show more' })).toBeInTheDocument();

  // 버튼 클릭 시 다음 페이지 데이터 추가
  const moreBtn = screen.getByRole('button', { name: 'Show more' });
  await user.click(moreBtn);

  // 5개 x 2페이지 = 10개 노출 확인
  expect(await screen.findAllByTestId('product-card')).toHaveLength(
    PRODUCT_PAGE_LIMIT * 2,
  );
});
```

### 테스트 3: 상품이 모두 로드된 경우 버튼이 노출되지 않는다.

```jsx
it('보여줄 상품 리스트가 없는 경우 show more 버튼이 노출되지 않는다.', async () => {
  // 모킹 데이터 20개보다 많은 수 50으로 limit을 설정
  await render(<ProductList limit={50} />);

  // findBy 쿼리를 사용하여 먼저 첫 페이지에 해당하는 상품 목록이 렌더링되는 것을 기다려야 한다.
  await screen.findAllByTestId('product-card');

  expect(screen.queryByText('Show more')).not.toBeInTheDocument();
});
```

### 로그인 상태 테스트

- `mockUseUserStore`를 사용해 로그인 상태를 가짜로 만든다.

```
describe('로그인 상태일 경우', () => {
  beforeEach(() => {
    mockUseUserStore({ isLogin: true, user: { id: 10 } });
  });

  it('구매 버튼 클릭시 addCartItem 메서드가 호출되며, "/cart" 경로로 navigate 함수가 호출된다.', ...);
  it('장바구니 버튼 클릭시 "장바구니 추가 완료!" toast를 노출하며, addCartItem 메서드가 호출된다.', ...);
})
```

### 로그인 상태 테스트 1: 구매 버튼 클릭

```jsx
it('구매 버튼 클릭시 addCartItem 메서드가 호출되며, "/cart" 경로로 navigate 함수가 호출된다.', async () => {
  // 통합 테스트는 좀 더 큰 범위로 비즈니스 로직을 검증할 수 있지만,
  // 이처럼 다른 페이지의 로직을 검증할 수는 없기 때문에 역시 모킹 작업이 필요할 때가 있다.
  const addCartItemFn = vi.fn();
  mockUseCartStore({ addCartItem: addCartItemFn });

  const { user } = await render(<ProductList limit={PRODUCT_PAGE_LIMIT} />);

  await screen.findAllByTestId('product-card');

  // 첫번째 상품을 대상으로 검증한다.
  const productIndex = 0;
  await user.click(
    screen.getAllByRole('button', { name: '구매' })[productIndex],
  );

  expect(addCartItemFn).toHaveBeenNthCalledWith(
    1,
    data.products[productIndex],
    10,
    1,
  );
  expect(navigateFn).toHaveBeenNthCalledWith(1, '/cart');
});
```

### 로그인 상태 테스트 2: 장바구니 버튼 클릭

```jsx
it('장바구니 버튼 클릭시 "장바구니 추가 완료!" toast를 노출하며, addCartItem 메서드가 호출된다.', async () => {
  const addCartItemFn = vi.fn();
  mockUseCartStore({ addCartItem: addCartItemFn });

  const { user } = await render(<ProductList limit={PRODUCT_PAGE_LIMIT} />);

  await screen.findAllByTestId('product-card');

  // 첫번째 상품을 대상으로 검증한다.
  const productIndex = 0;
  const product = data.products[productIndex];
  await user.click(
    screen.getAllByRole('button', { name: '장바구니' })[productIndex],
  );

  expect(addCartItemFn).toHaveBeenNthCalledWith(1, product, 10, 1);
  expect(
    screen.getByText(`${product.title} 장바구니 추가 완료!`),
  ).toBeInTheDocument();
});
```

### 비로그인 상태 테스트

- mock을 하지 않으면 기본적으로 비로그인 상태로 동작한다.
- 비로그인 상태로 구매 버튼과 장바구니 버튼 클릭 시, 모두 로그인 페이지로 이동하므로 navigate 동작만 확인하면 된다.

### 비로그인 상태 테스트 1: 구매 버튼 클릭

```jsx
it('구매 버튼 클릭시 "/login" 경로로 navigate 함수가 호출된다.', async () => {
  const { user } = await render(<ProductList limit={PRODUCT_PAGE_LIMIT} />);
  await screen.findAllByTestId('product-card');

  // 첫번째 상품을 대상으로 검증한다.
  const productIndex = 0;
  await user.click(
    screen.getAllByRole('button', { name: '구매' })[productIndex],
  );

  expect(navigateFn).toHaveBeenNthCalledWith(1, '/login');
});
```

### 비로그인 상태 테스트 2: 장바구니 버튼 클릭

```jsx
it('장바구니 버튼 클릭시 "/login" 경로로 navigate 함수가 호출된다.', async () => {
  const { user } = await render(<ProductList limit={PRODUCT_PAGE_LIMIT} />);
  await screen.findAllByTestId('product-card');

  // 첫번째 상품을 대상으로 검증한다.
  const productIndex = 0;
  await user.click(
    screen.getAllByRole('button', { name: '장바구니' })[productIndex],
  );

  expect(navigateFn).toHaveBeenNthCalledWith(1, '/login');
});
```

### 테스트: 상품 클릭 테스트

```jsx
it('상품 클릭시 "/product/:productId" 경로로 navigate 함수가 호출된다.', async () => {
  const { user } = await render(<ProductList limit={PRODUCT_PAGE_LIMIT} />);
  const [firstProduct] = await screen.findAllByTestId('product-card');

  // 첫번째 상품을 대상으로 검증한다.
  await user.click(firstProduct);

  expect(navigateFn).toHaveBeenNthCalledWith(1, '/product/6');
});
```

### 정리

- **MSW(Mock Service Worker)**: 네트워크 요청을 가로채 실제 서버 없이 mock 데이터 응답
- **findBy 쿼리**: 비동기 처리된 DOM 요소를 기다릴 때 사용 (내부적으로 `waitFor` 사용)
- **useInfiniteQuery**: 무한 스크롤 or “더보기” 형태 API 페이징 처리
- **Zustand mock**: store 상태를 테스트용으로 제어 (`mockUseUserStore`, `mockUseCartStore`)
- **통합 테스트 목적**: API 응답-렌더링-이벤트 핸들링까지 전체 UI 흐름을 검증
