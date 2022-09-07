import { useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button, Card } from '@onekeyhq/ui-components';
import { KnownDevice, SearchDevice } from '@onekeyfe/hd-core';
import { setDevice } from '../store/reducers/runtime';
import type { RootState } from '../store';
import { serviceHardware } from '../hardware';

export default function Dashboard() {
  const device = useSelector((state: RootState) => state.runtime.device);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [searchedDevices, setSearchedDevices] = useState<SearchDevice[]>([]);

  const handleSearchDevice = useCallback(() => {
    console.log('search device');
    setLoading(true);

    serviceHardware.startDeviceScan(
      (response) => {
        if (!response.success) {
          console.log('device error: ', response.payload);
          setLoading(false);
          return;
        }

        setSearchedDevices(response.payload);
      },
      () => {}
    );
  }, []);
  return (
    <div>
      {/* @ts-expect-error */}
      <Card className="okd-mx-auto okd-w-[480px] okd-mb-2">
        <div className="okd-text-gray-700">
          Current Select Device: {device?.label}
        </div>
      </Card>
      <Button
        onClick={() => handleSearchDevice()}
        size="lg"
        loading={loading}
        type="primary"
      >
        搜索设备
      </Button>
      <div className="okd-mt-4">
        {searchedDevices.map((d) => (
          // @ts-expect-error
          <Card key={d.connectId}>
            <div>
              <span className="okd-text-gray-700 okd-px-2">
                {(d as any).features?.label ?? d.name}
              </span>
              <Button
                className="okd-flex-1"
                size="sm"
                onClick={() => {
                  dispatch(setDevice(d as KnownDevice));
                  setLoading(false);
                  serviceHardware.stopScan();
                }}
                type="primary"
              >
                Select
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
