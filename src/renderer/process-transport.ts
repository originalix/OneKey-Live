import { createDeferred, Deferred } from '@onekeyfe/hd-shared';
import { ISendMessage } from '../types';
import { store } from './store';
import { serviceHardware } from './hardware';
import { createResponseMessage } from '../event';

const getDevice = () => store.getState().runtime.device;

// eslint-disable-next-line import/no-mutable-exports
let devicePromise: Deferred<void> | null = null;

async function invokeResponse(message: ISendMessage, response: any) {
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve) => {
    const responseMessage = createResponseMessage(
      message.id ?? 0,
      response.success,
      response.payload
    );
    const result = await window.hardwareSDK.ipcRenderer.invoke(
      'hardware-sdk',
      responseMessage
    );
    resolve(result);
  });
}

window.hardwareSDK.ipcRenderer.on(
  'hardware-sdk',
  async (message: ISendMessage) => {
    if (message.messageType !== 'Send') {
      return;
    }

    // get runtime device
    let device = getDevice();
    if (!device) {
      console.log('need get device');
      devicePromise = createDeferred();
      await devicePromise?.promise;
      device = getDevice();
    }

    if (!device?.connectId) {
      return;
    }

    console.log('store: ', store);
    // call method
    switch (message.payload.method) {
      case 'getFeatures': {
        const response = await serviceHardware.getFeatures(device.connectId);
        await invokeResponse(message, response);
        break;
      }

      default:
        break;
    }
  }
);

export { devicePromise };
