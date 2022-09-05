import http from 'http';
import express from 'express';
import bodyParse from 'body-parser';
import cors from 'cors';
import WebSocket from 'ws';

import { ipcMain, BrowserWindow } from 'electron';

ipcMain.on('hardware-sdk', (event) => {
  console.log('hardware sdk listener : ', event);
});
let mainWindow: BrowserWindow;
function setMainWindow(window: BrowserWindow) {
  mainWindow = window;
}

function createProxy() {
  const PORT = 8321;
  const app = express();
  const server = http.createServer(app);
  const wss = new WebSocket.Server({ server });

  // Http Proxy
  app.use(cors());
  app.get('/', (_, res) => {
    mainWindow.webContents.send('hardware-sdk', { data: 1 });
    res.sendStatus(200);
  });

  let pending = false;
  // eslint-disable-next-line consistent-return
  app.post('/', bodyParse.json(), (req, res) => {
    if (!req.body) return res.sendStatus(400);
    const data = null;
    const error: Error | null = null;

    if (pending) {
      return res.sendStatus(400).json({
        error: 'a method was already pending',
      });
    }

    pending = true;

    // TODO: 与 SDK 交互部分
    // SDK 可以使用 node-sdk，这边直接通信，返回结果

    res.sendStatus(200).json({ success: true, payload: { data: 0 } });
  });

  // WebSocket Proxy
  let wsIndex = 0;
  let wsBusyIndex = 0;
  wss.on('connection', (ws) => {
    // eslint-disable-next-line no-plusplus
    const index = ++wsIndex;

    try {
      const onClose = () => {
        if (wsBusyIndex) {
          wsBusyIndex = 0;
        }

        console.log('websocket closed');
      };

      ws.on('close', onClose);
      ws.on('message', () => {
        ws.send(
          JSON.stringify({
            type: 'opened',
          })
        );
        if (wsBusyIndex !== index) {
          console.warn('ignoring message because busy transport');
        }
      });
    } catch (err) {
      console.log('websocket error', err);
    }
  });

  ['localhost']
    .map((ip) => `ws://${ip}:${PORT}`)
    .forEach((ip) => {
      console.log('proxy: ', ip);
    });

  server.listen(PORT, () => {
    console.log('listening on port', PORT);
  });
}

export default {
  createProxy,
  setMainWindow,
};
