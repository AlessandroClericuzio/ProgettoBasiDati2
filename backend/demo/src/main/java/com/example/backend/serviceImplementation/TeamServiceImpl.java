package com.example.backend.serviceImplementation;

import com.example.backend.model.Team;
import com.example.backend.serviceInterface.TeamService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TeamServiceImpl implements TeamService {

    private final MongoTemplate mongoTemplate;

    @Autowired
    public TeamServiceImpl(MongoTemplate mongoTemplate) {
        this.mongoTemplate = mongoTemplate;
    }

    @Override
    public Optional<Team> getTeamById(String id) {
        Query query = new Query(Criteria.where("_id").is(id));
        Team team = mongoTemplate.findOne(query, Team.class);
        return Optional.ofNullable(team);
    }

    @Override
    public Team saveTeam(Team team) {
        return mongoTemplate.save(team);
    }

    @Override
    public List<Team> getAllTeams() {
        Query query = new Query(); // Nessun filtro = tutti i documenti
        return mongoTemplate.find(query, Team.class);
    }

    @Override
    public void deleteTeam(String id) {
        Query query = new Query(Criteria.where("_id").is(id));
        mongoTemplate.remove(query, Team.class);
    }

    @Override
    public Optional<Team> getTeamByTeamApiId(int teamApiId) {
        Query query = new Query(Criteria.where("team_api_id").is(teamApiId));
        Team team = mongoTemplate.findOne(query, Team.class);
        return Optional.ofNullable(team);
    }

}
