import http from 'http';
import express from 'express';
import bodyParse from 'body-parser';
import cors from 'cors';
import WebSocket from 'ws';
import HardwareSDK from '@onekeyfe/hd-common-connect-sdk';
import { getSDKVersion } from '@onekeyfe/hd-core';
import { postMessage, listenRendererMessages } from './messages';

listenRendererMessages();

let pending = false;
function setPending(state: boolean) {
  pending = state;
}

function createProxy() {
  const PORT = 8321;
  const app = express();
  const server = http.createServer(app);
  const wss = new WebSocket.Server({ server });

  // Http Proxy
  app.use(cors());
  app.get('/', async (_, res) => {
    res.json({ success: true });
  });

  app.get('/node', async (_, res) => {
    await HardwareSDK.init({ debug: true });
    console.log('HardwareSDK initialized success, version: ', getSDKVersion());
    const response = HardwareSDK.getFeatures('Bixin22080100009');
    res.json(response);
  });

  setPending(false);
  // eslint-disable-next-line consistent-return
  app.post('/', bodyParse.json(), async (req, res) => {
    console.log(req.body);
    if (!req.body) return res.sendStatus(400);

    if (pending) {
      return res.status(400).json({
        success: false,
        payload: {
          error: 'a method was already pending',
          code: 0,
        },
      });
    }

    setPending(true);

    try {
      const result = await postMessage(req.body);
      return res.json({ ...result });
    } catch (err) {
      return res.status(400).json({ err });
    } finally {
      pending = false;
    }
  });

  // WebSocket Proxy
  let wsIndex = 0;
  let wsBusyIndex = 0;
  wss.on('connection', (ws) => {
    // eslint-disable-next-line no-plusplus
    const index = ++wsIndex;

    try {
      let destroyed = false;
      const onClose = () => {
        if (destroyed) return;
        destroyed = true;
        if (wsBusyIndex) {
          wsBusyIndex = 0;
        }

        console.log('websocket closed');
      };

      ws.on('close', onClose);
      ws.on('message', (message, isBinary) => {
        if (destroyed) return;
        const data = isBinary ? message : message.toString();
        console.log(data);
        if (data === 'ping') {
          ws.send('pong');
          return;
        }
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
      ws.close();
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
  setPending,
};
