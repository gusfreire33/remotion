"""
WONNE MAX VSL — junta os blocos de narração do ElevenLabs (mp3 + alinhamento
por caractere) numa trilha única e gera src/wmvsl/data/words.ts.

O alinhamento do ElevenLabs é a VERDADE da minutagem (PLAYBOOK-2 Etapa 4:
o texto entra junto com a palavra saindo da boca) — não precisa de Whisper.

uso: python scripts/wmvsl-build-words.py <dir_com_blocos> [gap_s]
  <dir>/NN.mp3 + <dir>/NN.align.json  (NN = 01, 02, ...)
  saída: public/wmvsl/narracao.wav, src/wmvsl/data/words.ts, src/wmvsl/data/blocks.ts
"""
import json, os, subprocess, sys, glob, wave

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
src_dir = sys.argv[1]
GAP = float(sys.argv[2]) if len(sys.argv) > 2 else 0.35
TEMPO = float(sys.argv[3]) if len(sys.argv) > 3 else 1.0  # atempo (timestamps reescalados)
LEAD = 0.6  # respiro antes da primeira palavra
FFMPEG = "ffmpeg"

blocks = sorted(glob.glob(os.path.join(src_dir, "[0-9][0-9].mp3")))
out_dir = os.path.join(ROOT, "public", "wmvsl")
os.makedirs(out_dir, exist_ok=True)
tmp = os.path.join(out_dir, "_tmp")
os.makedirs(tmp, exist_ok=True)

words = []
block_meta = []
t0 = LEAD
wavs = []
for i, mp3 in enumerate(blocks):
    base = mp3[:-4]
    al = json.load(open(base + ".align.json", encoding="utf-8"))
    chars = al["characters"]
    st = [x / TEMPO for x in al["character_start_times_seconds"]]
    en = [x / TEMPO for x in al["character_end_times_seconds"]]
    wav = os.path.join(tmp, f"{i:02d}.wav")
    subprocess.run([FFMPEG, "-y", "-loglevel", "error", "-i", mp3, "-filter:a", f"atempo={TEMPO}", "-ar", "48000", "-ac", "2", wav], check=True)
    with wave.open(wav) as w:
        dur = w.getnframes() / w.getframerate()
    # palavras: sequências sem espaço
    cur = ""
    cs = None
    ce = None
    for c, a, b in zip(chars, st, en):
        if c.isspace():
            if cur:
                words.append({"text": cur, "startMs": round((t0 + cs) * 1000), "endMs": round((t0 + ce) * 1000), "block": i + 1})
                cur = ""
            continue
        if not cur:
            cs = a
        cur += c
        ce = b
    if cur:
        words.append({"text": cur, "startMs": round((t0 + cs) * 1000), "endMs": round((t0 + ce) * 1000), "block": i + 1})
    # fim real da fala neste bloco (descarta silêncio de cauda além de 0.15s)
    speech_end = en[-1] if en else dur
    use = min(dur, speech_end + 0.15)
    block_meta.append({"block": i + 1, "start": round(t0, 3), "end": round(t0 + use, 3)})
    wavs.append((wav, t0, use))
    t0 += use + GAP

total = t0 + 1.2
# monta a trilha: silêncio + blocos posicionados (adelay)
inputs = []
filt = []
for k, (wav, at, use) in enumerate(wavs):
    inputs += ["-i", wav]
    ms = int(round(at * 1000))
    filt.append(f"[{k}:a]atrim=0:{use:.3f},afade=t=out:st={max(0, use - 0.06):.3f}:d=0.06,adelay={ms}|{ms}[a{k}]")
mix = "".join(f"[a{k}]" for k in range(len(wavs)))
filt.append(f"{mix}amix=inputs={len(wavs)}:normalize=0,apad=whole_dur={total:.3f}[out]")
out_wav = os.path.join(out_dir, "narracao.wav")
subprocess.run([FFMPEG, "-y", "-loglevel", "error", *inputs, "-filter_complex", ";".join(filt), "-map", "[out]", "-ar", "48000", "-ac", "2", out_wav], check=True)

data_dir = os.path.join(ROOT, "src", "wmvsl", "data")
os.makedirs(data_dir, exist_ok=True)
with open(os.path.join(data_dir, "words.ts"), "w", encoding="utf-8") as f:
    f.write("// GERADO por scripts/wmvsl-build-words.py — não edite à mão.\n")
    f.write("// Minutagem = alinhamento por caractere do ElevenLabs (narração IA).\n")
    f.write("export type Word = { text: string; startMs: number; endMs: number; block: number };\n\n")
    f.write("export const WORDS: Word[] = " + json.dumps(words, ensure_ascii=False) + ";\n")
with open(os.path.join(data_dir, "blocks.ts"), "w", encoding="utf-8") as f:
    f.write("// GERADO por scripts/wmvsl-build-words.py — não edite à mão.\n")
    f.write(f"export const AUDIO_DURATION_S = {total:.3f};\n")
    f.write("export const BLOCKS = " + json.dumps(block_meta) + ";\n")
print(f"{len(blocks)} blocos, {len(words)} palavras, {total:.2f}s")
