/*
 * Self-hosted ffmpeg.wasm class worker for @ffmpeg/ffmpeg 0.12.
 *
 * Why this exists: when the library's own worker (module or UMD build) is run
 * through a bundler like Next/webpack, its `await import(coreURL)` gets rewritten
 * into webpack's module resolver, which throws "Cannot find module 'blob:…'" —
 * the core never loads. This file is served verbatim from /public (webpack never
 * touches it), so the dynamic import of the ESM core resolves natively.
 *
 * It re-implements the exact postMessage protocol the FFmpeg class speaks
 * (see @ffmpeg/ffmpeg/dist/esm/classes.js + worker.js). Loaded as a module
 * worker via `load({ classWorkerURL })` in lib/ffmpeg.ts.
 *
 * NOTE: this is a source asset copied to /public/ffmpeg/gft-worker.js by
 * scripts/copy-ffmpeg-assets.mjs — keep it framework-free plain JS.
 */
const FFMessageType = {
  LOAD: "LOAD",
  EXEC: "EXEC",
  FFPROBE: "FFPROBE",
  WRITE_FILE: "WRITE_FILE",
  READ_FILE: "READ_FILE",
  DELETE_FILE: "DELETE_FILE",
  RENAME: "RENAME",
  CREATE_DIR: "CREATE_DIR",
  LIST_DIR: "LIST_DIR",
  DELETE_DIR: "DELETE_DIR",
  ERROR: "ERROR",
  DOWNLOAD: "DOWNLOAD",
  PROGRESS: "PROGRESS",
  LOG: "LOG",
  MOUNT: "MOUNT",
  UNMOUNT: "UNMOUNT",
};

let ffmpeg;

const load = async ({ coreURL, wasmURL, workerURL }) => {
  const first = !ffmpeg;
  // Native dynamic import of the (ESM) core — NOT processed by any bundler.
  self.createFFmpegCore = (await import(coreURL)).default;
  if (!self.createFFmpegCore) {
    throw new Error("Failed to import ffmpeg-core.js");
  }
  const wasm = wasmURL || coreURL.replace(/.js$/g, ".wasm");
  const worker = workerURL || coreURL.replace(/.js$/g, ".worker.js");
  ffmpeg = await self.createFFmpegCore({
    // Encode the wasm/worker URLs in the hash so emscripten's locateFile can
    // find them even though the core itself is loaded from a blob URL.
    mainScriptUrlOrBlob: `${coreURL}#${btoa(
      JSON.stringify({ wasmURL: wasm, workerURL: worker })
    )}`,
  });
  ffmpeg.setLogger((data) => self.postMessage({ type: FFMessageType.LOG, data }));
  ffmpeg.setProgress((data) =>
    self.postMessage({ type: FFMessageType.PROGRESS, data })
  );
  return first;
};

const exec = ({ args, timeout = -1 }) => {
  ffmpeg.setTimeout(timeout);
  ffmpeg.exec(...args);
  const ret = ffmpeg.ret;
  ffmpeg.reset();
  return ret;
};

const ffprobe = ({ args, timeout = -1 }) => {
  ffmpeg.setTimeout(timeout);
  ffmpeg.ffprobe(...args);
  const ret = ffmpeg.ret;
  ffmpeg.reset();
  return ret;
};

const writeFile = ({ path, data }) => {
  ffmpeg.FS.writeFile(path, data);
  return true;
};

const readFile = ({ path, encoding }) => ffmpeg.FS.readFile(path, { encoding });

const deleteFile = ({ path }) => {
  ffmpeg.FS.unlink(path);
  return true;
};

const rename = ({ oldPath, newPath }) => {
  ffmpeg.FS.rename(oldPath, newPath);
  return true;
};

const createDir = ({ path }) => {
  ffmpeg.FS.mkdir(path);
  return true;
};

const listDir = ({ path }) => {
  const names = ffmpeg.FS.readdir(path);
  const nodes = [];
  for (const name of names) {
    const stat = ffmpeg.FS.stat(`${path}/${name}`);
    const isDir = ffmpeg.FS.isDir(stat.mode);
    nodes.push({ name, isDir });
  }
  return nodes;
};

const deleteDir = ({ path }) => {
  ffmpeg.FS.rmdir(path);
  return true;
};

const mount = ({ fsType, options, mountPoint }) => {
  const str = fsType;
  const fs = ffmpeg.FS.filesystems[str];
  if (!fs) return false;
  ffmpeg.FS.mount(fs, options, mountPoint);
  return true;
};

const unmount = ({ mountPoint }) => {
  ffmpeg.FS.unmount(mountPoint);
  return true;
};

self.onmessage = async ({ data: { id, type, data: _data } }) => {
  const trans = [];
  let data;
  try {
    if (type !== FFMessageType.LOAD && !ffmpeg) {
      throw new Error("ffmpeg is not loaded, call `ffmpeg.load()` first");
    }
    switch (type) {
      case FFMessageType.LOAD:
        data = await load(_data);
        break;
      case FFMessageType.EXEC:
        data = exec(_data);
        break;
      case FFMessageType.FFPROBE:
        data = ffprobe(_data);
        break;
      case FFMessageType.WRITE_FILE:
        data = writeFile(_data);
        break;
      case FFMessageType.READ_FILE:
        data = readFile(_data);
        break;
      case FFMessageType.DELETE_FILE:
        data = deleteFile(_data);
        break;
      case FFMessageType.RENAME:
        data = rename(_data);
        break;
      case FFMessageType.CREATE_DIR:
        data = createDir(_data);
        break;
      case FFMessageType.LIST_DIR:
        data = listDir(_data);
        break;
      case FFMessageType.DELETE_DIR:
        data = deleteDir(_data);
        break;
      case FFMessageType.MOUNT:
        data = mount(_data);
        break;
      case FFMessageType.UNMOUNT:
        data = unmount(_data);
        break;
      default:
        throw new Error("unknown message type");
    }
  } catch (e) {
    self.postMessage({ id, type: FFMessageType.ERROR, data: e.toString() });
    return;
  }
  if (data instanceof Uint8Array) {
    trans.push(data.buffer);
  }
  self.postMessage({ id, type, data }, trans);
};
