// automatically generated by the FlatBuffers compiler, do not modify

import * as flatbuffers from 'flatbuffers';

import { ShockerCommandType } from '../../open-shock/serialization/types/shocker-command-type.js';
import { ShockerModelType } from '../../open-shock/serialization/types/shocker-model-type.js';


export class ShockerCommand {
  bb: flatbuffers.ByteBuffer|null = null;
  bb_pos = 0;
  __init(i:number, bb:flatbuffers.ByteBuffer):ShockerCommand {
  this.bb_pos = i;
  this.bb = bb;
  return this;
}

model():ShockerModelType {
  return this.bb!.readUint8(this.bb_pos);
}

id():number {
  return this.bb!.readUint16(this.bb_pos + 2);
}

type():ShockerCommandType {
  return this.bb!.readUint8(this.bb_pos + 4);
}

intensity():number {
  return this.bb!.readUint8(this.bb_pos + 5);
}

duration():number {
  return this.bb!.readUint16(this.bb_pos + 6);
}

static sizeOf():number {
  return 8;
}

static createShockerCommand(builder:flatbuffers.Builder, model: ShockerModelType, id: number, type: ShockerCommandType, intensity: number, duration: number):flatbuffers.Offset {
  builder.prep(2, 8);
  builder.writeInt16(duration);
  builder.writeInt8(intensity);
  builder.writeInt8(type);
  builder.writeInt16(id);
  builder.pad(1);
  builder.writeInt8(model);
  return builder.offset();
}

}
