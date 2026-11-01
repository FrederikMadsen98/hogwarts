# Hogwarts Course Management System

Beskrivelse af de API-ruter, der er implementeret i Hogwarts Course Management System.

Projektet er udviklet med **Node.js, Express og PostgreSQL** og anvender ES Modules (`import`/`export`).

Serveren lytter som standard på port `3000` og modtager JSON i request body. API'et er opdelt i **routes, controllers og repositories**, hvor repositories står for kommunikationen med PostgreSQL.

Fejlbeskeder returneres på engelsk, så de følger sproget i koden.

**Base URL:** `http://localhost:3000`

## Houses

- `GET /houses` – Returnerer alle Hogwarts-huse med `id`, `name`, `colors` og `founder` (`200`). Hvis databasen ikke indeholder nogen huse, returneres en tom liste.
- `GET /houses/:id` – Returnerer huset med det angivne ID (`200`). Findes huset ikke, returneres `404` med `{"error":"House not found"}`. Er ID'et ugyldigt, returneres `400`.

Houses er en read-only ressource. Det er derfor ikke muligt at oprette, opdatere eller slette huse gennem API'et.

## Teachers

- `GET /teachers` – Returnerer alle lærere inklusive deres tilknyttede husnavn via et JOIN med `houses` (`200`). Hvis der ikke findes nogen lærere, returneres en tom liste.
- `GET /teachers/:id` – Returnerer læreren med det angivne ID inklusive husnavn (`200`). Findes læreren ikke, returneres `404` med `{"error":"Teacher not found"}`.
- `POST /teachers` – Opretter en ny lærer ud fra `name` og `house_id`. Begge felter skal være gyldige, og huset skal eksistere. Returnerer den oprettede lærer (`201`). Ugyldige input returnerer `400`, og et ikke-eksisterende hus afvises.
- `PUT /teachers/:id` – Opdaterer lærerens `name` og `house_id`. Returnerer den opdaterede lærer (`200`). Findes læreren ikke, returneres `404`.
- `DELETE /teachers/:id` – Sletter læreren med det angivne ID (`204 No Content`). Findes læreren ikke, returneres `404`. Hvis læreren er tilknyttet et kursus, forhindrer databasens foreign key-relation sletningen (`409 Conflict`).

**Eksempel på request body til POST og PUT:**

```json
{
  "name": "Remus Lupin",
  "house_id": 1
}
```

## Students

- `GET /students` – Returnerer alle elever inklusive deres husnavn via et JOIN med `houses` (`200`). Hvis der ikke findes nogen elever, returneres en tom liste.
- `GET /students/:id` – Returnerer eleven med det angivne ID inklusive husnavn (`200`). Findes eleven ikke, returneres `404` med `{"error":"Student not found"}`.
- `POST /students` – Opretter en elev ud fra `name`, `year` og `house_id`. Årgangen skal være et heltal mellem 1 og 7, og huset skal eksistere. Returnerer den oprettede elev (`201`). Ugyldige input returnerer `400`.
- `PUT /students/:id` – Opdaterer elevens `name`, `year` og `house_id`. Returnerer den opdaterede elev (`200`). Findes eleven ikke, returneres `404`.
- `DELETE /students/:id` – Sletter eleven med det angivne ID (`204 No Content`). Findes eleven ikke, returneres `404`. Elevens kursustilmeldinger slettes automatisk gennem `ON DELETE CASCADE`.

**Eksempel på request body til POST og PUT:**

```json
{
  "name": "Neville Longbottom",
  "year": 5,
  "house_id": 1
}
```

## Courses

- `GET /courses` – Returnerer alle kurser inklusive kursusnavn, lærerens ID, lærerens navn og en liste over tilmeldte elever (`200`). Hvis der ikke findes nogen kurser, returneres en tom liste.
- `GET /courses/:id` – Returnerer kurset med det angivne ID inklusive læreroplysninger og tilmeldte elever (`200`). Findes kurset ikke, returneres `404` med `{"error":"Course not found"}`.
- `POST /courses` – Opretter et kursus ud fra `name` og `teacher_id`. Læreren skal eksistere. Returnerer det oprettede kursus (`201`). Ugyldige input returnerer `400`.
- `PUT /courses/:id` – Opdaterer kursets `name` og `teacher_id`. Returnerer det opdaterede kursus (`200`). Findes kurset ikke, returneres `404`.
- `PATCH /courses/:id/teacher` – Ændrer kun læreren på et eksisterende kursus ud fra `teacher_id`. Kursets navn og elevtilmeldinger ændres ikke. Returnerer det opdaterede kursus (`200`). Findes kurset ikke, returneres `404`.
- `DELETE /courses/:id` – Sletter kurset med det angivne ID (`204 No Content`). Findes kurset ikke, returneres `404`. Alle tilmeldinger til kurset slettes automatisk via `ON DELETE CASCADE`, mens eleverne bevares.

