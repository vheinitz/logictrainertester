#!/usr/bin/env python3
"""
Erzeugt die Sprachdateien für die Zahlenfolgen-Variante mit Ansage.

Warum vorab erzeugt und nicht zur Laufzeit gesprochen:
Die Web-Speech-API (`speechSynthesis`) klingt auf jedem Gerät anders, ist
nicht überall vorhanden und – entscheidend – zeitlich nicht planbar. Für einen
Merkspannen-Test muss jede Ziffer exakt im selben Takt kommen; schon ein
schwankender Sprechbeginn verändert, was gemessen wird.

Warum eingebettet statt als Dateien daneben:
Die App soll per Doppelklick von `file://` laufen. Dort blockiert der Browser
`fetch`/XHR, also auch `decodeAudioData` auf nachgeladene Dateien.

── Warum die Ziffern einzeln erzeugt werden ──────────────────────────────
Naheliegend wäre, die ganze Folge als einen Satz sprechen zu lassen. Das geht
nicht: die Folge wird pro Runde zufällig gewürfelt, es gibt also nichts
Festes zu erzeugen. Ein Versuch, eine Komma-Liste zu sprechen und an den
Pausen zu schneiden, scheitert außerdem an der russischen Stimme – sie spricht
zehn Ziffern in 2,7 s ohne hörbare Pause an den Kommas.

Abgehackt klang das Ergebnis aus einem anderen Grund, der messbar war: der
Stille-Schnitt bei -45 dB hat in die Wortanfänge geschnitten. Die russischen
Clips begannen mit bis zu 15 % Amplitude statt bei null – bei jeder Ziffer ein
Knacken. Deshalb jetzt:

  * langsamer sprechen (length_scale), damit kurze Wörter Kontur bekommen
  * schonend schneiden (-55 dB) und Reste bewusst stehen lassen
  * kurz ein- und ausblenden, damit jeder Clip garantiert bei null beginnt
  * Pegel über den Spitzenwert angleichen statt über loudnorm, das bei
    Clips unter einer Sekunde unzuverlässig arbeitet

Erzeugt: src/data/audio-digits.js   (wird eingecheckt)

Voraussetzungen: piper-tts mit lokalen Stimmen, ffmpeg mit libmp3lame.
Aufruf:  python3 tools/make-audio.py
"""
import base64
import json
import os
import re
import subprocess
import sys
import tempfile
import wave

VOICE_DIR = os.path.expanduser("~/.greetmate/piper_voices")

# Mittlere Modellgröße bewusst gewählt: bei Ziffern entscheidet die
# Verständlichkeit über das Messergebnis. Wer "zwei" für "drei" hört,
# produziert einen Fehler, den das Kind nicht gemacht hat.
#
# length_scale > 1 bedeutet langsamer. Die russische Stimme läuft von Haus aus
# deutlich schneller als die deutsche (2,7 s für zehn Ziffern gegenüber 6,2 s)
# und braucht darum mehr Dehnung.
VOICES = {
    "de": {"model": "de_DE-thorsten-medium.onnx", "length_scale": 1.15},
    "ru": {"model": "ru_RU-dmitri-medium.onnx",   "length_scale": 1.45},
}

WORDS = {
    "de": ["null", "eins", "zwei", "drei", "vier",
           "fünf", "sechs", "sieben", "acht", "neun"],
    "ru": ["ноль", "один", "два", "три", "четыре",
           "пять", "шесть", "семь", "восемь", "девять"],
}

# Ansage vor der Folge: gibt dem Kind ein Startsignal, statt dass die erste
# Ziffer aus dem Nichts kommt.
LEADIN = {"de": "Wiederhole:", "ru": "Повтори:"}

OUT = "src/data/audio-digits.js"

# ffmpeg-Kette: schonend trimmen, sanft ein- und ausblenden, dann polstern.
#
# Das Ausblenden über areverse/afade-in/areverse spart einen zweiten Durchlauf,
# weil man dafür sonst die Gesamtdauer vorher kennen müsste.
#
# Das Stille-Polster am Anfang ist nötig, obwohl schon eingeblendet wird: harte
# Anlaute wie das „ч" in „четыре" starteten trotz Einblendung bei 3,6 %, und
# der MP3-Kodierer machte daraus 5,1 %. Mit 10 ms echter Stille davor landet
# das Nachschwingen des Kodierers im Leeren – gemessen 0,2 %.
# Die 10 ms verschieben jede Ziffer gleich weit, der Takt bleibt also gleich.
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
    cfg = SynthesisConfig(length_scale=length_scale)
    with wave.open(path, "wb") as w:
        voice.synthesize_wav(text, w, syn_config=cfg)


def peak_db(path):
    out = subprocess.run(
        ["ffmpeg", "-i", path, "-af", "volumedetect", "-f", "null", "-"],
        capture_output=True, text=True,
    ).stderr
    m = re.search(r"max_volume: (-?[\d.]+) dB", out)
    return float(m.group(1)) if m else 0.0


def process(src_wav, dst_mp3, target_db=-3.0):
    """Trimmen, ausblenden, Pegel angleichen, als MP3 mono."""
    with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as tf:
        stage = tf.name
    try:
        subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", src_wav,
                        "-af", TRIM_FADE, "-ac", "1", "-ar", "22050", stage],
                       check=True)
        gain = target_db - peak_db(stage)
        subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", stage,
                        "-af", f"volume={gain:.2f}dB",
                        "-ac", "1", "-ar", "22050", "-b:a", "48k", dst_mp3],
                       check=True)
    finally:
        os.unlink(stage)


