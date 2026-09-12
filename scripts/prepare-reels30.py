"""Ingest the supplied Reels, preserving its existing word-level transcription."""
from pathlib import Path
import json
import shutil
import subprocess

ROOT = Path(__file__).resolve().parent.parent
SOURCE = Path(r'C:\Users\Gustavo\Downloads\Reels 30 Pre editado.mp4')
TRANSCRIPT = Path(r'C:\Users\Gustavo\AppData\Local\Temp\opencode\reels_transcript.json')
ASSETS = ROOT / 'public' / 'reels30'
DATA = ROOT / 'src' / 'reels30' / 'data'
for folder in [ASSETS, DATA, ROOT / 'out' / 'reels30']:
    folder.mkdir(parents=True, exist_ok=True)
target = ROOT / 'sources' / 'reels30_src.mp4'
if not target.exists():
    shutil.copy2(SOURCE, target)
proxy = ASSETS / 'source1080.mp4'
if not proxy.exists():
    subprocess.run(['ffmpeg', '-v', 'error', '-n', '-i', str(target), '-vf', 'scale=1080:1920:flags=lanczos',
                    '-c:v', 'libx264', '-crf', '18', '-preset', 'fast', '-c:a', 'aac', '-b:a', '192k',
                    '-movflags', '+faststart', str(proxy)], check=True)
audio = ROOT / 'out' / 'reels30' / 'audio16k.wav'
subprocess.run(['ffmpeg','-v','error','-y','-i',str(target),'-vn','-ar','16000','-ac','1','-c:a','pcm_s16le',str(audio)], check=True)
segments = json.loads(TRANSCRIPT.read_text(encoding='utf-8'))
words = [dict(text=w['word'].strip(), startMs=round(w['start']*1000), endMs=round(w['end']*1000), confidence=1)
         for segment in segments for w in segment['words']]
# Sentence boundary: the existing transcript used a comma between these clauses.
words[5]['text'] = 'apostam.'
words[6]['text'] = 'Quando'
# These pauses are sentence/phrase boundaries, not a new spoken word. They
# prevent caption pages from leaking "isso"/"chegando" into the previous line.
words[19]['text'] = 'negócio.'
words[32]['text'] = 'sistema.'
words[48]['text'] = 'qualificados.'
assert len(words) == 52
assert words[-1]['endMs'] <= 21500
(ASSETS / 'words.json').write_text(json.dumps(words, ensure_ascii=False, indent=2), encoding='utf-8')
(DATA / 'words.ts').write_text('// Word timings from the supplied Reels (faster-whisper small, pt).\n'
    'import type { Word } from "../../data/words";\n'
    'export const WORDS: Word[] = ' + json.dumps(words, ensure_ascii=False) + ';\n', encoding='utf-8')
print(' '.join(w['text'] for w in words))
print(f'INGESTED: {proxy}')
