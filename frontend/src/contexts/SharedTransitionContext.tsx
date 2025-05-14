import React, { createContext, useContext, useState } from 'react';

interface TransitionState {
  isTransitioning: boolean;
  fromScreen: string | null;
  toScreen: string | null;
}

interface SharedTransitionContextType {
  transitionState: TransitionState;
  startTransition: (fromScreen: string, toScreen: string) => void;
  endTransition: () => void;
}

const initialState: TransitionState = {
  isTransitioning: false,
  fromScreen: null,
  toScreen: null,
};

const SharedTransitionContext = createContext<SharedTransitionContextType>({
  transitionState: initialState,
  startTransition: () => {},
  endTransition: () => {},
});

export const useSharedTransition = () => useContext(SharedTransitionContext);

export const SharedTransitionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [transitionState, setTransitionState] = useState<TransitionState>(initialState);

  const startTransition = (fromScreen: string, toScreen: string) => {
    setTransitionState({
      isTransitioning: true,
      fromScreen,
      toScreen,
    });
  };

  const endTransition = () => {
    setTransitionState(initialState);
  };

  return (
    <SharedTransitionContext.Provider
      value={{
        transitionState,
        startTransition,
        endTransition,
      }}
    >
      {children}
    </SharedTransitionContext.Provider>
  );
};

export default SharedTransitionContext;
