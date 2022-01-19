/**
 * appinfo.vdf
 *
 * uint32   - MAGIC: 27 44 56 07
 * uint32   - UNIVERSE: 1
 * ---- repeated app sections ----
 * uint32   - AppID
 * uint32   - size // appears to be a legacy offset
 * uint32   - infoState // mostly 2, sometimes 1 (may indicate prerelease or no info)
 * uint32   - lastUpdated
 * uint64   - picsToken
 * 20bytes  - SHA1
 * uint32   - changeNumber
 * variable - binary_vdf
 * ---- end of section ---------
 * uint32   - EOF: 0
 */

const appInfoMagic = 0x27_44_56_07;
const appType = {
  invalid: -1,
  table: 0,
  string: 1,
  int32: 2,
  float: 3,
  wstring: 5,
  color: 6,
  uint64: 7,
  end: 8,
};
const textDecoder = new TextDecoder();

function readAppInfoString(buffer: Buffer, offsetStart: number) {
  let offset = offsetStart;
  while (buffer.readUInt8(offset++) !== 0);
  return {
    value: textDecoder.decode(buffer.subarray(offsetStart, offset - 1)),
    offset,
  };
}

function readAppInfoWideString(buffer: Buffer, offsetStart: number) {
  let offset = offsetStart;
  while (buffer.readUInt16LE(offset) !== 0) {
    offset += 2;
  }
  return {
    value: textDecoder.decode(buffer.subarray(offsetStart, offset)),
    offset,
  };
}

function readColor(buffer: Buffer, offsetStart: number) {
  let offset = offsetStart;
  const red = buffer.readUInt8(offset++);
  const green = buffer.readUInt8(offset++);
  const blue = buffer.readUInt8(offset++);
  return { offset, color: { red, green, blue } };
}

function readPropertyTable(buffer: Buffer, offsetStart: number) {
  let props: any = {};
  let offset = offsetStart;
  let type;
  while ((type = buffer.readUInt8(offset++)) !== appType.end) {
    let name;
    let value;
    ({ value: name, offset } = readAppInfoString(buffer, offset));

    switch (type) {
      case appType.table:
        ({ offset, value } = readPropertyTable(buffer, offset));
        break;
      case appType.string:
        ({ offset, value } = readAppInfoString(buffer, offset));
        break;
      case appType.int32:
        value = buffer.readUInt32LE(offset);
        offset += 4;
        break;
      case appType.float:
        value = buffer.readFloatLE(offset);
        offset += 4;
        break;
      case appType.wstring:
        ({ offset, value } = readAppInfoWideString(buffer, offset));
        break;
      case appType.color:
        ({ offset, color: value } = readColor(buffer, offset));
        break;
      case appType.uint64:
        value = buffer.readBigUInt64LE(offset).toString();
        offset += 8;
        break;
      default:
        throw `Unknown type ${type} of ${name}`;
    }
    props[name] = value;
  }
  const keys = Object.keys(props).map(parseFloat);
  if (keys.every((it, i) => it === i)) {
    props = keys.map((it) => props[it]);
  }

  return { offset, value: props };
}

/**
 * todo: use worker
 */
export async function parseAppInfo(buffer?: Buffer) {
  if (!buffer) return null;

  if (buffer.readUIntBE(0, 4) !== appInfoMagic) return null;
  // 0 invalid, 1 public, 2 beta, 3 internal, 4 dev, 5 max
  // const universe = buffer.readUInt32LE(4);
  let offset = 8;
  let appid;
  const apps: any = {};

  while (true) {
    appid = buffer.readUInt32LE(offset);
    offset += 4;
    if (appid === 0) break;

    const size = buffer.readUInt32LE(offset);
    offset += 4;
    const infoState = buffer.readUInt32LE(offset);
    offset += 4;
    const lastUpdated = buffer.readUInt32LE(offset);
    offset += 4;
    const picsToken = buffer.readBigUInt64LE(offset).toString();
    offset += 8;
    const sha1 = buffer
      .subarray(offset, offset + 20)
      .map((it) => it.toString(16) as any)
      .join('');
    offset += 20;
    const changeNumber = buffer.readUInt32LE(offset);
    offset += 4;

    let props;
    ({ offset, value: props } = readPropertyTable(buffer, offset));
    const { appinfo, ...others } = props;

    apps[appid] = {
      appid,
      size,
      infoState,
      lastUpdated,
      picsToken,
      sha1,
      changeNumber,
      props: others,
      appinfo,
    };
  }
  return apps;
}
