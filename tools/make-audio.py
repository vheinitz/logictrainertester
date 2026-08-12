#!/usr/bin/env python3
"""
Erzeugt die Sprachaufnahmen: Ziffern, Ansage, Wörter, Kofferdinge.

Ausgabe: dist/audio-de.js und dist/audio-ru.js – je Sprache eine Datei, die
per <script> in index.html eingebunden wird und window.LOGIK_AUDIO füllt.

Warum eigene Dateien statt im Bundle:
  * Das App-Bundle bleibt klein und ändert sich unabhängig von den Aufnahmen.
  * Der Browser lädt beide parallel und hält sie getrennt im Cache.
  * Weil sie fest in index.html stehen, werden sie beim Speichern der Seite
    mitgeladen – die App bleibt offline vollständig. Beim Nachladen erst im
    Test wäre das nicht so.
  * Klassische <script>-Dateien funktionieren auch per Doppelklick von
    file://, wo fetch und ES-Module blockiert sind.

Warum vorab erzeugt und nicht zur Laufzeit gesprochen:
Die Web-Speech-API klingt auf jedem Gerät anders und startet zeitlich nicht
planbar. Für eine Merkspanne muss jedes Wort im selben Takt kommen, sonst
misst man das Gerät statt das Kind.

Aufnahmetechnik: langsam sprechen, schonend schneiden, ein- und ausblenden,
10 ms Stille-Polster. Ohne das begannen kurze russische Clips mit bis zu 15 %
Amplitude – bei jedem Wort ein hörbares Knacken.

Voraussetzungen: piper-tts mit lokalen Stimmen, ffmpeg mit libmp3lame.
Aufruf:  python3 tools/make-audio.py [--nur de|ru]
"""
import base64
import json
import os
import re
import struct
import subprocess
import sys
import tempfile
import wave

VOICE_DIR = os.path.expanduser("~/.greetmate/piper_voices")

# Mittlere Modellgröße: bei einzelnen Wörtern entscheidet die
# Verständlichkeit über das Messergebnis. length_scale > 1 = langsamer.
# Die russische Stimme läuft von Haus aus deutlich schneller als die deutsche.
VOICES = {
    "de": {"model": "de_DE-thorsten-medium.onnx", "length_scale": 1.15},
    "ru": {"model": "ru_RU-dmitri-medium.onnx",   "length_scale": 1.45},
}

DIGITS = {
    "de": ["null", "eins", "zwei", "drei", "vier",
           "fünf", "sechs", "sieben", "acht", "neun"],
    "ru": ["ноль", "один", "два", "три", "четыре",
           "пять", "шесть", "семь", "восемь", "девять"],
}

# Ansage vor einer Folge: gibt ein Startsignal, statt dass das erste Element
# aus dem Nichts kommt – genau das ginge am ehesten verloren.
LEADIN = {"de": "Wiederhole:", "ru": "Повтори:"}

WORDLISTS = "src/data/wordlists.json"
OUTDIR = "dist"

TRIM_FADE = (
    "silenceremove=start_periods=1:start_silence=0.05:start_threshold=-55dB,"
    "areverse,"
    "silenceremove=start_periods=1:start_silence=0.08:start_threshold=-55dB,"
    "areverse,"
    "afade=t=in:d=0.015,"
    "areverse,afade=t=in:d=0.045,areverse,"
    "adelay=10,apad=pad_dur=0.03"
)


def synth(voice, text, path, length_scale):
    from piper import SynthesisConfig
    with wave.open(path, "wb") as w:
        voice.synthesize_wav(text, w, syn_config=SynthesisConfig(length_scale=length_scale))


def peak_db(path):
    out = subprocess.run(["ffmpeg", "-i", path, "-af", "volumedetect", "-f", "null", "-"],
                         capture_output=True, text=True).stderr
    m = re.search(r"max_volume: (-?[\d.]+) dB", out)
    return float(m.group(1)) if m else 0.0


def process(src_wav, dst_mp3, target_db=-3.0):
    with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as tf:
        stage = tf.name
    try:
        subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", src_wav,
                        "-af", TRIM_FADE, "-ac", "1", "-ar", "22050", stage], check=True)
        gain = target_db - peak_db(stage)
        subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", stage,
                        "-af", f"volume={gain:.2f}dB",
                        "-ac", "1", "-ar", "22050", "-b:a", "48k", dst_mp3], check=True)
    finally:
        os.unlink(stage)


