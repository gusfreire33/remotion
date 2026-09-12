"""Measure the FW2 preview against this source, by channel and time window."""
from pathlib import Path
import importlib.util
import json
import shutil
import subprocess
import numpy as np

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / 'out' / 'reels30'
PREVIEW = OUT / 'Reels30-Framework2-PREVIA.mp4'
spec = importlib.util.spec_from_file_location('measure', ROOT / 'scripts' / 'measure-audio.py')
measure = importlib.util.module_from_spec(spec)
spec.loader.exec_module(measure)
results = []
for start, duration in [(0,8.7),(8.7,7.4),(16.1,5.4)]:
    mix = measure.wav(str(PREVIEW),str(OUT/'mix-measure.wav'),start,duration)
    voice = measure.wav(str(ROOT/'public'/'reels30'/'source1080.mp4'),str(OUT/'voice-measure.wav'),start,duration)
    mix_peaks = np.abs(mix).max(axis=0)
    voice_peaks = np.abs(voice).max(axis=0)
    ratio = mix_peaks / voice_peaks
    clipping = int((np.abs(mix)>=.999).sum())
    result = dict(start=start,duration=duration,mix_peaks=mix_peaks.tolist(),voice_peaks=voice_peaks.tolist(),ratio=ratio.tolist(),clipping=clipping)
    results.append(result)
    print(json.dumps(result),flush=True)
    assert np.all(ratio<=1.10) and clipping==0, 'SFX mix exceeds framework limits'
(OUT/'audio-qa.json').write_text(json.dumps(results,indent=2),encoding='utf-8')
target = Path(r'C:\Users\Gustavo\Downloads\Reels 30 - Framework 2 - PREVIA.mp4')
if target.exists():
    raise FileExistsError(f'Review existing delivery before replacing: {target}')
shutil.copy2(PREVIEW,target)
print(f'DELIVERED PREVIEW: {target}',flush=True)
# Start Studio detached with literal paths (Start-Process expands [WD]).
with open(OUT/'studio.log','wb') as log,open(OUT/'studio-error.log','wb') as err:
    proc = subprocess.Popen([shutil.which('node'),str(ROOT/'node_modules'/'@remotion'/'cli'/'remotion-cli.js'),'studio','--port=3005','--no-open'],
        cwd=ROOT,stdout=log,stderr=err,stdin=subprocess.DEVNULL,creationflags=subprocess.CREATE_NO_WINDOW)
print(f'STUDIO PID: {proc.pid}',flush=True)
