````markdown
# ⚽ Progetto Basi di Dati 2 – Campionati di Calcio

Un'applicazione web per la gestione e la visualizzazione dei dati relativi a campionati di calcio, con backend in Java Spring Boot e frontend in Next.js + Tailwind CSS.

## 🧱 Stack Tecnologico

- **Frontend:** Next.js (React) + Tailwind CSS
- **Backend:** Spring Boot (Java)
- **Database:** MongoDB (assicurarsi di avere il database caricato con i dati necessari)
- **Librerie principali:**
  - Axios
  - React Context API

---

## 🚀 Setup del Progetto

### 📦 Prerequisiti

- Node.js (versione consigliata: ≥ 18)
- Java JDK ≥ 17
- MongoDB
- MongoDBCompass
- Maven o Gradle
- Git

---

## ⚙️ Configurazione database MongoDB

Prima di avviare il backend, assicurarsi di:

1. Avere MongoDB in esecuzione localmente o in remoto.
2. Aver importato il dataset richiesto nel database MongoDB (es. tramite `mongoimport` o script di caricamento dati).

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

## ⚙️ 2. Configurazione backend

2.1. Accedi alla directory del backend:

```bash
cd backend/demo/src/main/java/com/example
```

2.2. Avvia il file `BackendApplication.java` (es. tramite IDE o comando Maven/Gradle).

---

## ⚙️ 3. Configurazione frontend

3.1. Nel terminale del frontend, installa le dipendenze:

```bash
npm install
```

3.2. Avvia il frontend:

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
