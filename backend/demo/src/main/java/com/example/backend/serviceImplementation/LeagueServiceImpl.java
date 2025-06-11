// src/main/java/com/example/backend/serviceImplementation/LeagueServiceImpl.java

package com.example.backend.serviceImplementation;

import com.example.backend.exception.LeagueAlreadyExistsException;
import com.example.backend.model.League;
import com.example.backend.serviceInterface.LeagueService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class LeagueServiceImpl implements LeagueService {

    @Autowired
    private MongoTemplate mongoTemplate;

    @Override
    public Optional<League> getLeagueById(String id) {
        // Trova per _id di Mongo (stringa)
        return Optional.ofNullable(mongoTemplate.findById(id, League.class));
    }

    @Override
    public Optional<League> getLeagueByLeagueId(int leagueId) {
        Query query = new Query(Criteria.where("leagueId").is(leagueId)); 
        System.out.println("Mongo query: " + query.toString());

        League league = mongoTemplate.findOne(query, League.class);
        return Optional.ofNullable(league);
    }



    @Override
    public List<League> getAllLeagues() {
        return mongoTemplate.findAll(League.class);
    }

    @Override
    public void deleteLeague(String id) {
        Query query = new Query(Criteria.where("_id").is(id));
        mongoTemplate.remove(query, League.class);
    }

    @Override
    public List<League> findByCountryId(int countryId) {
        Query query = new Query(Criteria.where("country_id").is(countryId));
        return mongoTemplate.find(query, League.class);
    }

    @Override
    public League saveLeague(League league) {
        // 1) Verifico che non esista già un leagueId identico
        Query qId = new Query(Criteria.where("id").is(league.getLeagueId()));
        boolean existsById = mongoTemplate.exists(qId, League.class);
        if (existsById) {
            throw new LeagueAlreadyExistsException(
                "Lega con leagueId " + league.getLeagueId() + " già esistente.");
        }

        // 2) Verifico che non esista già, nello stesso country, una lega con lo stesso name
        Query qName = new Query(
            Criteria.where("country_id").is(league.getCountryId())
                    .and("name").is(league.getName())
        );
        boolean existsByName = mongoTemplate.exists(qName, League.class);
        if (existsByName) {
            throw new LeagueAlreadyExistsException(
                "Nel country " + league.getCountryId() +
                " esiste già una lega con nome '" + league.getName() + "'.");
        }

        // 3) Se non ci sono duplicati, salvo
        return mongoTemplate.save(league);
    }

    @Override
    public List<League> searchLeaguesByName(String query) {
        // Case insensitive, ricerca "contiene"
        Query mongoQuery = new Query(Criteria.where("name").regex(".*" + query + ".*", "i"));
        return mongoTemplate.find(mongoQuery, League.class);
    }

    @Override
    public boolean updateLeague(String id, League updatedLeague) {
        Query query = new Query(Criteria.where("_id").is(id));
        Update update = new Update()
            .set("leagueId", updatedLeague.getLeagueId())
            .set("name", updatedLeague.getName())
            .set("country_id", updatedLeague.getCountryId());
        var result = mongoTemplate.updateFirst(query, update, League.class);
        return result.getModifiedCount() > 0;
    }



}
