
### Architecture, Design and Threat Modeling (V1)

**V1.2 Authentication Architecture**: 
- Implementira JWT za autentifikaciju, koristeći `UserController.Login`.

**V1.3 Session Management Architecture**: 
- Upravlja sesijama koristeći JWT tokene u funkcijama `UserController.Login` i `UserController.Logout`.
 
**V1.4 Access Control Architecture**: 
- Implementira RBAC (Role-Based Access Control) kroz kontrolu pristupa u `NotesController` i `UserController`.
 
**V1.7 Errors, Logging and Auditing Architecture**: 
- Uključuje obradu grešaka i logovanje kroz odgovarajuće odgovore kao što su `BadRequest` i `Unauthorized`.

**V1.8 Data Protection and Privacy Architecture**: 
- Koristi bcrypt za sigurno šifrovanje osetljivih podataka u funkciji `UserController.AddUser`.

**V1.9 Communications Architecture**: 
- Obezbeđuje sigurnu komunikaciju između klijenta i servera, kao i mikroservisa poput Zanzibara i Consula.

### Authentication (V2)
    
**V2.1 Password Security**:
- Vaša aplikacija koristi bcrypt za šifrovanje lozinki korisnika (vidljivo u funkciji `UserController.AddUser`), što odgovara preporukama za bezbednost lozinki,takodje postoji regex za lozinku koji forsira korisnika da napravi lozinku od minimalno 8 karaktera sa bar 1 specijalnim,1 brojem,1 velikim slovom i 1 malim slovom.

**V2.4 Credential Storage**: 
- Koristi se siguran način čuvanja verifikacionih podataka ( JWT tokeni i povezani podaci u Consulu), što je ključno za bezbedno čuvanje kredencijala.

**V2.9 Cryptographic Verifier**: 
- JWT tokeni koji se koriste za autentifikaciju podržavaju kriptografske verifikacije, što odgovara smernicama za upotrebu sigurnih kriptografskih algoritama.

**V2.10 Service Authentication**: 
- API-ja su obezbeđena JWT autentifikacijom (`NotesController` i `UserController`), što omogućava autentičnost i integritet podataka.

### Session Management (V3)

**V3.1 Fundamental Session Management Security**: 
- Aplikacija koristi JWT (JSON Web Tokens) za upravljanje sesijama, što obezbeđuje osnovnu bezbednost upravljanja sesijama.
    
**V3.3 Session Termination**:
- Implementirana je funkcionalnost za završavanje sesije (`UserController.Logout`), što efikasno zatvara sesije i uklanja sesijske tokene sa klijentske strane.
    
**V3.4 Cookie-based Session Management**: 
- Aplikacija koristi JWT tokene za autentifikaciju i upravljanje sesijama, pri čemu se ovi tokeni često skladište i prenose putem cookie-ja, što je u skladu sa preporukama za upravljanje sesijama baziranim na tokenima.
    
**V3.5 Token-based Session Management**: 
- JWT tokeni se koriste za autentifikaciju i upravljanje sesijama, što je u skladu sa preporukama za token-bazirano upravljanje sesijama.

### Access Control (V4)

**V4.1 Opšti dizajn kontrola pristupa:**

-   Implementirana je kontrola pristupa na osnovu uloga (RBAC) u aplikaciji koristeći mini-Zanzibar sistem. Mini-Zanzibar omogućava definisanje uloga i njihovih dozvola, čime se ograničava pristup određenim resursima samo ovlašćenim korisnicima. Definisana su pravila pristupa u NotesController-u koristeći anotacije poput `Authorize(Roles = "USER"` i `Authorize(Roles = "ADMIN"`, čime se osigurava da samo korisnici sa odgovarajućim ulogama mogu pristupiti tim resursima.

**V4.2 Kontrola pristupa na nivou operacija:**

