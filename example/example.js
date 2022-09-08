/* eslint-disable no-alert */
/* eslint-disable @typescript-eslint/no-unused-vars */
const BRIDGE_URL = 'http://localhost:8321';
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

async function checkBridge() {
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

async function makeApp() {
  try {
    try {
      await checkBridge();
      console.log('check bridge success');
    } catch (e) {
      window.open('onekeylive://bridge');
      await checkBridgeLoop();
    }
  } catch (err) {
    console.log('ONEKEY:::CREATE APP ERROR', err);
    throw err;
  }
}

async function checkBridgeLoop(i) {
  const iterator = i || 0;
  return checkBridge().catch(async () => {
    await delay(BRIDGE_CHECK_DELAY);
    if (iterator < BRIDGE_CHECK_LIMIT) {
      return checkBridgeLoop(iterator + 1);
    }
  });
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
