#!/usr/bin/env bash
# Startet die drei Stub-Aufgaben parallel oder gibt die Prompts aus.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$ROOT"

usage() {
  cat <<EOF
Usage: $0 [--print|--pi|--files]
  --print  Prompts 01–03 nacheinander auf stdout (Default)
  --files  Pfade der Prompt-Dateien
  --pi     drei pi-Sessions im Hintergrund (braucht 'pi' im PATH)
EOF
}

mode="${1:---print}"

prompts=(
  "$DIR/01-sim-dreiecke.md"
  "$DIR/02-sim-tangram.md"
  "$DIR/03-sim-rover.md"
)

case "$mode" in
  -h|--help) usage; exit 0 ;;
  --files)
    printf '%s\n' "${prompts[@]}"
    echo "$DIR/04-glue.md  # erst danach"
    ;;
  --pi)
    if ! command -v pi >/dev/null 2>&1; then
      echo "pi nicht im PATH. Prompts liegen in $DIR" >&2
      exit 1
    fi
    mkdir -p "$DIR/logs"
    for p in "${prompts[@]}"; do
      name="$(basename "$p" .md)"
      echo "starte $name"
      ( cd "$ROOT" && pi --print < "$p" ) > "$DIR/logs/$name.log" 2>&1 &
      echo $! > "$DIR/logs/$name.pid"
    done
    echo "PIDs in $DIR/logs/*.pid — Glue erst nach allen dreien: $DIR/04-glue.md"
    ;;
  --print|*)
    for p in "${prompts[@]}"; do
      echo "========== $(basename "$p") =========="
      cat "$p"
      echo
    done
    echo "========== DANACH =========="
    echo "Siehe $DIR/04-glue.md"
    ;;
esac
