import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ElectronService {
  private get api(): Window['midleoApi'] {
    if (!window.midleoApi) {
      throw new Error('Midleo desktop API is unavailable. Run the Electron shell.');
    }
    return window.midleoApi;
  }

  readAceList(): Promise<string> {
    return this.api.readAceList();
  }

  updateAce(data: string): Promise<string> {
    return this.api.updateAce(data);
  }

  execAce<T = unknown>(payload: Record<string, unknown>): Promise<T> {
    return this.api.execAce(JSON.stringify(payload)).then((result: string) => {
      if (typeof result === 'string' && result.trim().startsWith('{')) {
        return JSON.parse(result) as T;
      }
      if (typeof result === 'string' && result.trim().startsWith('[')) {
        return JSON.parse(result) as T;
      }
      throw new Error(typeof result === 'string' ? result : 'Unexpected ACE response');
    });
  }
}
