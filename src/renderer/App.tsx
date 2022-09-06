import { truncate } from 'fs';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import icon from '../../assets/icon.svg';
import './App.css';

const Hello = () => {
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
  window.hardwareSDK.ipcRenderer.on('hardware-sdk', async (e: any) => {
    console.log(e);
    // Mock do something
    const ret = await window.hardwareSDK.ipcRenderer.invoke('hardware-sdk', {
      success: true,
      messageId: e.messageId,
      payload: { data: 1 },
    } as any);
    console.log('app ret: ', ret);
  });
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Hello />} />
      </Routes>
    </Router>
  );
}
