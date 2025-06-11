// src/main/java/com/example/backend/serviceImplementation/MatchServiceImpl.java

package com.example.backend.serviceImplementation;

import com.example.backend.dto.MatchWithDetailsDTO;
import com.example.backend.exception.MatchAlreadyExistsException;
import com.example.backend.model.Match;
import com.example.backend.repository.MatchRepositoryCustom;
import com.example.backend.serviceInterface.MatchService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class MatchServiceImpl implements MatchService {

    private final MongoTemplate mongoTemplate;
    private final MatchRepositoryCustom matchRepositoryCustom;

    @Autowired
    public MatchServiceImpl(
        MongoTemplate mongoTemplate,
        MatchRepositoryCustom matchRepositoryCustom
    ) {
        this.mongoTemplate = mongoTemplate;
        this.matchRepositoryCustom = matchRepositoryCustom;
    }

    @Override
    public Optional<Match> getMatchById(String id) {
        Query query = new Query(Criteria.where("_id").is(id));
        Match match = mongoTemplate.findOne(query, Match.class);
        return Optional.ofNullable(match);
    }

    @Override
    public Match saveMatch(Match match) {
        // 1) Verifico che non esista già un match con lo stesso matchApiId
        Query qId = new Query(Criteria.where("match_api_id").is(match.getMatchApiId()));
        boolean existsById = mongoTemplate.exists(qId, Match.class);
        if (existsById) {
            throw new MatchAlreadyExistsException(
                "Partita con matchApiId " + match.getMatchApiId() + " già esistente."
            );
        }

        // 2) Verifico che non esista già un match logico identico:
        //    stesso countryId, leagueId, homeTeamApiId, awayTeamApiId, stessa data
        Query qLogical = new Query(
            Criteria.where("country_id").is(match.getCountryId())
                    .and("league_id").is(match.getLeagueId())
                    .and("home_team_api_id").is(match.getHomeTeamApiId())
                    .and("away_team_api_id").is(match.getAwayTeamApiId())
                    .and("date").is(match.getDate())
        );
        boolean existsLogical = mongoTemplate.exists(qLogical, Match.class);
        if (existsLogical) {
            throw new MatchAlreadyExistsException(
                "Una partita per la stessa data e stesse squadre in questa lega è già registrata."
            );
        }

        // 3) Se non ci sono duplicati, salvo
        return mongoTemplate.save(match);
    }

    @Override
    public List<Match> getAllMatches() {
        Query query = new Query();
        return mongoTemplate.find(query, Match.class);
    }

    @Override
    public void deleteMatch(String id) {
        Query query = new Query(Criteria.where("_id").is(id));
        mongoTemplate.remove(query, Match.class);
    }

    @Override
    public List<MatchWithDetailsDTO> getMatchesWithDetails() {
        return matchRepositoryCustom.findMatchesWithDetails();
    }

    @Override
    public List<String> findAllAvailableDates() {
        return matchRepositoryCustom.findAllAvailableDates();
    }

    @Override
    public List<MatchWithDetailsDTO> findMatchesByCountryAndDate(
        int countryId,
        String date
    ) {
        return matchRepositoryCustom.findMatchesByCountryAndDate(countryId, date);
    }

    @Override
    public List<MatchWithDetailsDTO> findMatchesByCountryId(int countryId) {
        return matchRepositoryCustom.findMatchesByCountryId(countryId);
    }

    @Override
    public List<MatchWithDetailsDTO> findMatchesByDate(String date) {
        return matchRepositoryCustom.findMatchesByDate(date);
    }
}
