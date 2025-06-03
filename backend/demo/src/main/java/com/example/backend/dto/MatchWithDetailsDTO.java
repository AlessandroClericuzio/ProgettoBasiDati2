package com.example.backend.dto;

import com.example.backend.model.League;
import com.example.backend.model.Match;
import com.example.backend.model.Team;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Data
public class MatchWithDetailsDTO {
    private Match match;
    private League league;
    private Team homeTeam;
    private Team awayTeam;
}
