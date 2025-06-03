from pathlib import Path
import pandas as pd
import json

# Definisce le cartelle
base_dir = Path(__file__).parent
data_dir = base_dir / "data"
result_dir = base_dir / "result"
result_dir.mkdir(exist_ok=True)

from pathlib import Path
import pandas as pd
import json

# Definisce le cartelle
base_dir = Path(__file__).parent
data_dir = base_dir / "data"
result_dir = base_dir / "result"
result_dir.mkdir(exist_ok=True)

def clean_matches():
    csv_path = data_dir / "Match.csv"
    df = pd.read_csv(csv_path)

    # Seleziona solo le colonne rilevanti
    columns_to_keep = [
        'id', 'match_api_id', 'country_id', 'league_id', 'season', 'stage',
        'date', 'home_team_api_id', 'away_team_api_id',
        'home_team_goal', 'away_team_goal',
        'B365H', 'B365D', 'B365A',
        'BWH', 'BWD', 'BWA',
        'IWH', 'IWD', 'IWA'
    ]
    df = df[columns_to_keep]

    # Rimuove righe con dati essenziali mancanti
    df = df.dropna(subset=[
        'id', 'match_api_id', 'country_id', 'league_id', 'season', 'stage',
        'date', 'home_team_api_id', 'away_team_api_id',
        'home_team_goal', 'away_team_goal'
    ])

    # Converte la colonna "date" in datetime e poi in stringa
    df['date'] = pd.to_datetime(df['date'], errors='coerce')
    df = df.dropna(subset=['date'])
    df['date'] = df['date'].dt.strftime('%Y-%m-%d %H:%M:%S')

    # Rimuove duplicati
    df = df.drop_duplicates(subset=['id'])

    # Converte i NaN residui in None per compatibilità JSON/MongoDB
    df = df.astype(object).where(pd.notnull(df), None)

    # Salva in JSON
    output_path = result_dir / "matches_clean.json"
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(df.to_dict(orient='records'), f, ensure_ascii=False, indent=2)

    print(f"✅ Pulizia Match completata. Dati salvati in {output_path}")

def clean_teams():
    csv_path = data_dir / "Team.csv"
    df = pd.read_csv(csv_path)

    # Rimuove righe con dati essenziali mancanti
    df = df.dropna(subset=[
        'id', 'team_api_id', 'team_fifa_api_id', 'team_long_name', 'team_short_name'
    ])

    # Elimina colonne completamente vuote
    df = df.dropna(axis=1, how='all')

    # Rimuove duplicati
    df = df.drop_duplicates(subset=['id'])

    # Sostituisce NaN con None
    df = df.astype(object).where(pd.notnull(df), None)

    # Salva in JSON
    output_path = result_dir / "teams_clean.json"
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(df.to_dict(orient='records'), f, ensure_ascii=False, indent=2)

    print(f"✅ Pulizia Team completata. Dati salvati in {output_path}")

def clean_leagues():
    csv_path = data_dir / "League.csv"
    df = pd.read_csv(csv_path)

    # Rimuove righe con dati essenziali mancanti
    df = df.dropna(subset=['id', 'country_id', 'name'])

    # Elimina colonne completamente vuote
    df = df.dropna(axis=1, how='all')

    # Rimuove duplicati
    df = df.drop_duplicates(subset=['id'])

    # Sostituisce NaN con None
    df = df.astype(object).where(pd.notnull(df), None)

    # Salva in JSON
    output_path = result_dir / "leagues_clean.json"
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(df.to_dict(orient='records'), f, ensure_ascii=False, indent=2)

    print(f"✅ Pulizia League completata. Dati salvati in {output_path}")

def clean_countries():
    csv_path = data_dir / "Country.csv"
    df = pd.read_csv(csv_path)

    # Rimuove righe con dati essenziali mancanti
    df = df.dropna(subset=['id', 'name'])

    # Rimuove duplicati
    df = df.drop_duplicates(subset=['id'])

    # Sostituisce NaN con None
    df = df.astype(object).where(pd.notnull(df), None)

    # Salva in JSON
    output_path = result_dir / "countries_clean.json"
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(df.to_dict(orient='records'), f, ensure_ascii=False, indent=2)

    print(f"✅ Pulizia Country completata. Dati salvati in {output_path}")

if __name__ == "__main__":
    clean_matches()
    clean_teams()
    clean_leagues()
    clean_countries()
