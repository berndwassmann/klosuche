export default function ImpressumPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">Impressum</h1>

        <div className="bg-white rounded-2xl shadow-sm p-6 space-y-6 text-sm text-gray-600 leading-relaxed">
          <div>
            <h2 className="font-semibold text-gray-900 mb-2">Angaben gemäß § 5 TMG</h2>
            <p>
              [Dein Name / Firmenname]<br />
              [Straße Hausnummer]<br />
              [PLZ Ort]
            </p>
          </div>

          <div>
            <h2 className="font-semibold text-gray-900 mb-2">Kontakt</h2>
            <p>
              E-Mail: [deine@email.de]
            </p>
          </div>

          <div>
            <h2 className="font-semibold text-gray-900 mb-2">Haftungsausschluss</h2>
            <p>
              Die Informationen auf dieser Website werden mit größtmöglicher Sorgfalt gepflegt. Dennoch können wir keine Gewähr für die Richtigkeit, Vollständigkeit und Aktualität der Angaben übernehmen. Die Nutzung der Website erfolgt auf eigene Gefahr.
            </p>
          </div>

          <div>
            <h2 className="font-semibold text-gray-900 mb-2">Datenschutz</h2>
            <p>
              Diese Website verwendet keine Cookies zu Trackingzwecken. Die Kartenanzeige erfolgt über OpenStreetMap (openstreetmap.org). Es werden keine personenbezogenen Daten ohne Einwilligung gespeichert oder weitergegeben.
            </p>
          </div>

          <div>
            <h2 className="font-semibold text-gray-900 mb-2">Kartenmaterial</h2>
            <p>
              Kartendaten © <a href="https://www.openstreetmap.org/copyright" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">OpenStreetMap</a>-Mitwirkende, lizenziert unter ODbL.
            </p>
          </div>
        </div>

        <p className="text-xs text-gray-400 mt-4 text-center">
          Bitte ersetze die Platzhalter in eckigen Klammern mit deinen echten Angaben.
        </p>
      </div>
    </div>
  );
}