**Eksempel på request body til POST og PUT:**

```json
{
  "name": "Defence Against the Dark Arts",
  "teacher_id": 1
}
```

**Eksempel på request body til PATCH:**

```json
{
  "teacher_id": 2
}
```

## Course–Student Assignments

Forholdet mellem elever og kurser er en many-to-many-relation, der håndteres gennem tabellen `course_students`.

- `PUT /courses/:id/students/:studentId` – Tilmelder en eksisterende elev til et eksisterende kursus. Hvis tilmeldingen oprettes, returneres `201 Created`. Hvis eleven allerede er tilmeldt, returneres `204 No Content`. Hvis kurset eller eleven ikke findes, returneres `404`.
- `DELETE /courses/:id/students/:studentId` – Fjerner en elevs tilmelding til et kursus (`204 No Content`). Findes tilmeldingen ikke, returneres `404`. Eleven og kurset bliver ikke slettet.

**Eksempel på tilmelding:**

`PUT /courses/5/students/1`

Denne request tilmelder eleven med ID `1` til kurset med ID `5`.

**Eksempel på afmelding:**

`DELETE /courses/5/students/1`

Denne request fjerner kun relationen mellem eleven og kurset.

Begge endpoints bruger ID'erne fra URL'en og kræver derfor ingen request body.

## HTTP-statuskoder

API'et anvender følgende HTTP-statuskoder:

- `200 OK` – Requesten er gennemført, og data returneres.
- `201 Created` – En ny ressource eller kursustilmelding er oprettet.
- `204 No Content` – En ressource eller relation er slettet, eller en elev var allerede tilmeldt et kursus.
- `400 Bad Request` – Requesten indeholder ugyldige data, et ugyldigt ID eller ugyldig JSON.
- `404 Not Found` – Den ønskede ressource eller relation findes ikke.
- `409 Conflict` – En databasebegrænsning forhindrer handlingen, eksempelvis en foreign key- eller unique constraint.
- `500 Internal Server Error` – Der er opstået en uventet serverfejl.

## Database

Projektet anvender PostgreSQL med fem tabeller:

- `houses` – Indeholder husenes ID, navn, farver og grundlægger.
- `teachers` – Indeholder lærernes ID, navn og tilknyttede hus.
- `students` – Indeholder elevernes ID, navn, årgang og tilknyttede hus.
- `courses` – Indeholder kursernes ID, navn og tilknyttede lærer.
- `course_students` – Forbinder elever og kurser gennem en sammensat primary key bestående af `course_id` og `student_id`.

Databasen anvender primary keys, foreign keys, `NOT NULL`, `UNIQUE` og `CHECK` constraints for at sikre dataintegritet.

SQL-forespørgsler anvender parameteriserede værdier som `$1` og `$2` for at beskytte mod SQL injection.

## Installation og opsætning

1. Installér Node.js og PostgreSQL.
2. Opret en PostgreSQL-database med navnet `hogwarts`.
3. Kør SQL-filen `database.sql` for at oprette tabeller og indsætte eksempeldata.
4. Kør `npm install` i projektets rodmappe.
5. Kopiér `.env.example` til `.env`, og indsæt dine egne databaseoplysninger.
6. Start serveren med `npm start`.

**Eksempel på `.env`:**

```dotenv
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=hogwarts
DB_USER=postgres
DB_PASSWORD=your_password
```

Filen `.env` skal være tilføjet til `.gitignore`, så databaseadgangskoder ikke uploades til GitHub.

## Test

API'et er manuelt testet med Insomnia.

Alle 20 endpoints er gennemgået med de forventede HTTP-statuskoder. Der er desuden udført udvalgte tests af ugyldige ID'er, manglende ressourcer og sletning af eksisterende data.

## Arkitektur

Projektet anvender en lagdelt arkitektur:

**Routes → Controllers → Repositories → PostgreSQL**

- **Routes** definerer API'ets endpoints og HTTP-metoder.
- **Controllers** håndterer requests, inputvalidering, HTTP-statuskoder og responses.
- **Repositories** udfører SQL-forespørgsler og kommunikerer med PostgreSQL.
- **PostgreSQL** gemmer og administrerer data samt relationer.


Alle JavaScript-filer anvender ES Modules med `import` og `export`.