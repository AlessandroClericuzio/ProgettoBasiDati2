````markdown
# ⚽ Progetto Basi di Dati 2 – Campionati di Calcio

Un'applicazione web per la gestione e la visualizzazione dei dati relativi a campionati di calcio, con backend in Java Spring Boot e frontend in Next.js + Tailwind CSS.

## 🧱 Stack Tecnologico

- **Frontend:** Next.js (React) + Tailwind CSS
- **Backend:** Spring Boot (Java)
- **Database:** MongoDB (assicurarsi di avere il database configurato e in esecuzione)
- **Librerie principali:**
  - Axios
  - React Context API

---

## 🚀 Setup del Progetto

### 📦 Prerequisiti

- Node.js (versione consigliata: ≥ 18)
- Java JDK ≥ 17
- MongoDB
- MongoDB Compass
- Maven o Gradle
- Git

---

## ⚙️ Configurazione database MongoDB

Prima di avviare il backend, assicurarsi di:

1. Avere MongoDB in esecuzione localmente o in remoto.
2. Eseguire lo script di importazione dati (`importAll.js`) per caricare i dati JSON nel database MongoDB.  
   Lo script legge i file JSON e popola automaticamente le collection nel database.

---

## 📚 Fonte del dataset

I dati sportivi utilizzati nel progetto sono estratti dal dataset pubblico disponibile su Kaggle:

[https://www.kaggle.com/datasets/hugomathien/soccer/data]

---

# ⚽ Procedimenti

## ▶️ 1. Clona il repository

```bash
git clone https://github.com/AlessandroClericuzio/ProgettoBasiDati2.git
cd ProgettoBasiDati2
```
````

---

## ⚙️ 2. Importazione dati nel database MongoDB

2.1. Accedi alla cartella contenente lo script di importazione:

```bash
cd data-cleaning
```

2.2. Esegui lo script Node.js per importare i dati:

```bash
node importAll.js
```

> ⚠️ Lo script `importAll.js` legge i file JSON dalla cartella `result` e li inserisce nelle rispettive collection nel database MongoDB configurato. Il nome del db si stabilisce nel file `importAll.js`.

---

## ⚙️ 3. Configurazione backend

3.1. Modifica il file di configurazione `application.properties` per impostare la connessione a MongoDB:

```properties
# URI del database MongoDB (modifica in base alla tua configurazione)
spring.data.mongodb.uri=mongodb://localhost:27017/nomeDB

# Porta del server backend (opzionale)
server.port=8080
```

3.2. Avvia il file `BackendApplication.java` (es. tramite IDE o comando Maven/Gradle).

---

## ⚙️ 4. Configurazione frontend

4.1. Nel terminale del frontend, installa le dipendenze:

```bash
npm install
```

4.2. Avvia il frontend:

```bash
npm run dev
```

✅ Il frontend sarà attivo su: [http://localhost:3000](http://localhost:3000)

---

### 🧭 Funzionalità disponibili

- ✅ Visualizzazione leghe per paese
- ✅ Filtraggio partite per data
- ✅ Aggiunta nuova lega
- ✅ Dettagli della lega in modale
- ✅ Modifica ed eliminazione lega
- ✅ Visualizzazione partite con squadre

---

### 🔽 In caso di non caricamento dei paesi al primo avvio

Provare a ricaricare la pagina (refresh).

---

```

```
