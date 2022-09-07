import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Alert } from '@onekeyhq/ui-components';
import { UI_REQUEST, UI_RESPONSE } from '@onekeyfe/hd-core';
import { serviceHardware } from 'renderer/hardware';
import type { RootState } from '../store';

function UiRequest() {
  const uiEvent = useSelector((state: RootState) => state.uiResponse.event);

  useEffect(() => {
    console.log('rerender uiRequest ========>>>>> ');
  }, [uiEvent]);

  if (!uiEvent) {
    return null;
  }

  if (uiEvent.uiRequest === UI_REQUEST.CLOSE_UI_WINDOW) {
    return null;
  }

  let content = '';

  switch (uiEvent.uiRequest) {
    case UI_REQUEST.REQUEST_PIN: {
      content = 'Please enter the pin code on  your device';
      serviceHardware.sendUiResponse({
        type: UI_RESPONSE.RECEIVE_PIN,
        payload: '@@ONEKEY_INPUT_PIN_IN_DEVICE',
      });
      break;
    }
    case UI_REQUEST.REQUEST_BUTTON: {
      content = 'Please confirm on your device';
      break;
    }
    default: {
      content = 'Please confirm on your device';
      break;
    }
  }

  return (
    // @ts-expect-error
    <Alert title="Tips" type="success">
      <p>{content}</p>
    </Alert>
  );
}

export default React.memo(UiRequest);
