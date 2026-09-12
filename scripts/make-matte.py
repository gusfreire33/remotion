"""
MATTE DA PESSOA — recorta o apresentador do vídeo base e grava um WebM com
canal alfa (VP9 / yuva420p).

Para que serve: colocar TEXTO ATRÁS da pessoa (estilo Captions). No Remotion a
pilha fica:

    [vídeo base]  ->  [texto marcante]  ->  [este recorte da pessoa]

Como o recorte sai do MESMO frame do vídeo base, basta aplicar a MESMA
transformação de zoom nas duas camadas para o encaixe ficar perfeito.

Uso (a partir de editor/):
    python .\\scripts\\make-matte.py

Entrada : public/video29_1080.mp4
Saída   : public/matte-pessoa.webm
"""

import os
import subprocess
import sys

import cv2
import numpy as np
import mediapipe as mp
from mediapipe.tasks.python import BaseOptions
from mediapipe.tasks.python.vision import (
    ImageSegmenter,
    ImageSegmenterOptions,
    RunningMode,
)

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, "public", sys.argv[1] if len(sys.argv) > 1 else "video30_1080.mp4")
OUT = os.path.join(ROOT, "public", sys.argv[2] if len(sys.argv) > 2 else "matte-pessoa.webm")
MODEL = os.path.join(ROOT, "scripts", "models", "selfie_segmenter.tflite")
FFMPEG = os.path.join(
    ROOT, "node_modules", "@remotion", "compositor-win32-x64-msvc", "ffmpeg.exe"
)


def main() -> int:
    cap = cv2.VideoCapture(SRC)
    if not cap.isOpened():
        print("ERRO: não abriu", SRC)
        return 1

    fps = cap.get(cv2.CAP_PROP_FPS) or 30.0
    w = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    h = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
    total = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    print(f"fonte: {w}x{h} @ {fps:.2f}fps, {total} frames")

    ff = subprocess.Popen(
        [
            FFMPEG, "-y",
            # o ffmpeg que vem com o Remotion é compilado com --disable-demuxers
            # e NÃO tem o demuxer "rawvideo" — só image2pipe. Por isso os frames
            # vão como PNG (que preserva o alfa) em vez de RGBA cru.
            "-f", "image2pipe", "-vcodec", "png",
            "-framerate", f"{fps}",
            "-i", "pipe:0",
            "-c:v", "libvpx-vp9",
            "-pix_fmt", "yuva420p",
            "-auto-alt-ref", "0",
            "-b:v", "0", "-crf", "32",
            # keyframe a cada 10 frames. SEM isto o render do Remotion quebra
            # com "No frame found at position X": o compositor precisa buscar
            # frame a frame e, com GOP longo, não acha ponto de entrada.
            # Custa ~40% de tamanho e vale cada byte.
            "-g", "10", "-keyint_min", "10",
            "-row-mt", "1", "-cpu-used", "5",
            "-an",
            OUT,
        ],
        stdin=subprocess.PIPE,
        stdout=subprocess.DEVNULL,
        stderr=open(OUT + ".log", "wb"),
    )

    opts = ImageSegmenterOptions(
        base_options=BaseOptions(model_asset_path=MODEL),
        running_mode=RunningMode.VIDEO,
        output_category_mask=False,
        output_confidence_masks=True,
    )

    # kernel para "encolher" 1px e matar a franja clara na borda do recorte
    erode_k = np.ones((3, 3), np.uint8)

    n = 0
    with ImageSegmenter.create_from_options(opts) as seg:
        while True:
            ok, frame_bgr = cap.read()
            if not ok:
                break

            rgb = cv2.cvtColor(frame_bgr, cv2.COLOR_BGR2RGB)
            mp_img = mp.Image(image_format=mp.ImageFormat.SRGB, data=rgb)
            ts_ms = int(n * 1000.0 / fps)
            res = seg.segment_for_video(mp_img, ts_ms)

            # confidence_masks[0] = fundo, [1] = pessoa
            conf = res.confidence_masks[-1].numpy_view()
            alpha = np.clip(conf, 0.0, 1.0)

            # contraste na máscara: empurra o miolo pra 1 e o fundo pra 0
            alpha = np.clip((alpha - 0.35) / 0.30, 0.0, 1.0)
            a8 = (alpha * 255).astype(np.uint8)
            a8 = cv2.erode(a8, erode_k, iterations=1)
            a8 = cv2.GaussianBlur(a8, (5, 5), 0)

            bgra = np.dstack([frame_bgr, a8])
            ok_png, buf = cv2.imencode(
                ".png", bgra, [int(cv2.IMWRITE_PNG_COMPRESSION), 1]
            )
            if not ok_png:
                print("ERRO: falhou ao codificar PNG no frame", n)
                return 1
            ff.stdin.write(buf.tobytes())

            n += 1
            if n % 150 == 0:
                print(f"  {n}/{total} frames...", flush=True)

    cap.release()
    ff.stdin.close()
    if ff.wait() != 0 or n != total:
        print(f"ERRO: encode incompleto ({n}/{total}), consulte {OUT}.log")
        return 1

    size = os.path.getsize(OUT) / 1e6 if os.path.exists(OUT) else 0
    print(f"DONE: {n} frames -> {OUT} ({size:.1f} MB)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
