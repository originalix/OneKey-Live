import { IReceiveMessage } from '../types';

export const createResponseMessage = (
  id: number,
  success: boolean,
  payload: any
): IReceiveMessage => ({
  event: 'fake event',
  type: 'fake type',
  id,
  success,
  payload,
  messageType: 'Receive',
});
