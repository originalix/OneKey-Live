import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import { ISendMessage } from '../types';
import { createResponseMessage } from '../event';
import Dashboard from './views/Dashboard';

export default function App() {
  window.hardwareSDK.ipcRenderer.on(
    'hardware-sdk',
    async (message: ISendMessage) => {
      // Mock do something
      if (message.messageType !== 'Send') {
        return;
      }
      const response = createResponseMessage(message.id ?? -1, true, {
        tag: 1,
      });
      const ret = await window.hardwareSDK.ipcRenderer.invoke(
        'hardware-sdk',
        response
      );
      console.log('app ret: ', ret);
    }
  );
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}
