/* Typings for `render-runtime` */
declare module "vtex.render-runtime" {
  import { Component, ComponentType, ReactElement, ReactType } from "react";

  export interface NavigationOptions {
    page?: string;
    to?: string;
    params?: any;
    fallbackToWindowLocation?: boolean;
  }

  export interface RenderContext {
    culture: {
      locale: string;
      currency: string;
    };
    getSettings: (app: string) => any;
    navigate: (options: NavigationOptions) => void;
  }

  export interface RenderContextProps {
    runtime: {
      navigate: (options: NavigationOptions) => void;
    };
  }

  interface ExtensionPointProps {
    id: string;
    [key: string]: any;
  }

  export const ExtensionPoint: ComponentType<ExtensionPointProps>;

  interface ChildBlockProps {
    id: string;
  }

  export const ChildBlock: ComponentType<ChildBlockProps>;
  export const useChildBlock = function({ id: string }): object {};
  export function useRuntime(): RenderContext;
  export const Helmet: ReactElement;
  export const Link: ReactType;
  export const NoSSR: ReactElement;
  export const RenderContextConsumer: ReactElement;
  export const canUseDOM: boolean;
  export const withRuntimeContext: <TOriginalProps extends {}>(
    Component: ComponentType<TOriginalProps & RenderContextProps>
  ) => ComponentType<TOriginalProps>;
}
