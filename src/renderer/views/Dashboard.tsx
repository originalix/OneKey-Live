import { useSelector, useDispatch } from 'react-redux';
import { Button } from '@onekeyhq/ui-components';
import { useState } from 'react';
import type { RootState } from '../store';
import { Spinner } from '../components';
import { serviceHardware } from '../hardware';

export default function Dashboard() {
  const device = useSelector((state: RootState) => state.runtime.device);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  return (
    <div>
      <Button
        onClick={() => {
          console.log('search device');
          setLoading(true);
          serviceHardware.startDeviceScan(
            (res) => {
              console.log('deviceScan: ', res);
            },
            (state) => {
              console.log('state: ', state);
            }
          );
        }}
        size="lg"
        loading={loading}
        type="basic"
      >
        搜索设备
      </Button>
    </div>
  );
}
