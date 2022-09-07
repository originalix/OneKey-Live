import http from 'http';
import express from 'express';
import bodyParse from 'body-parser';
import cors from 'cors';
import WebSocket from 'ws';
import { postMessage, listenRendererMessages, setMainWindow } from './messages';

listenRendererMessages();

function createProxy() {
  const PORT = 8321;
  const app = express();
  const server = http.createServer(app);
  const wss = new WebSocket.Server({ server });

  // Http Proxy
  app.use(cors());
  app.get('/', async (_, res) => {
    const result = await postMessage();
    res.json(result);
  });

  let pending = false;
  // eslint-disable-next-line consistent-return
  app.post('/', bodyParse.json(), async (req, res) => {
    console.log(req.body);
    if (!req.body) return res.sendStatus(400);
    const error: Error | null = null;

    if (pending) {
      return res.sendStatus(400).json({
        error: 'a method was already pending',
      });
    }

    pending = true;

    try {
      const result = await postMessage(req.body);
      return res.json({ ...result });
    } catch (err) {
      return res.sendStatus(400).json({ error });
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
