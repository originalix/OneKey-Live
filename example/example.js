/* eslint-disable no-alert */
/* eslint-disable @typescript-eslint/no-unused-vars */
const BRIDGE_URL = 'http://localhost:8321';
const SOCKET_BRIDGE_URL = 'ws://localhost:8321';
const BRIDGE_CHECK_DELAY = 1000;
const BRIDGE_CHECK_LIMIT = 120;

async function request(params) {
  try {
    const response = await fetch(BRIDGE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });
    const res = await response.json();
    return res;
  } catch (e) {
    console.error(e);
    throw e;
  }
}

async function getFeatures() {
  await makeApp();
  const response = await request({ method: 'getFeatures' });
  alert(JSON.stringify(response));
}

async function evmGetAddress() {
  await makeApp();
  const response = await request({
    method: 'evmGetAddress',
    params: {
      path: "m/44'/60'/0'/0/0",
      showOnOneKey: true,
    },
  });
  alert(JSON.stringify(response));
}

async function makeApp(useHttpBridge = false) {
  try {
    try {
      if (useHttpBridge) {
        await checkHttpBridge();
      } else {
        await checkWebSocketBridge();
      }
      console.log('check bridge success');
    } catch (e) {
      window.open('onekeylive://bridge');
      if (useHttpBridge) {
        await checkHttpBridgeLoop();
      } else {
        await checkWebSocketBridgeLoop();
      }
    }
  } catch (err) {
    console.log('ONEKEY:::CREATE APP ERROR', err);
    throw err;
  }
}

async function checkHttpBridge() {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await fetch(BRIDGE_URL, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const res = await response.json();
      return res.success ? resolve() : reject();
    } catch (e) {
      console.error(e);
      reject(e);
    }
  });
}

async function checkHttpBridgeLoop(i) {
  const iterator = i || 0;
  return checkHttpBridge().catch(async () => {
    await delay(BRIDGE_CHECK_DELAY);
    if (iterator < BRIDGE_CHECK_LIMIT) {
      return checkHttpBridgeLoop(iterator + 1);
    }
  });
}

async function checkWebSocketBridge() {
  return new Promise((resolve, reject) => {
    let connected = false;
    const socket = new WebSocket(SOCKET_BRIDGE_URL);
    socket.addEventListener('open', () => {
      socket.send('ping');
    });
    socket.onmessage = (event) => {
      if (event.data === 'pong') {
        resolve();
        connected = true;
        socket.close();
      }
    };

    socket.onclose = () => {
      if (!connected) {
        reject();
      }
      if (timer) {
        clearTimeout(timer);
      }
      console.log('check socket closed');
    };

    const timer = setTimeout(() => {
      socket.close();
    }, 5000);
  });
}

async function checkWebSocketBridgeLoop(i) {
  const iterator = i || 0;
  return checkWebSocketBridge().catch(async () => {
    await delay(BRIDGE_CHECK_DELAY);
    if (iterator < BRIDGE_CHECK_LIMIT) {
      return checkWebSocketBridgeLoop(iterator + 1);
    }
  });
}

async function getFeaturesBySocket() {
  await makeApp();
  console.log(1);
  // const response = await request({ method: 'getFeatures' });
  // alert(JSON.stringify(response));
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
