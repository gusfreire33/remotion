"""Assets 4K pro render final de um Reels do Framework 2 (mesma receita do Reels 30).

    python scripts/prepare-fw2-4k.py 32 1182

Gera public/reels<N>/source4k.mp4 (cópia da fonte) e public/reels<N>/matte4k.webm:
o MESMO alfa aprovado no proxy (public/reels<N>/matte.webm), ampliado pra 2160x3840
e casado com o RGB da fonte 4K — em vez de ampliar o proxy 1080p.
Usa o ffmpeg do PATH (o do Remotion é --disable-filters).
"""
import shutil
import subprocess
import sys
from pathlib import Path

n = sys.argv[1]
frames = sys.argv[2]
ROOT = Path(__file__).resolve().parent.parent
ASSETS = ROOT / "public" / f"reels{n}"
source = ASSETS / "source4k.mp4"
matte = ASSETS / "matte4k.webm"
if not source.exists():
    shutil.copy2(ROOT / "sources" / f"reels{n}_src.mp4", source)
    print("source4k copiado", flush=True)
if not matte.exists():
    subprocess.run(
        [
            "ffmpeg", "-hide_banner", "-nostats", "-loglevel", "warning", "-n",
            "-i", str(source),
            "-c:v", "libvpx-vp9", "-i", str(ASSETS / "matte.webm"),
            "-filter_complex_threads", "4",
            "-filter_complex",
            "[1:v]alphaextract,scale=2160:3840:flags=lanczos[alpha];[0:v][alpha]alphamerge[fg]",
            "-map", "[fg]", "-an",
            "-c:v", "libvpx-vp9", "-pix_fmt", "yuva420p", "-auto-alt-ref", "0",
            "-b:v", "0", "-crf", "24", "-g", "10", "-keyint_min", "10",
            "-row-mt", "1", "-threads", "8", "-cpu-used", "6", "-tile-columns", "2",
            "-frames:v", frames, str(matte),
        ],
        check=True,
    )
print("4K SOURCE + MATTE PRONTOS", flush=True)
