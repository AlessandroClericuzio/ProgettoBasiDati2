package com.example.backend.repository;

import com.example.backend.dto.MatchWithDetailsDTO;
import com.example.backend.dto.StandingDTO;

import java.util.List;


public interface MatchRepositoryCustom {
    List<MatchWithDetailsDTO> findMatchesWithDetails();
    List<String> findAllAvailableDates();
    List<MatchWithDetailsDTO> findMatchesByCountryAndDate(int countryId,String date);
    List<MatchWithDetailsDTO> findMatchesByCountryId(int countryId);
    List<MatchWithDetailsDTO> findMatchesByDate(String date);
    List<StandingDTO> calculateStandings(String season, int leagueId);
    List<String> findDistinctSeasons();
}
