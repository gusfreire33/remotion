"""Validate and deliver the approved 4K master."""
from pathlib import Path
import hashlib
import importlib.util
import json
import shutil
import subprocess
import numpy as np
from PIL import Image, ImageDraw

ROOT=Path(__file__).resolve().parent.parent
OUT=ROOT/'out'/'reels30'
FINAL=OUT/'Reels30-Framework2-FINAL-4K.mp4'
info=json.loads(subprocess.check_output(['ffprobe','-v','error','-show_streams','-show_format','-of','json',str(FINAL)]))
video=next(s for s in info['streams'] if s['codec_type']=='video')
audio=next(s for s in info['streams'] if s['codec_type']=='audio')
assert (video['width'],video['height'],video['r_frame_rate'],int(video['nb_frames']))==(2160,3840,'30/1',645)
assert abs(float(video['duration'])-21.5)<.001
assert audio['channels']==2 and abs(float(audio['duration'])-21.5)<.1
spec=importlib.util.spec_from_file_location('measure',ROOT/'scripts'/'measure-audio.py')
measure=importlib.util.module_from_spec(spec)
spec.loader.exec_module(measure)
windows=[]
for start,duration in [(0,8.7),(8.7,7.4),(16.1,5.4)]:
    mix=measure.wav(str(FINAL),str(OUT/'final-mix-measure.wav'),start,duration)
    voice=measure.wav(str(ROOT/'sources'/'reels30_src.mp4'),str(OUT/'final-voice-measure.wav'),start,duration)
    peaks=np.abs(mix).max(axis=0)
    ratio=peaks/np.abs(voice).max(axis=0)
    clipping=int((np.abs(mix)>=.999).sum())
    assert np.all(ratio<=1.10) and clipping==0
    row=dict(start=start,duration=duration,peaks=peaks.tolist(),ratio=ratio.tolist(),clipping=clipping)
    windows.append(row)
    print(json.dumps(row),flush=True)
frames=[38,112,168,231,281,358,417,526,628,643]
sheet=Image.new('RGB',(270*5,480*2))
for i,frame in enumerate(frames):
    raw=subprocess.check_output(['ffmpeg','-v','error','-ss',str(frame/30),'-i',str(FINAL),'-frames:v','1','-vf','scale=270:480','-pix_fmt','rgb24','-f','rawvideo','pipe:1'])
    image=Image.frombytes('RGB',(270,480),raw)
    d=ImageDraw.Draw(image)
    d.text((8,8),f'{frame/30:.2f}s',fill='white',stroke_width=2,stroke_fill='black')
    sheet.paste(image,((i%5)*270,(i//5)*480))
sheet.save(OUT/'final-contact.jpg',quality=93)
target=Path(r'C:\Users\Gustavo\Downloads\Reels 30 - Framework 2 - FINAL 4K.mp4')
if target.exists():raise FileExistsError(target)
shutil.copy2(FINAL,target)
digest=lambda p:hashlib.file_digest(open(p,'rb'),'sha256').hexdigest()
assert digest(FINAL)==digest(target)
report=dict(width=video['width'],height=video['height'],fps=video['r_frame_rate'],frames=645,duration=video['duration'],bytes=target.stat().st_size,audio_windows=windows,sha256=digest(target),delivered=str(target))
(OUT/'final-qa.json').write_text(json.dumps(report,indent=2),encoding='utf-8')
print(json.dumps(report,indent=2),flush=True)
