import { getHardwareSDKInstance } from './instance';

class ServiceHardware {
  async getSDKInstance() {
    return getHardwareSDKInstance().then((instance) => {
      return instance;
    });
  }
}

export default ServiceHardware;

const serviceHardware = new ServiceHardware();

export { serviceHardware };
