import { useSelector } from 'react-redux';
import { Card } from '@onekeyhq/ui-components';
import type { RootState } from '../store';
import { SearchDevices } from '../components';

export default function Dashboard() {
  const device = useSelector((state: RootState) => state.runtime.device);

  if (!device) {
    return <SearchDevices />;
  }
  return (
    <div>
      {/* @ts-expect-error */}
      <Card className="okd-mx-auto okd-w-[480px] okd-mb-2">
        <div className="okd-text-gray-700">
          Current Select Device: {device?.label}
        </div>
      </Card>
    </div>
  );
}
