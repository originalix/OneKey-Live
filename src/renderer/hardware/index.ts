// import { createDeferred, Deferred } from '@onekeyfe/hd-shared';
import { getHardwareSDKInstance } from './instance';

class ServiceHardware {
  async getSDKInstance() {
    return getHardwareSDKInstance().then((instance) => {
      return instance;
    });
  }

  async searchDevices() {
    const hardwareSDK = await this.getSDKInstance();
    return hardwareSDK?.searchDevices();
  }
}

export default ServiceHardware;

const serviceHardware = new ServiceHardware();

export { serviceHardware };
