// src/main/java/com/example/backend/controller/MatchController.java

package com.example.backend.controller;

import com.example.backend.dto.MatchWithDetailsDTO;
import com.example.backend.model.Match;
import com.example.backend.serviceInterface.MatchService;
import com.example.exception.MatchAlreadyExistsException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/matches")
public class MatchController {

    private final MatchService matchService;

    @Autowired
    public MatchController(MatchService matchService) {
        this.matchService = matchService;
    }

    @GetMapping
    public ResponseEntity<List<Match>> getAllMatches() {
        return ResponseEntity.ok(matchService.getAllMatches());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Match> getMatchById(@PathVariable String id) {
        Optional<Match> match = matchService.getMatchById(id);
        return match.map(ResponseEntity::ok)
                    .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> createMatch(@RequestBody Match match) {
        try {
            Match savedMatch = matchService.saveMatch(match);
            return ResponseEntity.ok(savedMatch);
        } catch (MatchAlreadyExistsException ex) {
            return ResponseEntity.status(409).body(ex.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Match> updateMatch(
        @PathVariable String id,
        @RequestBody Match updatedMatch
    ) {
        Optional<Match> matchOpt = matchService.getMatchById(id);
        if (matchOpt.isPresent()) {
            updatedMatch.setId(id);
            Match saved = matchService.saveMatch(updatedMatch);
            return ResponseEntity.ok(saved);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMatch(@PathVariable String id) {
        Optional<Match> match = matchService.getMatchById(id);
        if (match.isPresent()) {
            matchService.deleteMatch(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/with-details")
    public ResponseEntity<List<MatchWithDetailsDTO>> getMatchesWithDetails() {
        return ResponseEntity.ok(matchService.getMatchesWithDetails());
    }

    @GetMapping("/by-country-and-date")
    public List<MatchWithDetailsDTO> getByCountryAndDate(
        @RequestParam int countryId,
        @RequestParam String date
    ) {
        return matchService.findMatchesByCountryAndDate(countryId, date);
    }

    @GetMapping("/available-dates")
    public List<String> getAvailableDates() {
        return matchService.findAllAvailableDates();
    }

    @GetMapping("/by-country/{countryId}")
    public List<MatchWithDetailsDTO> getMatchesByCountry(
        @PathVariable int countryId
    ) {
        return matchService.findMatchesByCountryId(countryId);
    }

    @GetMapping("/by-date")
    public List<MatchWithDetailsDTO> getByDate(@RequestParam String date) {
        return matchService.findMatchesByDate(date);
    }
}
