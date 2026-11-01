# PSEUDOKODE – Hogwarts Course Management System

Dette dokument beskriver logikken bag API'ets endpoints.

Projektet anvender følgende arkitektur:

**Routes → Controllers → Repositories → PostgreSQL**

Routes modtager HTTP-requests, controllers validerer input og håndterer responses, mens repositories udfører SQL-forespørgsler.

## GET /houses

1. Routeren kalder `getAll()` i `houses.controller.js`.
2. Controlleren kalder `findAll()` i `houses.repository.js`.
3. Repository udfører en SQL `SELECT` og returnerer alle houses.
4. Controlleren returnerer resultatet som JSON med status `200 OK`.
5. Hvis der ikke findes nogen houses, returneres en tom liste `[]`.

Samme grundlæggende fremgangsmåde anvendes ved `GET /teachers` og `GET /students`. Her hentes også husnavnet gennem et SQL JOIN.

## GET /houses/:id

1. Routeren sender requesten videre til `getOne()` i controlleren.
2. Controlleren læser ID'et fra `req.params.id`.
3. ID'et valideres som et positivt heltal. Hvis det er ugyldigt, returneres `400 Bad Request`.
4. Controlleren kalder `findById(id)` i repository.
5. Repository udfører en SQL `SELECT` med det angivne ID.
6. Hvis ressourcen ikke findes, returneres `404 Not Found`.
7. Hvis ressourcen findes, returneres JSON med status `200 OK`.

Samme fremgangsmåde anvendes ved `GET /teachers/:id` og `GET /students/:id`.

## POST /teachers

1. Routeren kalder `create()` i `teachers.controller.js`.
2. Controlleren læser `name` og `house_id` fra `req.body`.
3. Controlleren validerer, at navnet er en gyldig tekst, og at `house_id` er et positivt heltal.
4. Hvis input er ugyldigt, returneres `400 Bad Request`.
5. Controlleren kontrollerer, at det angivne house eksisterer.
6. Hvis huset ikke findes, returneres `404 Not Found`.
7. Controlleren kalder `create(name, houseId)` i repository.
8. Repository udfører en SQL `INSERT` og returnerer den oprettede lærer.
9. Controlleren returnerer JSON med status `201 Created`.

## POST /students

1. Routeren kalder `create()` i `students.controller.js`.
2. Controlleren læser `name`, `year` og `house_id` fra `req.body`.
3. Controlleren validerer navn og house-ID samt kontrollerer, at `year` er et heltal mellem 1 og 7.
4. Hvis input er ugyldigt, returneres `400 Bad Request`.
5. Controlleren kontrollerer, at det angivne house eksisterer.
6. Hvis huset ikke findes, returneres `404 Not Found`.
7. Repository opretter eleven med en SQL `INSERT`.
8. Controlleren returnerer den oprettede elev som JSON med status `201 Created`.

## PUT /teachers/:id

1. Routeren kalder `update()` i controlleren.
2. Controlleren læser og validerer ID'et fra URL'en.
3. Controlleren læser `name` og `house_id` fra JSON-body.
4. Hvis ID eller input er ugyldigt, returneres `400 Bad Request`.
5. Controlleren kontrollerer, at det angivne house eksisterer.
6. Hvis huset ikke findes, returneres `404 Not Found`.
7. Repository udfører en SQL `UPDATE` på læreren med det angivne ID.
8. Hvis læreren ikke findes, returneres `404 Not Found`.
9. Ellers returneres den opdaterede lærer som JSON med status `200 OK`.

## PUT /students/:id

1. Controlleren læser og validerer elevens ID.
2. Controlleren læser `name`, `year` og `house_id` fra request body.
3. Navn og house-ID valideres, og `year` skal være mellem 1 og 7.
4. Ugyldigt input returnerer `400 Bad Request`.
5. Controlleren kontrollerer, at huset eksisterer.
6. Repository udfører en SQL `UPDATE`.
7. Hvis eleven ikke findes, returneres `404 Not Found`.
8. Ellers returneres den opdaterede elev med status `200 OK`.

## DELETE /teachers/:id

1. Controlleren læser og validerer lærerens ID.
2. Hvis ID'et er ugyldigt, returneres `400 Bad Request`.
3. Repository forsøger at slette læreren med en SQL `DELETE`.
4. Hvis læreren ikke findes, returneres `404 Not Found`.
5. Hvis læreren slettes, returneres `204 No Content`.
6. Hvis læreren er tilknyttet et course, forhindrer foreign key-relationen sletningen, og fejlhåndteringen returnerer `409 Conflict`.

## DELETE /students/:id

1. Controlleren læser og validerer elevens ID.
2. Repository udfører en SQL `DELETE`.
3. Hvis eleven ikke findes, returneres `404 Not Found`.
4. Hvis eleven slettes, returneres `204 No Content`.
5. Elevens tilmeldinger i `course_students` slettes automatisk gennem `ON DELETE CASCADE`.

## GET /courses

1. Routeren kalder `getAll()` i `courses.controller.js`.
2. Controlleren kalder `findAll()` i repository.
3. Repository henter alle kurser inklusive deres lærere gennem et SQL JOIN.
4. Controlleren anvender funktionen `withStudents()` til at hente eleverne til hvert kursus.
5. Funktionen kalder `findStudents(course.id)` i repository.
6. Repository henter eleverne gennem et JOIN mellem `students` og `course_students`.
7. Controlleren samler kurserne og elevlisterne.
8. Resultatet returneres som JSON med status `200 OK`.

