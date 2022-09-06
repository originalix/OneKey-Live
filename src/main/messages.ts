import { ipcMain } from 'electron';
import { createDeferred, Deferred } from '@onekeyfe/hd-shared';
import type { BrowserWindow } from 'electron';
import { ISendMessage, IReceiveMessage } from '../types';

let mainWindow: BrowserWindow;
function setMainWindow(window: BrowserWindow) {
  mainWindow = window;
}

const MagicId = 0;
let messageId = MagicId;

const getMessageId = () => {
  messageId += 1;
  return messageId;
};

const promiseMap: Record<number, Deferred<any>> = {};

async function postMessage(params?: any) {
  const promise = createDeferred<IReceiveMessage, number>();
  const id = getMessageId();
  promise.id = id;
  mainWindow.webContents.send('hardware-sdk', {
    id,
    messageType: 'Send',
    payload: { ...params },
  } as ISendMessage);
  promiseMap[id] = promise;
  const response = await promise.promise;
  return response;
}

function listenRendererMessages() {
  ipcMain.handle('hardware-sdk', (_, message: IReceiveMessage) => {
    if (message.messageType !== 'Receive') return;

    if (message.id) {
      const promise = promiseMap[message.id];
      if (message.success) {
        promise?.resolve(message);
      } else {
        promise?.reject(message.payload?.error);
      }
    }

    return { success: true, type: 'receive invoke message' };
  });
}

export default {};

export { setMainWindow, postMessage, listenRendererMessages };