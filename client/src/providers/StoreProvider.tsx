"use client";

import { useState } from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { makeStore } from "../store";
import { LoadingSpinner } from "@/components/common";

export default function StoreProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [storeInstance] = useState(() => makeStore());

  return (
    <Provider store={storeInstance.store}>
      <PersistGate
        loading={
          <div className="flex min-h-screen items-center justify-center">
            <LoadingSpinner size="lg" text="Loading..." />
          </div>
        }
        persistor={storeInstance.persistor}
      >
        {children}
      </PersistGate>
    </Provider>
  );
}
