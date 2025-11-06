import { setupServer } from 'msw/node';
import '@testing-library/jest-dom';

import { handlers } from '@/__mocks__/handlers';

/* msw */
// 초기에 구동을 위해 설정한 msw 서버 인스턴스와 동일한 인스턴스를 사용해야 기존에 모킹된 API의 응답을 변경할 수 있다.
export const server = setupServer(...handlers);

// msw 설정 적용
// -> 테스트 환경에서 API 호출은 msw의 핸들러에 설정한 응답으로 모킹
beforeAll(() => {
  // 서버 구동
  server.listen();
});

afterEach(() => {
  // 런타임에 변경한 MSW의 모킹을 초기화하는 역할
  server.resetHandlers();
  vi.clearAllMocks();
});

afterAll(() => {
  // 서버 종료
  vi.resetAllMocks();
  server.close();
});

vi.mock('zustand');

// https://github.com/vitest-dev/vitest/issues/821
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});