def duration_ms(path):
    out = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration",
                          "-of", "default=nw=1:nk=1", path],
                         capture_output=True, text=True, check=True)
    return int(round(float(out.stdout.strip()) * 1000))


def edge_amplitude(path):
    """Höchste Amplitude in den ersten/letzten 5 ms (0..1). 0 = kein Knacken."""
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", path, "-f", "s16le",
                          "-ac", "1", "-ar", "22050", "-"], capture_output=True).stdout
    n = len(raw) // 2
    if n < 300:
        return 1.0
    s = struct.unpack(f"<{n}h", raw[:n * 2])
    return max(max(abs(x) for x in s[:110]), max(abs(x) for x in s[-110:])) / 32768.0


def main():
    try:
        from piper import PiperVoice
    except ImportError:
        sys.exit("piper-tts fehlt:  pip install piper-tts")

    nur = None
    if "--nur" in sys.argv:
        nur = sys.argv[sys.argv.index("--nur") + 1]

    listen = json.load(open(WORDLISTS, encoding="utf-8"))
    os.makedirs(OUTDIR, exist_ok=True)

    for lang, spec in VOICES.items():
        if nur and lang != nur:
            continue
        model = os.path.join(VOICE_DIR, spec["model"])
        if not os.path.exists(model):
            sys.exit(f"Stimme fehlt: {model}")
        print(f"\n{lang}: {spec['model']}  (Tempo ×{spec['length_scale']})")
        voice = PiperVoice.load(model)

        # Was gesprochen wird: Schlüssel → Text
        aufgaben = {}
        for n, w in enumerate(DIGITS[lang]):
            aufgaben[f"d{n}"] = w
        aufgaben["lead"] = LEADIN[lang]
        for e in listen["words"]:
            aufgaben["w:" + e["de"]] = e[lang]
        for e in listen["items"]:
            aufgaben["i:" + e["key"]] = e[lang]

        clips, meta = {}, {}
        roh = 0
        schlimmster = 0.0
        with tempfile.TemporaryDirectory() as tmp:
            for i, (key, text) in enumerate(aufgaben.items(), 1):
                wav = os.path.join(tmp, "a.wav")
                mp3 = os.path.join(tmp, "a.mp3")
                synth(voice, text, wav, spec["length_scale"])
                process(wav, mp3)
                data = open(mp3, "rb").read()
                roh += len(data)
                rand = edge_amplitude(mp3)
                schlimmster = max(schlimmster, rand)
                clips[key] = base64.b64encode(data).decode("ascii")
                meta[key] = {"text": text, "ms": duration_ms(mp3)}
                if i % 15 == 0 or i == len(aufgaben):
                    print(f"    {i}/{len(aufgaben)} …")

        if schlimmster > 0.02:
            sys.exit(f"Abbruch: Clips beginnen/enden bei bis zu {schlimmster*100:.1f} % "
                     f"Amplitude – das knackt hörbar.")

        pfad = os.path.join(OUTDIR, f"audio-{lang}.js")
        with open(pfad, "w", encoding="utf-8") as f:
            f.write(f"""/* ERZEUGTE DATEI - nicht von Hand bearbeiten.
   Neu erzeugen mit:  python3 tools/make-audio.py
   Stimme: {spec['model']} (piper, offline), MP3 mono 22,05 kHz / 48 kbit.
   {len(clips)} Aufnahmen, groesste Randamplitude {schlimmster*100:.2f} %.
   Wird per <script> aus index.html geladen, damit die App auch von file://
   laeuft und beim Speichern der Seite vollstaendig bleibt. */
window.LOGIK_AUDIO = window.LOGIK_AUDIO || {{}};
window.LOGIK_AUDIO[{lang!r}] = {{
 meta: {json.dumps(meta, ensure_ascii=False)},
 clips: {json.dumps(clips, ensure_ascii=False)}
}};
""")
        kb = os.path.getsize(pfad) / 1024
        print(f"  {pfad}  {kb:.0f} kB  ({len(clips)} Aufnahmen, Audio roh {roh/1024:.0f} kB, "
              f"Rand max {schlimmster*100:.2f} %)")


if __name__ == "__main__":
    main()
