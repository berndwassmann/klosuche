#!/bin/bash
set -e

export PATH="/Users/bernd.wassmann/.npm-global/bin:$PATH"

CURRENT_BRANCH=$(git branch --show-current)

echo "🔍 Aktueller Branch: $CURRENT_BRANCH"

# Sicherheitscheck: nur von test oder main aus deployen
if [ "$CURRENT_BRANCH" != "test" ] && [ "$CURRENT_BRANCH" != "main" ]; then
  echo "❌ Bitte erst auf den 'test' oder 'main' Branch wechseln."
  exit 1
fi

# Von test-Branch: erst nach main mergen
if [ "$CURRENT_BRANCH" = "test" ]; then
  echo "🔀 Merge test → main..."
  git checkout main
  git merge test --no-edit
fi

echo "📦 Committe offene Änderungen (falls vorhanden)..."
if ! git diff --quiet || ! git diff --cached --quiet; then
  git add -A
  git commit -m "prod: $(date '+%Y-%m-%d %H:%M')"
fi

echo "⬆️  Push auf GitHub..."
git push origin main

echo "🚀 Deploye auf Produktion..."
vercel --prod --yes

echo ""
echo "✅ Produktion erfolgreich deployed!"
echo "🌐 https://klosuche.vercel.app"

# Zurück auf test-Branch
git checkout test
echo "🔀 Zurück auf test-Branch"
