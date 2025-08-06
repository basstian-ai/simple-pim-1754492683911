# simple-pim-1754492683911


Returner KUN et gyldig JSON-objekt uten kodeblokker (ingen ```), ingen forklarende tekst eller kommentarer. Objektets nøkler skal være filbaner og verdiene filinnhold.
Eksempel:
{
  "pages/index.js": "// next.js komponent",
  "package.json": "{...}"
}

Lag en enkel Next.js PIM-applikasjon hvor man kan:
- legge inn produktdata (navn, beskrivelse, pris)
- vise produktene offentlig
- lagre data i lokal JSON-fil (ingen database)
Inkluder filer som:
- pages/index.js
- pages/admin.js
- pages/api/products/index.js
- data/products.json (tom array)
- .gitignore
- package.json
