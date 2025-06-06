package com.example.backend.serviceInterface;

import java.util.List;

import com.example.backend.dto.StandingDTO;

public interface StandingsService {

    List<StandingDTO> getStandings(String season, Integer leagueId);
    List<String> getAvailableSeasons();
    
}
