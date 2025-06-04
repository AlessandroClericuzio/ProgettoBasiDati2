// src/main/java/com/example/backend/controller/LeagueController.java

package com.example.backend.controller;

import com.example.backend.model.League;
import com.example.backend.serviceInterface.LeagueService;
import com.example.exception.LeagueAlreadyExistsException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/leagues")
public class LeagueController {

    private final LeagueService leagueService;

    @Autowired
    public LeagueController(LeagueService leagueService) {
        this.leagueService = leagueService;
    }

    @GetMapping
    public ResponseEntity<List<League>> getAllLeagues() {
        return ResponseEntity.ok(leagueService.getAllLeagues());
    }

    @GetMapping("/{id}")
    public ResponseEntity<League> getLeagueById(@PathVariable String id) {
        Optional<League> league = leagueService.getLeagueById(id);
        return league.map(ResponseEntity::ok)
                     .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> createLeague(@RequestBody League league) {
        try {
            League saved = leagueService.saveLeague(league);
            return ResponseEntity.ok(saved);
        } catch (LeagueAlreadyExistsException ex) {
            // Restituisco 409 + messaggio
            return ResponseEntity.status(409).body(ex.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<League> updateLeague(
        @PathVariable String id,
        @RequestBody League updatedLeague
    ) {
        boolean updated = leagueService.updateLeague(id, updatedLeague);
        if (updated) {
            // Ritorniamo il documento aggiornato
            Optional<League> league = leagueService.getLeagueById(id);
            return league.map(ResponseEntity::ok)
                        .orElseGet(() -> ResponseEntity.notFound().build());
        } else {
            return ResponseEntity.notFound().build();
        }
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteLeague(@PathVariable String id) {
        Optional<League> league = leagueService.getLeagueById(id);
        if (league.isPresent()) {
            leagueService.deleteLeague(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/by-country/{countryId}")
    public List<League> getLeaguesByCountry(@PathVariable int countryId) {
        return leagueService.findByCountryId(countryId);
    }

    @GetMapping("/byLeagueId/{leagueId}")
    public ResponseEntity<League> getLeagueByLeagueId(@PathVariable int leagueId) {
        Optional<League> league = leagueService.getLeagueByLeagueId(leagueId);
        System.out.println("Fetching league by ID: " + leagueId);

        return league.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/byLeagueId/{leagueId}")
    public ResponseEntity<League> updateLeagueByLeagueId(
        @PathVariable int leagueId,
        @RequestBody League updatedLeague
    ) {
        Optional<League> existing = leagueService.getLeagueByLeagueId(leagueId);
        if (existing.isPresent()) {
            League leagueToUpdate = existing.get();
            // Imposta l’ID mongo originale (stringa) per fare save
            updatedLeague.setId(leagueToUpdate.getId());
            League saved = leagueService.saveLeague(updatedLeague);
            return ResponseEntity.ok(saved);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/byLeagueId/{leagueId}")
    public ResponseEntity<Void> deleteLeagueByLeagueId(@PathVariable int leagueId) {
        Optional<League> league = leagueService.getLeagueByLeagueId(leagueId);
        if (league.isPresent()) {
            leagueService.deleteLeague(league.get().getId()); 
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/search")
    public ResponseEntity<List<League>> searchLeaguesByName(@RequestParam String query) {
        if (query == null || query.trim().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        List<League> results = leagueService.searchLeaguesByName(query);
        return ResponseEntity.ok(results);
    }
 

}
