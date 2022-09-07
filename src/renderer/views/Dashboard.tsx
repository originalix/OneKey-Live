import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../store';

export default function Dashboard() {
  const device = useSelector((state: RootState) => state.runtime.device);
  const dispatch = useDispatch();
  return <div>Select Device</div>;
}
