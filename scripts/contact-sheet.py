"""
FOLHA DE CONTATO — Etapa 14.3 do PLAYBOOK-2.

Junta os `out/still-*.png` em mosaicos. Problema de ritmo, colisão de elemento
e "sobrou coisa na tela" só aparecem vendo os frames lado a lado — um por um
não pega.

O ffmpeg do Remotion é compilado com --disable-filters (sem `tile`), então a
montagem é feita aqui com numpy.

Uso (a partir de editor/):
    python .\\scripts\\contact-sheet.py [colunas] [por_folha]
"""

import glob
import os
import sys

import cv2
import numpy as np

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.abspath(sys.argv[3]) if len(sys.argv) > 3 else os.path.join(ROOT, "out")

CELL_W = 270
CELL_H = 480
PAD = 8


def main() -> int:
    cols = int(sys.argv[1]) if len(sys.argv) > 1 else 4
    per = int(sys.argv[2]) if len(sys.argv) > 2 else 8

    # ⚠️ glob do Python trata "[WD]" como classe de caracteres e nao acha nada.
    # Por isso a lista sai de os.listdir, nao de glob sobre o caminho absoluto.
    names = sorted(n for n in os.listdir(OUT) if n.startswith("still-") and n.endswith(".png"))
    if not names:
        print("nenhum still-*.png em out/")
        return 1

    sheets = 0
    for s in range(0, len(names), per):
        chunk = names[s : s + per]
        rows = (len(chunk) + cols - 1) // cols
        sheet = np.full(
            (rows * (CELL_H + PAD) + PAD, cols * (CELL_W + PAD) + PAD, 3),
            24,
            dtype=np.uint8,
        )
        for i, name in enumerate(chunk):
            img = cv2.imread(os.path.join(OUT, name), cv2.IMREAD_COLOR)
            if img is None:
                continue
            img = cv2.resize(img, (CELL_W, CELL_H), interpolation=cv2.INTER_AREA)
            frame_no = name.replace("still-", "").replace(".png", "").lstrip("0")
            cv2.putText(
                img, frame_no, (8, 26), cv2.FONT_HERSHEY_SIMPLEX, 0.7,
                (0, 0, 0), 4, cv2.LINE_AA,
            )
            cv2.putText(
                img, frame_no, (8, 26), cv2.FONT_HERSHEY_SIMPLEX, 0.7,
                (0, 255, 255), 1, cv2.LINE_AA,
            )
            r, c = divmod(i, cols)
            y = PAD + r * (CELL_H + PAD)
            x = PAD + c * (CELL_W + PAD)
            sheet[y : y + CELL_H, x : x + CELL_W] = img

        dest = os.path.join(OUT, f"sheet-{sheets + 1:02d}.jpg")
        cv2.imwrite(dest, sheet, [int(cv2.IMWRITE_JPEG_QUALITY), 88])
        print("ok", dest)
        sheets += 1

    print(f"DONE: {len(names)} stills -> {sheets} folhas")
    return 0


if __name__ == "__main__":
    sys.exit(main())
