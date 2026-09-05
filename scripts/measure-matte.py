"""
MEDIR O ENQUADRAMENTO — Etapa 6.4 do PLAYBOOK-2.

O playbook é explícito: a posição do texto que fica ATRÁS da pessoa é MEDIDA,
não chutada. Este script extrai um frame do matte em cada instante pedido e
reporta, em coordenadas do matte (mesmas do proxy):

    topo   -> primeira linha com silhueta (topo da cabeça)
    ombros -> primeira linha em que a silhueta fica >2x mais larga que a cabeça
    largura da cabeça e o centro horizontal

Uso (a partir de editor/):
    python .\\scripts\\measure-matte.py 1.7 10.2 19.6 ...
"""

import os
import subprocess
import sys

import cv2
import numpy as np

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MATTE = os.path.join(ROOT, "public", "matte-pessoa.webm")
FFMPEG = os.path.join(
    ROOT, "node_modules", "@remotion", "compositor-win32-x64-msvc", "ffmpeg.exe"
)
TMP = os.path.join(ROOT, "out", "_measure.png")


def measure(t: float) -> None:
    subprocess.run(
        [
            FFMPEG, "-y", "-loglevel", "error",
            "-vcodec", "libvpx-vp9", "-ss", f"{t}", "-i", MATTE,
            "-frames:v", "1", "-pix_fmt", "rgba", TMP,
        ],
        check=True,
    )
    img = cv2.imread(TMP, cv2.IMREAD_UNCHANGED)
    if img is None or img.shape[2] < 4:
        print(f"{t:7.2f}  ERRO: sem canal alfa")
        return

    a = img[:, :, 3]
    mask = a > 128
    # largura da silhueta linha a linha
    widths = mask.sum(axis=1)
    rows = np.nonzero(widths > 8)[0]
    if len(rows) == 0:
        print(f"{t:7.2f}  (sem pessoa no frame)")
        return

    topo = int(rows[0])
    # largura da cabeca: mediana das 90 linhas logo abaixo do topo
    cabeca_w = float(np.median(widths[topo : topo + 90]))
    # ombros: primeira linha, abaixo do topo+90, com largura > 2x a da cabeca
    ombros = None
    for y in range(topo + 90, min(topo + 700, a.shape[0])):
        if widths[y] > cabeca_w * 2.0:
            ombros = y
            break

    cols = np.nonzero(mask[topo : topo + 90].sum(axis=0) > 4)[0]
    cx = int((cols[0] + cols[-1]) / 2) if len(cols) else -1

    print(
        f"{t:7.2f}  topo={topo:4d}  ombros={ombros if ombros else '-':>4}  "
        f"larg_cabeca={cabeca_w:5.0f}  centro_x={cx:4d}"
    )


if __name__ == "__main__":
    ts = [float(x) for x in sys.argv[1:]]
    if not ts:
        ts = [i * 8.0 + 2.0 for i in range(14)]
    print("  tempo   topo cabeca | ombros | largura cabeca | centro x")
    for t in ts:
        measure(t)