def duration_ms(path):
    out = subprocess.run(
        ["ffprobe", "-v", "error", "-show_entries", "format=duration",
         "-of", "default=nw=1:nk=1", path],
        capture_output=True, text=True, check=True,
    )
    return int(round(float(out.stdout.strip()) * 1000))


def edge_amplitude(path):
    """Höchste Amplitude in den ersten und letzten 5 ms (0..1). 0 = kein Knacken."""
    raw = subprocess.run(
        ["ffmpeg", "-v", "error", "-i", path, "-f", "s16le", "-ac", "1", "-ar", "22050", "-"],
        capture_output=True).stdout
    import struct
    n = len(raw) // 2
    if n < 300:
        return 1.0
    s = struct.unpack(f"<{n}h", raw[:n * 2])
    edge = max(max(abs(x) for x in s[:110]), max(abs(x) for x in s[-110:]))
    return edge / 32768.0


def main():
    try:
        from piper import PiperVoice
    except ImportError:
        sys.exit("piper-tts fehlt:  pip install piper-tts")

    data, meta, lead = {}, {}, {}
    total = 0
    worst_edge = 0.0

    with tempfile.TemporaryDirectory() as tmp:
        for lang, spec in VOICES.items():
            model = os.path.join(VOICE_DIR, spec["model"])
            if not os.path.exists(model):
                sys.exit(f"Stimme fehlt: {model}")
            print(f"  {lang}: {spec['model']}  (Tempo ×{spec['length_scale']})")
            voice = PiperVoice.load(model)
            data[lang], meta[lang] = {}, {}

            aufgaben = [(str(n), w) for n, w in enumerate(WORDS[lang])]
            aufgaben.append(("lead", LEADIN[lang]))

            for key, text in aufgaben:
                wav = os.path.join(tmp, f"{lang}{key}.wav")
                mp3 = os.path.join(tmp, f"{lang}{key}.mp3")
                synth(voice, text, wav, spec["length_scale"])
                process(wav, mp3)
                raw = open(mp3, "rb").read()
                total += len(raw)
                ms = duration_ms(mp3)
                edge = edge_amplitude(mp3)
                worst_edge = max(worst_edge, edge)
                b64 = base64.b64encode(raw).decode("ascii")
                if key == "lead":
                    lead[lang] = {"b64": b64, "word": text, "ms": ms}
                else:
                    data[lang][int(key)] = b64
                    meta[lang][int(key)] = {"word": text, "ms": ms}
                print(f"    {key:>4} {text:<12} {len(raw):>6} B  {ms:>5} ms  Rand {edge*100:4.1f}%")

    if worst_edge > 0.02:
        sys.exit(f"\nAbbruch: Clips beginnen/enden bei bis zu {worst_edge*100:.1f}% "
                 f"Amplitude – das knackt hörbar.")

    lead_b64 = {k: v["b64"] for k, v in lead.items()}
    lead_meta = {k: {"word": v["word"], "ms": v["ms"]} for k, v in lead.items()}

    header = f'''/**
 * ERZEUGTE DATEI – nicht von Hand bearbeiten.
 * Neu erzeugen mit:  python3 tools/make-audio.py
 *
 * Gesprochene Ziffern 0–9 plus Ansage, für die Zahlenfolgen-Variante mit Ton.
 * Stimmen: {", ".join(v["model"] for v in VOICES.values())} (piper, offline erzeugt)
 * Format: MP3 mono 22,05 kHz / 48 kbit, schonend getrimmt, ein- und
 * ausgeblendet, Spitzenpegel auf -3 dBFS angeglichen.
 *
 * Das Ein-/Ausblenden ist nicht Kosmetik: ohne es begannen die russischen
 * Clips mit bis zu 15 % Amplitude – bei jeder Ziffer ein hörbares Knacken.
 *
 * Eingebettet statt nachgeladen, damit die App auch von file:// läuft –
 * dort blockiert der Browser fetch und damit decodeAudioData auf Dateien.
 */

/** Sprechdauer je Ziffer in ms – die Ansage darf nicht in den Takt laufen. */
export const DIGIT_MS = {json.dumps(meta, ensure_ascii=False, indent=2)};

/** base64-MP3 je Sprache und Ziffer. */
export const DIGIT_MP3 = {json.dumps(data, ensure_ascii=False, indent=0)};

/** Ansage vor der Folge ("Wiederhole:"), je Sprache. */
export const LEAD_MS = {json.dumps(lead_meta, ensure_ascii=False, indent=2)};
export const LEAD_MP3 = {json.dumps(lead_b64, ensure_ascii=False, indent=0)};

/** Ist die Sprache vorhanden? */
export function hasDigits(lang) {{
  return Object.prototype.hasOwnProperty.call(DIGIT_MP3, lang);
}}
'''
    with open(OUT, "w", encoding="utf-8") as f:
        f.write(header)

    print(f"\n  größte Randamplitude: {worst_edge*100:.2f} %  (Grenze 2 %)")
    print(f"  {OUT}  ({os.path.getsize(OUT)/1024:.0f} kB, Audio roh {total/1024:.0f} kB)")


if __name__ == "__main__":
    main()