## GET /courses/:id

1. Controlleren læser og validerer kursets ID.
2. Hvis ID'et er ugyldigt, returneres `400 Bad Request`.
3. Repository finder kurset med `findById(id)`.
4. Hvis kurset ikke findes, returneres `404 Not Found`.
5. Controlleren kalder `withStudents()` for at tilføje kursets elevliste.
6. Det samlede kursus returneres som JSON med status `200 OK`.

## POST /courses

1. Controlleren læser `name` og `teacher_id` fra request body.
2. Begge felter valideres.
3. Hvis input er ugyldigt, returneres `400 Bad Request`.
4. Controlleren kontrollerer, at læreren eksisterer.
5. Hvis læreren ikke findes, returneres `404 Not Found`.
6. Repository opretter kurset gennem en SQL `INSERT`.
7. Controlleren tilføjer en tom elevliste gennem `withStudents()`.
8. Det oprettede kursus returneres med status `201 Created`.

## PUT /courses/:id

1. Controlleren læser og validerer kursets ID.
2. Controlleren læser `name` og `teacher_id` fra request body.
3. Hvis input er ugyldigt, returneres `400 Bad Request`.
4. Controlleren kontrollerer, at læreren eksisterer.
5. Repository opdaterer kursets navn og lærer gennem en SQL `UPDATE`.
6. Hvis kurset ikke findes, returneres `404 Not Found`.
7. Controlleren tilføjer kursets nuværende elevliste gennem `withStudents()`.
8. Det opdaterede kursus returneres med status `200 OK`.

## PATCH /courses/:id/teacher

1. Controlleren læser kursets ID fra URL'en.
2. Controlleren læser `teacher_id` fra request body.
3. Begge ID'er valideres.
4. Hvis et ID er ugyldigt, returneres `400 Bad Request`.
5. Controlleren kontrollerer, at både kurset og læreren eksisterer.
6. Hvis en af ressourcerne ikke findes, returneres `404 Not Found`.
7. Repository opdaterer kun kursets `teacher_id`.
8. Kursets navn og tilmeldte elever forbliver uændrede.
9. Controlleren returnerer det opdaterede kursus med status `200 OK`.

## PUT /courses/:id/students/:studentId

1. Controlleren læser `id` og `studentId` fra URL'en.
2. Begge ID'er valideres som positive heltal.
3. Hvis et ID er ugyldigt, returneres `400 Bad Request`.
4. Controlleren kontrollerer, at både kurset og eleven eksisterer.
5. Hvis en af ressourcerne ikke findes, returneres `404 Not Found`.
6. Repository forsøger at oprette en relation i `course_students`.
7. SQL anvender `ON CONFLICT DO NOTHING` for at undgå dobbelttilmeldinger.
8. Hvis tilmeldingen oprettes, returneres `201 Created`.
9. Hvis eleven allerede er tilmeldt, returneres `204 No Content`.

## DELETE /courses/:id/students/:studentId

1. Controlleren læser og validerer begge ID'er fra URL'en.
2. Hvis et ID er ugyldigt, returneres `400 Bad Request`.
3. Controlleren kontrollerer, at kurset eksisterer.
4. Repository forsøger at slette den matchende relation i `course_students`.
5. Hvis relationen findes og slettes, returneres `204 No Content`.
6. Hvis relationen ikke findes, returneres `404 Not Found`.
7. Eleven og kurset bevares i deres respektive tabeller.

## DELETE /courses/:id

1. Controlleren læser og validerer kursets ID.
2. Hvis ID'et er ugyldigt, returneres `400 Bad Request`.
3. Repository forsøger at slette kurset med en SQL `DELETE`.
4. Hvis kurset ikke findes, returneres `404 Not Found`.
5. Hvis kurset slettes, returneres `204 No Content`.
6. Tilknyttede rækker i `course_students` slettes automatisk gennem `ON DELETE CASCADE`.
7. De tilmeldte elever forbliver i `students`-tabellen.

## Fejlhåndtering

1. Hver controller anvender `try/catch` til at håndtere uventede fejl.
2. Ved fejl kaldes `next(error)`, som sender fejlen videre til Express' centrale error handler i `app.js`.
3. Ugyldig JSON returnerer `400 Bad Request`.
4. PostgreSQL foreign key-fejl (`23503`) returnerer `409 Conflict`.
5. PostgreSQL unique constraint-fejl (`23505`) returnerer `409 Conflict`.
6. Andre uventede serverfejl logges og returnerer `500 Internal Server Error`.

## Arkitektur og ansvarsfordeling

- **Routes:** Definerer endpoints og videresender HTTP-requests til controllers.
- **Controllers:** Validerer input, kalder repositories og returnerer HTTP-responses.
- **Repositories:** Udfører SQL-forespørgsler mod PostgreSQL.
- **Database:** Opbevarer data og sikrer relationer gennem primary keys, foreign keys og constraints.

Projektet anvender ikke et services-lag. Funktionen `withStudents()` ligger i `courses.controller.js` og bruges til at samle kursusdata med tilmeldte elever.

Alle JavaScript-filer anvender ES Modules med `import` og `export`.