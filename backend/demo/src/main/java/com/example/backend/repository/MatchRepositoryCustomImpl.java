package com.example.backend.repository;

import com.example.backend.dto.MatchWithDetailsDTO;
import com.example.backend.dto.StandingDTO;
import com.example.backend.model.League;
import com.example.backend.model.Match;
import com.example.backend.model.Team;
import org.bson.Document;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.*;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Repository;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import static org.springframework.data.mongodb.core.aggregation.Aggregation.*;

@Repository
public class MatchRepositoryCustomImpl implements MatchRepositoryCustom {

    @Autowired
    private MongoTemplate mongoTemplate;

    @Override
    public List<MatchWithDetailsDTO> findMatchesWithDetails() {
        Aggregation aggregation = newAggregation(
            lookup("leagues", "league_id", "id", "league"),
            lookup("teams", "home_team_api_id", "team_api_id", "homeTeam"),
            lookup("teams", "away_team_api_id", "team_api_id", "awayTeam"),
            unwind("league", true),
            unwind("homeTeam", true),
            unwind("awayTeam", true)
        );

        AggregationResults<Document> results = mongoTemplate.aggregate(aggregation, "match", Document.class);

        List<Document> rawResults = results.getMappedResults();

        rawResults.forEach(doc -> System.out.println(doc.toJson()));

        return rawResults.stream().map(doc -> {
            MatchWithDetailsDTO dto = new MatchWithDetailsDTO();

            // Converto il match
            Match match = mongoTemplate.getConverter().read(Match.class, doc);
            dto.setMatch(match);

            // Converto league solo se non null
            Document leagueDoc = (Document) doc.get("league");
            if (leagueDoc != null) {
                dto.setLeague(mongoTemplate.getConverter().read(League.class, leagueDoc));
            }

            // Converto homeTeam solo se non null
            Document homeTeamDoc = (Document) doc.get("homeTeam");
            if (homeTeamDoc != null) {
                dto.setHomeTeam(mongoTemplate.getConverter().read(Team.class, homeTeamDoc));
            }

            // Converto awayTeam solo se non null
            Document awayTeamDoc = (Document) doc.get("awayTeam");
            if (awayTeamDoc != null) {
                dto.setAwayTeam(mongoTemplate.getConverter().read(Team.class, awayTeamDoc));
            }

            return dto;
        }).toList();
    }

    @Override
    public List<MatchWithDetailsDTO> findMatchesByCountryAndDate(int countryId, String date) {
        // 1) Recupera tutte le leghe di quel country
        List<League> leagues = mongoTemplate.find(
            Query.query(Criteria.where("country_id").is(countryId)),
            League.class
        );
        List<Integer> leagueIds = leagues.stream()
            .map(League::getLeagueId)
            .toList();

        // 2) Costruisci il filtro: league_id in (…) E date che inizia con YYYY-MM-DD
        Criteria criteria = Criteria.where("league_id").in(leagueIds);
        if (date != null && !date.isEmpty()) {
            criteria = criteria.and("date").regex("^" + date);
        }

        // 3) Aggregazione con lookup su league e team
        Aggregation agg = newAggregation(
            match(criteria),
            lookup("leagues", "league_id", "id", "league"),
            lookup("teams", "home_team_api_id", "team_api_id", "homeTeam"),
            lookup("teams", "away_team_api_id", "team_api_id", "awayTeam"),
            unwind("league", true),
            unwind("homeTeam", true),
            unwind("awayTeam", true)
        );

        // 4) Esegui e mappa in DTO
        AggregationResults<Document> results = mongoTemplate.aggregate(agg, "matches", Document.class);
        return results.getMappedResults().stream().map(doc -> {
            MatchWithDetailsDTO dto = new MatchWithDetailsDTO();
            dto.setMatch(mongoTemplate.getConverter().read(Match.class, doc));

            Document leagueDoc = (Document) doc.get("league");
            if (leagueDoc != null) dto.setLeague(mongoTemplate.getConverter().read(League.class, leagueDoc));

            Document homeTeamDoc = (Document) doc.get("homeTeam");
            if (homeTeamDoc != null) dto.setHomeTeam(mongoTemplate.getConverter().read(Team.class, homeTeamDoc));

            Document awayTeamDoc = (Document) doc.get("awayTeam");
            if (awayTeamDoc != null) dto.setAwayTeam(mongoTemplate.getConverter().read(Team.class, awayTeamDoc));

            return dto;
        }).toList();
    }

  
    @Override
    public List<String> findAllAvailableDates() {
        Query query = new Query();
        query.fields().include("date");

        List<Match> matches = mongoTemplate.find(query, Match.class);
        return matches.stream()
                .map(Match::getDate)
                .distinct()
                .sorted()
                .toList();
    }



