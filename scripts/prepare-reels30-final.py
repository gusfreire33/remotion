"""Restore source-resolution pixels under the approved foreground mask."""
from pathlib import Path
import shutil
import subprocess

ROOT=Path(__file__).resolve().parent.parent
ASSETS=ROOT/'public'/'reels30'
source=ASSETS/'source4k.mp4'
matte=ASSETS/'matte4k.webm'
if not source.exists():
    shutil.copy2(ROOT/'sources'/'reels30_src.mp4', source)
if not matte.exists():
    # Keep the EXACT approved mask and timing, but populate foreground RGB
    # from the original 4K source instead of enlarging the 1080p proxy.
    subprocess.run(['ffmpeg','-hide_banner','-nostats','-loglevel','warning','-n',
        '-i',str(source),'-c:v','libvpx-vp9','-i',str(ASSETS/'matte.webm'),
        '-filter_complex_threads','4','-filter_complex',
        '[1:v]alphaextract,scale=2160:3840:flags=lanczos[alpha];[0:v][alpha]alphamerge[foreground]',
        '-map','[foreground]','-an','-c:v','libvpx-vp9','-pix_fmt','yuva420p',
        '-auto-alt-ref','0','-b:v','0','-crf','24','-g','10','-keyint_min','10',
        '-row-mt','1','-threads','8','-cpu-used','6','-tile-columns','2','-frames:v','645',str(matte)],check=True)
print('4K SOURCE + FOREGROUND READY',flush=True)
