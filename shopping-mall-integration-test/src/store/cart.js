import { create } from 'zustand';

import { getItem, setItem } from '@/helpers/localStorage';
import { parseJSON } from '@/utils/common';

const CART_LOCAL_STORAGE_KEY = 'CART_LOCAL_STORAGE_KEY';

const getCartFromLocalStorage = userId => {
  const cartItem = parseJSON(getItem(CART_LOCAL_STORAGE_KEY));

  return cartItem?.[userId] ?? {};
};

export const resetCartAtLocalStorage = userId => {
  const cartItem = parseJSON(getItem(CART_LOCAL_STORAGE_KEY));

  setItem(CART_LOCAL_STORAGE_KEY, {
    ...cartItem,
    [userId]: undefined,
  });
};

export const setCartToLocalStorage = (cart, userId) => {
  const cartItem = parseJSON(getItem(CART_LOCAL_STORAGE_KEY));

  if (!cartItem) {
    setItem(CART_LOCAL_STORAGE_KEY, { [userId]: cart });

    return;
  }

  setItem(CART_LOCAL_STORAGE_KEY, { ...cartItem, [userId]: cart });
};

const calculateTotal = cart =>
  Object.values(cart).reduce(
    (acc, item) => ({
      totalCount: acc.totalCount + item.count,
      totalPrice: acc.totalPrice + item.price * item.count,
    }),
    { totalCount: 0, totalPrice: 0 },
  );

// 장바구니 상품 정보는 로그인한 사용자와 매핑된다.
// 앱 전반적으로 필요한 데이터이기 때문에 zustand를 사용한 상태 관리가 필요하다.
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
