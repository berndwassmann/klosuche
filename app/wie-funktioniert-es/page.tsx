export default function WieFunktioniertEsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Wie funktioniert KloSuche?</h1>
        <p className="text-gray-500 mb-8">Alles was du wissen musst, um die App optimal zu nutzen.</p>

        <div className="space-y-4">
          {[
            {
              icon: "🗺️",
              title: "Toiletten auf der Karte finden",
              text: "Auf der Startseite siehst du alle eingetragenen öffentlichen Toiletten in München als Marker auf der Karte. Klicke auf einen Marker um eine Kurzübersicht zu sehen.",
            },
            {
              icon: "🔍",
              title: "Suche verwenden",
              text: "Mit der Suchleiste links kannst du nach Name oder Adresse filtern. Die Liste und die Karte aktualisieren sich automatisch in Echtzeit.",
            },
            {
              icon: "📍",
              title: "Details ansehen",
              text: "Klicke auf einen Listeneintrag oder im Popup auf 'Details ansehen', um alle Informationen zu einer Toilette zu sehen — inklusive Öffnungszeiten, Barrierefreiheit und Bewertungen.",
            },
            {
              icon: "⭐",
              title: "Bewertungen",
              text: "Jede Toilette kann von Nutzern bewertet werden. Die durchschnittliche Bewertung wird in der Liste und auf der Karte angezeigt.",
            },
            {
              icon: "♿",
              title: "Barrierefreiheit & Kosten",
              text: "Toiletten sind mit Badges markiert ob sie barrierefrei zugänglich und ob sie kostenlos sind.",
            },
          ].map((item) => (
            <div key={item.title} className="bg-white rounded-2xl shadow-sm p-5 flex gap-4">
              <div className="text-3xl">{item.icon}</div>
              <div>
                <h2 className="font-semibold text-gray-900 mb-1">{item.title}</h2>
                <p className="text-gray-500 text-sm leading-relaxed">{item.text}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 bg-blue-50 rounded-2xl p-5 text-center">
          <p className="text-blue-700 font-medium">Einen Eintrag vermissen?</p>
          <p className="text-blue-600 text-sm mt-1">
            Schreib uns über das{" "}
            <a href="/feedback" className="underline font-medium">Feedback-Formular</a>
            {" "}— wir tragen ihn gerne ein.
          </p>
        </div>
      </div>
    </div>
  );
}
