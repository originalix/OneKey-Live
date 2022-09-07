import { createDeferred, Deferred } from '@onekeyfe/hd-shared';
import { ISendMessage } from '../types';
import { store } from './store';
import { serviceHardware } from './hardware';
import { createResponseMessage } from '../event';

const getDevice = () => store.getState().runtime.device;

// eslint-disable-next-line import/no-mutable-exports
let devicePromise: Deferred<void> | null = null;

async function invokeResponse(message: ISendMessage, response: any) {
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

function addIpcListener() {
  const subscription = window.hardwareSDK.ipcRenderer.on(
    'hardware-sdk',
    async (message: ISendMessage) => {
      if (message.messageType !== 'Send') {
        return;
      }

      console.log('ipcrenderer received message');

      // get runtime device
      let device = getDevice();
      if (!device) {
        console.log('need get device');
        devicePromise = createDeferred();
        try {
          await devicePromise?.promise;
        } catch (e) {
          // TODO: search device error
        }
        device = getDevice();
      }

      if (!device?.connectId) {
        return;
      }

      // call method
      const HardwareSDK = await serviceHardware.getSDKInstance();
      switch (message.payload.method) {
        case 'getFeatures': {
          console.log('getFeatures call ======> ');
          const response = await HardwareSDK.getFeatures(device.connectId);
          await invokeResponse(message, response);
          return;
        }
        case 'evmGetAddress': {
          const response = await HardwareSDK.evmGetAddress(
            device.connectId,
            device?.deviceId ?? '',
            { ...message.payload.params }
          );
          await invokeResponse(message, response);
          return;
        }

        default: {
          const response = createResponseMessage(message.id ?? 0, false, {
            error: 'not found method',
          });
          await invokeResponse(message, response);
        }
      }
    }
  );

  return subscription;
}

export { devicePromise, addIpcListener };