-   Mini-Zanzibar sistem se primenjuje na nivou operacija kako bi se osiguralo da autentifikacija i autorizacija budu implementirane tačno prema definisanim pravilima. Na primer, u NotesController-u i UserController-u, mini-Zanzibar omogućava dinamičko odobravanje ili odbijanje pristupa korisnicima na osnovu njihovih atributa uloga i drugih relevantnih podataka.

**V4.3 Ostale consideracije kontrole pristupa:**

-   Mini-Zanzibar sistem omogućava obradu dodatnih zahteva i specifičnih scenarija koji zahtevaju prilagođavanje pristupa u realnom vremenu. Na primer, podržava upravljanje pristupom za delegirane operacije ili situacije koje zahtevaju dinamičku promenu pravila pristupa, čime se osigurava fleksibilnost i sigurnost aplikacije u različitim scenarijima.

### Validation, Sanitization and Encoding (V5)

**V5.1 Validacija unosa:**

-   Implementirana je validacija unosa koristeći `ModelState.IsValid` provere u različitim endpointima aplikacije. Ovo sprečava injekcione napade i osigurava integritet podataka.

**V5.3 Kodiranje izlaza i prevencija injekcija:**

-   Implementirana je prevencija injekcija kodiranjem izlaznih podataka u odgovorima aplikacije, čime se osigurava da se sprečavaju XSS (Cross-Site Scripting) napadi i injekcije u web aplikaciji.

**V5.5 Prevencija deserijalizacije:**

-   Implementirane su mere za prevenciju deserijalizacijskih napada kroz korišćenje sigurnih metoda deserijalizacije ili validaciju unosa.

### Stored Cryptography (V6)

**V6.1 Klasifikacija podataka:**

-   Implementirana je klasifikacija podataka prema osetljivosti, što omogućava adekvatno upravljanje podacima u skladu sa njihovom važnošću i osetljivošću.

**V6.2 Algoritmi:**

-   Koristi se bcrypt za sigurno enkriptovanje osetljivih podataka kao što su korisničke lozinke (`UserController.AddUser`), što pruža odgovarajuću zaštitu podataka.

**V6.4 Upravljanje tajnama:**

-   Implementirano je sigurno upravljanje tajnama, poput korišćenja `Environment.GetEnvironmentVariable` u `Startup.cs` za čuvanje tajnih podataka kao što su JWT_SECRET i povezivanje sa bazom podataka.

### Error Handling and Logging (V7)

**V7.4 Obrada grešaka:**

-   Implementirano je efikasno upravljanje greškama (`try-catch` blokovi u kritičnim delovima koda), što omogućava prikladno reagovanje na neočekivane situacije i pruža korisnicima informativne poruke o greškama.

### Data Protection (V8)

**V8.1 Opšta zaštita podataka:**

-   Implementirane su odgovarajuće mere zaštite podataka, uključujući enkripciju osetljivih podataka poput lozinki (koristeći bcrypt) i drugih poverljivih informacija.


**V8.3 Osetljivi privatni podaci:**

-   Osetljivi privatni podaci se čuvaju i obrađuju uz primenu adekvatnih mera zaštite, u skladu sa preporukama za obradu poverljivih informacija.

### API and Web service (V13)

**V13.2 RESTful Web Service**: 
- Implementirano je ograničenje pristupa HTTP metodama kao što su DELETE ili PUT na zaštićenim resursima samo za korisnike sa odgovarajućim ovlašćenjima. Implementirana je i JSON schema validacija kako bi se proverili ulazni podaci pre njihovog prihvatanja u API.

### Configuration (V14)

**V14.1 Build and Deploy:**
-Delovi aplikacije su dockerizovana za lakše upravljanje 
zavisnostima i brže razmeštanje.

**V14.2 Dependency:** 
- Docker kontejneri su korišćeni za izolaciju i upravljanje zavisnostima, uključujući mini-zanzibar i ConsulDB.

**V14.3 Unintended Security Disclosure:** 
- Implementirane su sigurnosne mere kako bi se sprečilo neželjeno otkrivanje sigurnosnih informacija, uz korišćenje kontrolisanog okruženja Docker kontejnera.

