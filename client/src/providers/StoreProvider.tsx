"use client";

import { useRef } from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { Persistor } from "redux-persist";
import { makeStore, AppStore } from "../store";
import { LoadingSpinner } from "@/components/common";

interface StoreRef {
  store: AppStore;
  persistor: Persistor;
}

export default function StoreProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const storeRef = useRef<StoreRef | null>(null);
  if (!storeRef.current) {
    // Create the store instance the first time this renders
    storeRef.current = makeStore();
  }

  return (
    <Provider store={storeRef.current.store}>
      <PersistGate
        loading={
          <div className="flex min-h-screen items-center justify-center">
            <LoadingSpinner size="lg" text="Loading..." />
          </div>
        }
        persistor={storeRef.current.persistor}
      >
        {children}
      </PersistGate>
    </Provider>
  );
}
