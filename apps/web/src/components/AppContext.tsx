import { NextRouter, useRouter } from 'next/router';
import { createContext, ReactNode, useCallback, useContext, useReducer } from 'react';
import { AllowedPath, sidebarNavItems } from 'src/common';
import { SidebarButtonProps } from './interface';

export interface AppContextStateProps {
  activePath: string;
  sidebarButtons: SidebarButtonProps[];
}

export interface AppContextType {
  state: AppContextStateProps;
  updateActivePath: (path: AllowedPath) => void;
  updateSidebarButtons: (data: SidebarButtonProps[]) => void;
}

const enum AppContextActions {
  UPDATE_ACTIVE_PATH = 'UPDATE_ACTIVE_PATH',
  UPDATE_SIDEBAR_BUTTONS = 'UPDATE_SIDEBAR_BUTTONS',
}

interface ReducerAction {
  type: AppContextActions;
  payload?: {
    path?: AllowedPath;
    router?: NextRouter;
    data?: SidebarButtonProps[];
  };
}

function reducer(state: AppContextStateProps, action: ReducerAction): AppContextStateProps {
  switch (action.type) {
    case AppContextActions.UPDATE_ACTIVE_PATH:
      if (action.payload?.path) {
        if (action.payload?.router && action.payload?.path !== action.payload?.router?.pathname) {
          action.payload.router.push(action.payload.path);
        }

        return {
          ...state,
          activePath: action.payload?.path,
        };
      }

    case AppContextActions.UPDATE_SIDEBAR_BUTTONS:
      if (action.payload?.data) {
        return {
          ...state,
          sidebarButtons: action.payload?.data,
        };
      }

    // explicitly not breaking the switch; If payload values not supplied, default case be returned.
    default:
      return {
        ...state,
      };
  }
}

export const AppContext = createContext<AppContextType | null>(null);

const initialState: AppContextStateProps = {
  activePath: '',
  sidebarButtons: sidebarNavItems,
};

export const AppContextProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const [state, dispatch] = useReducer(reducer, initialState);

  const updateActivePath = useCallback(
    (path: AllowedPath) =>
      dispatch({ type: AppContextActions.UPDATE_ACTIVE_PATH, payload: { path, router } }),
    [router],
  );

  const updateSidebarButtons = useCallback(
    (data: SidebarButtonProps[]) =>
      dispatch({ type: AppContextActions.UPDATE_SIDEBAR_BUTTONS, payload: { data } }),
    [],
  );

  return (
    <AppContext.Provider
      value={{
        state,
        updateActivePath,
        updateSidebarButtons,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const appContext = useContext(AppContext);
  if (appContext === undefined) {
    throw new Error('useAppContext must be inside AppContextProvider');
  }
  return appContext as AppContextType;
};