    @Override
    public List<MatchWithDetailsDTO> findMatchesByCountryId(int countryId) {
        // Aggiungi un log all'inizio del metodo per confermare che viene eseguito
        System.out.println("Metodo findMatchesByCountryId chiamato con countryId: " + countryId);

        List<League> leagues = mongoTemplate.find(
            Query.query(Criteria.where("country_id").is(countryId)),
            League.class
        );

        // Stampa la lista degli ID delle leghe per il debug
        System.out.println("League IDs: " + leagues);

        List<Integer> leagueIds = leagues.stream()
            .map(League::getLeagueId)
            .toList();

        Criteria matchCriteria = Criteria.where("league_id").in(leagueIds);

        Aggregation aggregation = Aggregation.newAggregation(
            match(matchCriteria),
            lookup("leagues", "league_id", "id", "league"),
            lookup("teams", "home_team_api_id", "team_api_id", "homeTeam"),
            lookup("teams", "away_team_api_id", "team_api_id", "awayTeam"),
            unwind("league", true),
            unwind("homeTeam", true),
            unwind("awayTeam", true)
        );

        AggregationResults<Document> results = mongoTemplate.aggregate(aggregation, "matches", Document.class);

        results.getMappedResults().forEach(doc -> {
            System.out.println("Document: " + doc);
        });

        return results.getMappedResults().stream().map(doc -> {
            MatchWithDetailsDTO dto = new MatchWithDetailsDTO();
            dto.setMatch(mongoTemplate.getConverter().read(Match.class, doc));

            // Converto league solo se non null
            Document leagueDoc = (Document) doc.get("league");
            if (leagueDoc != null) {
                dto.setLeague(mongoTemplate.getConverter().read(League.class, leagueDoc));
            }

            // Converto homeTeam solo se non null
            Document homeTeamDoc = (Document) doc.get("homeTeam");
            if (homeTeamDoc != null) {
                dto.setHomeTeam(mongoTemplate.getConverter().read(Team.class, homeTeamDoc));
            }

            // Converto awayTeam solo se non null
            Document awayTeamDoc = (Document) doc.get("awayTeam");
            if (awayTeamDoc != null) {
                dto.setAwayTeam(mongoTemplate.getConverter().read(Team.class, awayTeamDoc));
            }

            return dto;
        }).toList();
    }

    @Override
    public List<MatchWithDetailsDTO> findMatchesByDate(String date) {
        // Costruisci filtro solo per data
        Criteria criteria = Criteria.where("date").regex("^" + date);

       Aggregation agg = newAggregation(
        match(criteria),
        lookup("leagues", "league_id", "id", "league"),
        lookup("teams", "home_team_api_id", "team_api_id", "homeTeam"),
        lookup("teams", "away_team_api_id", "team_api_id", "awayTeam"),
        unwind("league", true),
        unwind("homeTeam", true),
        unwind("awayTeam", true)
    );  

        AggregationResults<Document> results = mongoTemplate.aggregate(agg, "matches", Document.class);
       return results.getMappedResults().stream().map(doc -> {
        MatchWithDetailsDTO dto = new MatchWithDetailsDTO();

        // Estrai solo il campo "match" puro dal document
        Document matchDoc = new Document(doc);
        matchDoc.remove("league");
        matchDoc.remove("homeTeam");
        matchDoc.remove("awayTeam");
        dto.setMatch(mongoTemplate.getConverter().read(Match.class, matchDoc));

        // Estrarre e convertire i sotto-documenti
        Document leagueDoc = (Document) doc.get("league");
        if (leagueDoc != null) {
            dto.setLeague(mongoTemplate.getConverter().read(League.class, leagueDoc));
        }

        Document homeDoc = (Document) doc.get("homeTeam");
        if (homeDoc != null) {
            dto.setHomeTeam(mongoTemplate.getConverter().read(Team.class, homeDoc));
        }

        Document awayDoc = (Document) doc.get("awayTeam");
        if (awayDoc != null) {
            dto.setAwayTeam(mongoTemplate.getConverter().read(Team.class, awayDoc));
        }

        return dto;
    }).toList();

    }

