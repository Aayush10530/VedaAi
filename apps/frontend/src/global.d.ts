/// <reference types="node" />

// Fix for @types/node v20+ where NodeJS.Process.env is defined in the
// modular `node:process` export and not automatically available as a global.
declare namespace NodeJS {
  interface ProcessEnv {
    readonly NODE_ENV: 'development' | 'production' | 'test';
    readonly NEXT_PUBLIC_API_URL?: string;
    readonly NEXT_PUBLIC_WS_URL?: string;
    [key: string]: string | undefined;
  }

  interface Process {
    env: ProcessEnv;
  }
}
