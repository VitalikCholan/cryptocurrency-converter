declare global {
  interface Window {
    chrome: {
      runtime: {
        id: string;
      };
    };
  }
}

export {};
