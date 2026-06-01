#!/bin/bash
set -e

export PATH="/Users/bernd.wassmann/.npm-global/bin:$PATH"

echo "🔀 Wechsle auf test-Branch..."
git checkout test

echo "📦 Committe offene Änderungen (falls vorhanden)..."
if ! git diff --quiet || ! git diff --cached --quiet; then
  git add -A
  git commit -m "test: $(date '+%Y-%m-%d %H:%M')"
fi

echo "⬆️  Push auf GitHub..."
git push origin test

echo "🚀 Deploye auf Test-Umgebung..."
DEPLOY_URL=$(vercel --yes 2>&1 | grep -o 'https://klosuche-[a-z0-9]*-bernd-wassmann-s-projects\.vercel\.app' | head -1)

if [ -z "$DEPLOY_URL" ]; then
  echo "❌ Kein Deployment-URL gefunden."
  exit 1
fi

echo "🔗 Setze Alias test-klosuche.vercel.app → $DEPLOY_URL"
vercel alias "$DEPLOY_URL" test-klosuche.vercel.app

echo ""
echo "✅ Test-Deployment fertig!"
echo "🌐 https://test-klosuche.vercel.app"