    @Override
    public List<StandingDTO> calculateStandings(String season, int leagueId) {
        // CASA
        MatchOperation homeMatch = Aggregation.match(
                Criteria.where("season").is(season).and("league_id").is(leagueId)
        );
        ProjectionOperation homeProject = Aggregation.project()
                .and("home_team_api_id").as("team")
                .and("league_id").as("league_id")
                .and("home_team_goal").as("goalsFor")
                .and("away_team_goal").as("goalsAgainst")
                .andExpression("cond(home_team_goal > away_team_goal, 3, cond(home_team_goal == away_team_goal, 1, 0))").as("points");

        Aggregation homeAgg = Aggregation.newAggregation(
                homeMatch,
                homeProject,
                Aggregation.group("league_id", "team")
                        .sum("points").as("points")
                        .sum("goalsFor").as("goalsFor")
                        .sum("goalsAgainst").as("goalsAgainst")
                        .count().as("gamesPlayed")
        );
        List<Document> homeResults = mongoTemplate.aggregate(homeAgg, "matches", Document.class).getMappedResults();

        // TRASFERTA
        MatchOperation awayMatch = Aggregation.match(
                Criteria.where("season").is(season).and("league_id").is(leagueId)
        );
        ProjectionOperation awayProject = Aggregation.project()
                .and("away_team_api_id").as("team")
                .and("league_id").as("league_id")
                .and("away_team_goal").as("goalsFor")
                .and("home_team_goal").as("goalsAgainst")
                .andExpression("cond(away_team_goal > home_team_goal, 3, cond(away_team_goal == home_team_goal, 1, 0))").as("points");

        Aggregation awayAgg = Aggregation.newAggregation(
                awayMatch,
                awayProject,
                Aggregation.group("league_id", "team")
                        .sum("points").as("points")
                        .sum("goalsFor").as("goalsFor")
                        .sum("goalsAgainst").as("goalsAgainst")
                        .count().as("gamesPlayed")
        );
        List<Document> awayResults = mongoTemplate.aggregate(awayAgg, "matches", Document.class).getMappedResults();

        // MERGE RISULTATI
        Map<Integer, Document> standingsMap = new HashMap<>();

        for (Document doc : homeResults) {
            Document id = (Document) doc.get("_id");
            Integer teamId = id.getInteger("team");
            standingsMap.put(teamId, new Document("league_id", leagueId)
                    .append("team", teamId)
                    .append("points", doc.getInteger("points"))
                    .append("goalsFor", doc.getInteger("goalsFor"))
                    .append("goalsAgainst", doc.getInteger("goalsAgainst"))
                    .append("gamesPlayed", doc.getInteger("gamesPlayed"))
            );
        }

        for (Document doc : awayResults) {
            Document id = (Document) doc.get("_id");
            Integer teamId = id.getInteger("team");
            standingsMap.merge(teamId, new Document("league_id", leagueId)
                            .append("team", teamId)
                            .append("points", doc.getInteger("points"))
                            .append("goalsFor", doc.getInteger("goalsFor"))
                            .append("goalsAgainst", doc.getInteger("goalsAgainst"))
                            .append("gamesPlayed", doc.getInteger("gamesPlayed")),
                    (existing, newDoc) -> {
                        existing.put("points", existing.getInteger("points") + newDoc.getInteger("points"));
                        existing.put("goalsFor", existing.getInteger("goalsFor") + newDoc.getInteger("goalsFor"));
                        existing.put("goalsAgainst", existing.getInteger("goalsAgainst") + newDoc.getInteger("goalsAgainst"));
                        existing.put("gamesPlayed", existing.getInteger("gamesPlayed") + newDoc.getInteger("gamesPlayed"));
                        return existing;
                    });
        }

        // FETCH nomi delle squadre
        Map<Integer, String> teamNames = mongoTemplate.findAll(Document.class, "teams").stream()
                .collect(Collectors.toMap(doc -> doc.getInteger("team_api_id"), doc -> doc.getString("team_long_name")));

        // OUTPUT FINALE
        Stream<StandingDTO> standingsStream = standingsMap.values().stream()
        .map(doc -> {
            int goalsFor = doc.getInteger("goalsFor") != null ? doc.getInteger("goalsFor") : 0;
            int goalsAgainst = doc.getInteger("goalsAgainst") != null ? doc.getInteger("goalsAgainst") : 0;
            int points = doc.getInteger("points") != null ? doc.getInteger("points") : 0;
            String teamName = teamNames.getOrDefault(doc.getInteger("team"), "Sconosciuta");

            return new StandingDTO(
                teamName,
                goalsFor,
                goalsAgainst,
                goalsFor - goalsAgainst,
                points
            );
        });

    return standingsStream
        .sorted(Comparator.comparingInt(StandingDTO::getPoints).reversed())
        .collect(Collectors.toList());


        }

    @Override
    public List<String> findDistinctSeasons() {
        return mongoTemplate.query(Match.class)
                .distinct("season")
                .as(String.class)
                .all();
    }
}
