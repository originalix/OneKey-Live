import { useEffect } from 'react';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import icon from '../../assets/icon.svg';
import './App.css';
import { ISendMessage } from '../types';
import { createResponseMessage } from '../event';
import { serviceHardware } from './hardware';

const Hello = () => {
  useEffect(() => {
    console.log('effect mount');
    const create = async () => {
      const ins = await serviceHardware.getSDKInstance();
      console.log(ins);
    };
    create();
  }, []);
  return (
    <div>
      <div className="Hello">
        <img width="200" alt="icon" src={icon} />
      </div>
      <h1>OneKey Live 2</h1>
    </div>
  );
};

export default function App() {
  console.log(window.hardwareSDK.ipcRenderer);
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
        <Route path="/" element={<Hello />} />
      </Routes>
    </Router>
  );
}
