"""
MEDIR O VOLUME DOS SFX — Etapa 13.3 do PLAYBOOK-2.

O playbook é explícito: o volume dos efeitos é MEDIDO, não chutado. Critério de
aprovação — pico da mistura ≈ pico da voz + no máximo ~10%, e zero clipping.

O `volumedetect` do ffmpeg não existe aqui (o binário do Remotion é compilado
com --disable-filters), então extraímos os dois WAVs e comparamos com numpy.

Uso (a partir de editor/):
    python .\\scripts\\measure-audio.py out\\_teste-inicio.mp4 0 8.7
"""

import os
import struct
import subprocess
import sys

import numpy as np

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FFMPEG = os.path.join(
    ROOT, "node_modules", "@remotion", "compositor-win32-x64-msvc", "ffmpeg.exe"
)
# ⚠️ TROCAR A CADA VÍDEO. Comparar a mistura nova com a voz do vídeo ANTERIOR
# não mede nada: o pico da voz muda a cada gravação (é justamente por isso que
# o playbook diz que o MASTER não se herda).
VOZ = os.path.join(ROOT, "public", os.environ.get("VOZ", "yt2_1080.mp4"))


def wav(src: str, dest: str, ss: float | None = None, t: float | None = None) -> np.ndarray:
    """
    ⚠️ SEM downmix (`-ac 1`). Foi o erro da primeira medição deste vídeo: o
    downmix mono é 0,5·(L+R) e, como o render deixa os canais mais
    correlacionados que o source, ele inventava um pico 16% maior que não
    existe em canal nenhum. O que vai pro Reels são os canais — meça os canais.
    """
    cmd = [FFMPEG, "-y", "-loglevel", "error"]
    if ss is not None:
        cmd += ["-ss", f"{ss}"]
    cmd += ["-i", src]
    if t is not None:
        cmd += ["-t", f"{t}"]
    cmd += ["-ar", "48000", "-c:a", "pcm_s16le", dest]
    subprocess.run(cmd, check=True)
    return read_wav(dest)


def read_wav(path: str) -> np.ndarray:
    """
    ⚠️ Acha os chunks `fmt `/`data` de verdade. NÃO corte os 44 bytes fixos do
    cabeçalho: o WAV que este ffmpeg escreve traz um chunk LIST a mais, o corte
    fixo desalinha as amostras por um número ímpar de bytes e o resultado é
    ruído — foi assim que a primeira medição deste vídeo "achou" um pico de
    0,931 que não existia (o real era 0,406).
    """
    b = open(path, "rb").read()
    assert b[:4] == b"RIFF" and b[8:12] == b"WAVE", f"{path} não é WAV"
    i, ch, bits, data = 12, None, None, None
    while i + 8 <= len(b):
        cid = b[i : i + 4]
        size = struct.unpack("<I", b[i + 4 : i + 8])[0]
        body = b[i + 8 : i + 8 + size]
        if cid == b"fmt ":
            ch = struct.unpack("<H", body[2:4])[0]
            bits = struct.unpack("<H", body[14:16])[0]
        elif cid == b"data":
            data = body
        i += 8 + size + (size & 1)
    assert bits == 16, f"esperava PCM 16 bits, veio {bits}"
    return (np.frombuffer(data, dtype="<i2").astype(np.float32) / 32768.0).reshape(-1, ch)


def stats(name: str, x: np.ndarray) -> float:
    # por CANAL: é o que sai no arquivo. Downmix mono inventa pico.
    pico = float(np.max(np.abs(x)))
    rms = float(np.sqrt(np.mean(x**2)))
    clip = int(np.sum(np.abs(x) >= 0.999))
    canais = " / ".join(f"{np.abs(x[:, c]).max():.3f}" for c in range(x.shape[1]))
    print(f"  {name:<10} pico={pico:.3f} ({canais})  rms={rms:.4f}  amostras_no_teto={clip}")
    return pico


def main() -> int:
    mix_src = os.path.join(ROOT, sys.argv[1])
    ss = float(sys.argv[2])
    dur = float(sys.argv[3])

    a = wav(mix_src, os.path.join(ROOT, "out", "_mix.wav"))
    b = wav(VOZ, os.path.join(ROOT, "out", "_voz.wav"), ss, dur)

    print(f"trecho: {ss:.2f}s -> {ss + dur:.2f}s")
    pm = stats("mistura", a)
    pv = stats("voz", b)

    delta = (pm / pv - 1) * 100 if pv else 0
    ok = delta <= 10.0 and pm < 0.999
    print(f"\n  mistura vs voz: {delta:+.1f}%  ->  {'OK' if ok else 'ACIMA DO CRITERIO'}")
    return 0 if ok else 1


if __name__ == "__main__":
    sys.exit(main())
