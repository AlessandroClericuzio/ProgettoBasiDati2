package com.example.backend.dto;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class StandingDTO {

    private String teamName;
    private int goalsFor;
    private int goalsAgainst;
    private int goalDifference;
    private int points;

}
