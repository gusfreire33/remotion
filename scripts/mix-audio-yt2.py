"""Mixa voz (48k estéreo) + cues de SFX -> out/yt2/mix48.wav.
Mesma soma linear que o Remotion faz (<Audio volume>), sem normalizar.
Uso: python scripts/mix-audio-yt2.py <voz48.wav> <duracao_s>"""
import json, os, struct, sys, numpy as np
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
def read_wav(p):
    b = open(p, "rb").read(); i = 12; ch = sr = None; data = None
    while i + 8 <= len(b):
        cid = b[i:i+4]; size = struct.unpack("<I", b[i+4:i+8])[0]; body = b[i+8:i+8+size]
        if cid == b"fmt ": ch = struct.unpack("<H", body[2:4])[0]; sr = struct.unpack("<I", body[4:8])[0]
        elif cid == b"data": data = body
        i += 8 + size + (size & 1)
    return (np.frombuffer(data, dtype="<i2").astype(np.float32) / 32768.0).reshape(-1, ch), sr
voz, SR = read_wav(sys.argv[1]); DUR = float(sys.argv[2])
N = int(round(DUR * SR)); mix = np.zeros((N, 2), np.float32); mix[:min(N, len(voz))] = voz[:N]
cues = json.load(open(os.path.join(ROOT, "out", "yt2", "sfx-cues.json")))
cache = {}
for c in cues:
    if c["file"] not in cache:
        s, sr = read_wav(os.path.join(ROOT, "public", "sfx", c["file"] + ".wav")); s = s[:, 0]
        t = np.arange(0, len(s) / sr, 1 / SR); cache[c["file"]] = np.interp(t, np.arange(len(s)) / sr, s).astype(np.float32)
    s = cache[c["file"]] * c["volume"]; a = int(round(c["at"] * SR)); b = min(N, a + len(s))
    if a < N: mix[a:b, 0] += s[:b-a]; mix[a:b, 1] += s[:b-a]
pk = float(np.abs(mix).max()); print("pico mistura %.3f | pico voz %.3f | clipping %d" % (pk, float(np.abs(voz[:N]).max()), int((np.abs(mix) >= 0.999).sum())))
out = np.clip(mix, -1, 1); raw = (out * 32767).astype("<i2").tobytes()
hdr = b"RIFF" + struct.pack("<I", 36 + len(raw)) + b"WAVE" + b"fmt " + struct.pack("<IHHIIHH", 16, 1, 2, SR, SR * 4, 4, 16) + b"data" + struct.pack("<I", len(raw))
open(os.path.join(ROOT, "out", "yt2", "mix48.wav"), "wb").write(hdr + raw); print("ok")
