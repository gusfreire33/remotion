"""ElevenLabs TTS with timestamps.
usage: python tts.py <text_file> <out_prefix> [voice_id] [model]
writes <out_prefix>.mp3 and <out_prefix>.align.json
"""
import json, sys, base64, urllib.request, os, re

ENV = r"D:\CLAUDECODE-Projetos\PROJETOS - Claude code\[WD] Asmodel.tech\.env.local"
env = {}
for line in open(ENV, encoding="utf-8", errors="ignore"):
    m = re.match(r"^\s*([A-Z0-9_]+)\s*=\s*(.*)$", line)
    if m:
        env[m.group(1)] = m.group(2).strip().strip('"').strip("'")

text_file, out = sys.argv[1], sys.argv[2]
voice = sys.argv[3] if len(sys.argv) > 3 and sys.argv[3] != "-" else env["ELEVENLABS_VOICE_ID"]
model = sys.argv[4] if len(sys.argv) > 4 else "eleven_multilingual_v2"
text = open(text_file, encoding="utf-8").read().strip()
prev = sys.argv[5] if len(sys.argv) > 5 else None
nxt = sys.argv[6] if len(sys.argv) > 6 else None

body = {
    "text": text,
    "model_id": model,
    "voice_settings": {"stability": 0.5, "similarity_boost": 0.8, "style": 0.25, "use_speaker_boost": True, "speed": 1.0},
}
if prev:
    body["previous_text"] = prev
if nxt:
    body["next_text"] = nxt
req = urllib.request.Request(
    f"https://api.elevenlabs.io/v1/text-to-speech/{voice}/with-timestamps?output_format=mp3_44100_128",
    data=json.dumps(body, ensure_ascii=False).encode("utf-8"),
    headers={"xi-api-key": env["ELEVENLABS_API_KEY"], "Content-Type": "application/json; charset=utf-8"},
    method="POST",
)
try:
    resp = urllib.request.urlopen(req, timeout=300).read()
except urllib.error.HTTPError as e:
    print("HTTP", e.code, e.read()[:500].decode("utf-8", "ignore"))
    sys.exit(1)
d = json.loads(resp)
open(out + ".mp3", "wb").write(base64.b64decode(d["audio_base64"]))
json.dump(d["alignment"], open(out + ".align.json", "w", encoding="utf-8"), ensure_ascii=False)
print("ok", out, len(text), "chars,", round(d["alignment"]["character_end_times_seconds"][-1], 2), "s")
