package com.example.backend.serviceImplementation;

import com.example.backend.dto.StandingDTO;
import com.example.backend.repository.MatchRepositoryCustom;
import com.example.backend.serviceInterface.StandingsService;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class StandingsServiceImpl implements StandingsService{

    @Autowired
    private MatchRepositoryCustom matchRepositoryCustom;

     @Override
    public List<StandingDTO> getStandings(String season, Integer leagueId) {
        return matchRepositoryCustom.calculateStandings(season, leagueId);
    }

  
    @Override
    public List<String> getAvailableSeasons() {
        List<String> seasons = matchRepositoryCustom.findDistinctSeasons();
        // Puoi ordinare o elaborare la lista, es:
        seasons.sort((a, b) -> b.compareTo(a)); // ordina in ordine decrescente (dalla più recente)
        return seasons;
    }

}
