import { Builder as FlatbufferBuilder } from 'flatbuffers';
import { LocalToHubMessage } from '$lib/_fbs/open-shock/serialization/local/local-to-hub-message';
import { LocalToHubMessagePayload } from '$lib/_fbs/open-shock/serialization/local/local-to-hub-message-payload';
import { ActionCommand } from '$lib/_fbs/open-shock/serialization/local/action-command';

export function SerializeActionCommand(action: number, power: number, duration: number): Uint8Array {
  const fbb = new FlatbufferBuilder(128);

  const message = ActionCommand.createActionCommand(fbb, action, power, duration);

  const payloadOffset = LocalToHubMessage.createLocalToHubMessage(fbb, LocalToHubMessagePayload.ActionCommand, message);

  fbb.finish(payloadOffset);

  return fbb.asUint8Array();
}