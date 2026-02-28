import React, { ReactElement } from "react";
import {
  render as rtlRender,
  RenderOptions,
  renderHook as rtlRenderHook,
  RenderHookOptions,
} from "@testing-library/react";
import { Provider } from "react-redux";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { authReducer, uiReducer, mapReducer } from "@/store/slices";

const testRootReducer = combineReducers({
  auth: authReducer,
  ui: uiReducer,
  map: mapReducer,
});

export type TestRootState = ReturnType<typeof testRootReducer>;

// Create a fresh store for each test to avoid state leakage
const createTestStore = (preloadedState?: Partial<TestRootState>) => {
  return configureStore({
    reducer: testRootReducer,
    preloadedState: preloadedState as unknown as TestRootState,
  });
};

// Create a fresh QueryClient for each test
const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

interface AllTheProvidersProps {
  children: React.ReactNode;
  preloadedState?: Partial<TestRootState>;
  queryClient?: QueryClient;
}

const AllTheProviders = ({
  children,
  preloadedState,
  queryClient = createTestQueryClient(),
}: AllTheProvidersProps) => {
  const store = createTestStore(preloadedState);

  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </Provider>
  );
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper"> & {
    preloadedState?: Partial<TestRootState>;
  },
) => {
  const { preloadedState, ...renderOptions } = options || {};

  return rtlRender(ui, {
    wrapper: (props) => (
      <AllTheProviders {...props} preloadedState={preloadedState} />
    ),
    ...renderOptions,
  });
};

const customRenderHook = <Result, Props>(
  render: (props: Props) => Result,
  options?: Omit<RenderHookOptions<Props>, "wrapper"> & {
    preloadedState?: Partial<TestRootState>;
  },
) => {
  const { preloadedState, ...renderOptions } = options || {};
  return rtlRenderHook(render, {
    wrapper: (props) => (
      <AllTheProviders {...props} preloadedState={preloadedState} />
    ),
    ...renderOptions,
  });
};

// Re-export everything from RTL
export * from "@testing-library/react";

// Override render methods
export { customRender as render, customRenderHook as renderHook };

// Export helpers
export { createTestStore, createTestQueryClient };
