export interface MidleoApi {
  readAceList(): Promise<string>;
  updateAce(data: string): Promise<string>;
  execAce(payload: string): Promise<string>;
}

declare global {
  interface Window {
    midleoApi: MidleoApi;
  }
}

export {};
