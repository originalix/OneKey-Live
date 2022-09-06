import { Channels, HardwareChannel } from 'main/preload';
import { IReceiveMessage, ISendMessage } from 'types';

declare global {
  interface Window {
    electron: {
      ipcRenderer: {
        sendMessage(channel: Channels, args: unknown[]): void;
        on(
          channel: string,
          func: (...args: unknown[]) => void
        ): (() => void) | undefined;
        once(channel: string, func: (...args: unknown[]) => void): void;
      };
    };
    hardwareSDK: {
      ipcRenderer: {
        sendMessage(channel: Channels, message: ISendMessage): void;
        on(
          channel: string,
          func: (message: ISendMessage) => void
        ): (() => void) | undefined;
        once(channel: string, func: (...args: unknown[]) => void): void;
        invoke(channel: HardwareChannel, message: IReceiveMessage): void;
      };
    };
  }
}

export {};
