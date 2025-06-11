package com.example.backend.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.example.backend.serviceInterface.StandingsService;

@RestController
@RequestMapping("/api/standings")
public class StandingsController {

    private final StandingsService standingsService;

    @Autowired
    public StandingsController(StandingsService standingsService) {
        this.standingsService = standingsService;
    }

    // GET /api/standings?season=2008/2009&leagueIds=1
    @GetMapping
    public ResponseEntity<?> getStandings(
            @RequestParam String season,
            @RequestParam Integer leagueId
    ) {
        return ResponseEntity.ok(standingsService.getStandings(season, leagueId));
    }

    @GetMapping("/seasons")
    public List<String> getAvailableSeasons() {
        return standingsService.getAvailableSeasons();
    }
}
