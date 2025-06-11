package com.example.backend.repository;

import com.example.backend.dto.MatchWithDetailsDTO;
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
import java.util.List;

import static org.springframework.data.mongodb.core.aggregation.Aggregation.*;

@Repository
public class MatchRepositoryCustomImpl implements MatchRepositoryCustom {

    @Autowired
    private MongoTemplate mongoTemplate;

    // join tra legue e match
    @Override
    public List<MatchWithDetailsDTO> findMatchesWithDetails() {
        Aggregation aggregation = newAggregation(
            lookup("league", "league_id", "id", "league"),
            lookup("team", "home_team_api_id", "team_api_id", "homeTeam"),
            lookup("team", "away_team_api_id", "team_api_id", "awayTeam"),
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
            lookup("league", "league_id", "id", "league"),
            lookup("team",   "home_team_api_id", "team_api_id", "homeTeam"),
            lookup("team",   "away_team_api_id", "team_api_id", "awayTeam"),
            unwind("league", true),
            unwind("homeTeam", true),
            unwind("awayTeam", true)
        );

        // 4) Esegui e mappa in DTO
        AggregationResults<Document> results = mongoTemplate.aggregate(agg, "match", Document.class);
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
            lookup("league", "league_id", "id", "league"),
            lookup("team", "home_team_api_id", "team_api_id", "homeTeam"),
            lookup("team", "away_team_api_id", "team_api_id", "awayTeam"),
            unwind("league", true),
            unwind("homeTeam", true),
            unwind("awayTeam", true)
        );

        AggregationResults<Document> results = mongoTemplate.aggregate(aggregation, "match", Document.class);

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
            lookup("league", "league_id", "id", "league"),
            lookup("team",   "home_team_api_id", "team_api_id", "homeTeam"),
            lookup("team",   "away_team_api_id", "team_api_id", "awayTeam"),
            unwind("league", true),
            unwind("homeTeam", true),
            unwind("awayTeam", true)
        );

        AggregationResults<Document> results = mongoTemplate.aggregate(agg, "match", Document.class);
        return results.getMappedResults().stream().map(doc -> {
            MatchWithDetailsDTO dto = new MatchWithDetailsDTO();
            dto.setMatch(mongoTemplate.getConverter().read(Match.class, doc));
            Document leagueDoc = (Document) doc.get("league");
            if (leagueDoc != null) dto.setLeague(mongoTemplate.getConverter().read(League.class, leagueDoc));
            Document homeDoc   = (Document) doc.get("homeTeam");
            if (homeDoc   != null) dto.setHomeTeam(mongoTemplate.getConverter().read(Team.class,   homeDoc));
            Document awayDoc   = (Document) doc.get("awayTeam");
            if (awayDoc   != null) dto.setAwayTeam(mongoTemplate.getConverter().read(Team.class,   awayDoc));
            return dto;
        }).toList();
    }

}
