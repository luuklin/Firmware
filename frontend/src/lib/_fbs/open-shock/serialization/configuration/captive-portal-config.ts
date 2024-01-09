// automatically generated by the FlatBuffers compiler, do not modify

/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-non-null-assertion */

import * as flatbuffers from 'flatbuffers';

export class CaptivePortalConfig {
  bb: flatbuffers.ByteBuffer|null = null;
  bb_pos = 0;
  __init(i:number, bb:flatbuffers.ByteBuffer):CaptivePortalConfig {
  this.bb_pos = i;
  this.bb = bb;
  return this;
}

static getRootAsCaptivePortalConfig(bb:flatbuffers.ByteBuffer, obj?:CaptivePortalConfig):CaptivePortalConfig {
  return (obj || new CaptivePortalConfig()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
}

static getSizePrefixedRootAsCaptivePortalConfig(bb:flatbuffers.ByteBuffer, obj?:CaptivePortalConfig):CaptivePortalConfig {
  bb.setPosition(bb.position() + flatbuffers.SIZE_PREFIX_LENGTH);
  return (obj || new CaptivePortalConfig()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
}

/**
 * Whether the captive portal is forced to be enabled
 * The captive portal will otherwise shut down when a gateway connection is established
 */
alwaysEnabled():boolean {
  const offset = this.bb!.__offset(this.bb_pos, 4);
  return offset ? !!this.bb!.readInt8(this.bb_pos + offset) : false;
}

static startCaptivePortalConfig(builder:flatbuffers.Builder) {
  builder.startObject(1);
}

static addAlwaysEnabled(builder:flatbuffers.Builder, alwaysEnabled:boolean) {
  builder.addFieldInt8(0, +alwaysEnabled, +false);
}

static endCaptivePortalConfig(builder:flatbuffers.Builder):flatbuffers.Offset {
  const offset = builder.endObject();
  return offset;
}

static createCaptivePortalConfig(builder:flatbuffers.Builder, alwaysEnabled:boolean):flatbuffers.Offset {
  CaptivePortalConfig.startCaptivePortalConfig(builder);
  CaptivePortalConfig.addAlwaysEnabled(builder, alwaysEnabled);
  return CaptivePortalConfig.endCaptivePortalConfig(builder);
}
}
