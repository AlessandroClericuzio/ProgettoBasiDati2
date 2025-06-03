package com.example.backend.serviceInterface;


import com.example.backend.dto.MatchWithDetailsDTO;
import com.example.backend.model.Match;

import java.util.List;
import java.util.Optional;

public interface MatchService {
    Optional<Match> getMatchById(String id);
    Match saveMatch(Match match);
    List<Match> getAllMatches();
    void deleteMatch(String id);
    List<MatchWithDetailsDTO> getMatchesWithDetails();
    List<String> findAllAvailableDates();
    List<MatchWithDetailsDTO> findMatchesByCountryAndDate(int countryId, String date);
    List<MatchWithDetailsDTO> findMatchesByCountryId(int countryId);
    List<MatchWithDetailsDTO> findMatchesByDate(String date);


}
