// src/main/java/com/example/backend/serviceInterface/LeagueService.java

package com.example.backend.serviceInterface;

import java.util.List;
import java.util.Optional;

import com.example.backend.model.League;

public interface LeagueService {
    Optional<League> getLeagueById(String id);
    Optional<League> getLeagueByLeagueId(int leagueId);
    League saveLeague(League league);
    List<League> getAllLeagues();
    void deleteLeague(String id);
    List<League> findByCountryId(int countryId);
    List<League> searchLeaguesByName(String query);

}
