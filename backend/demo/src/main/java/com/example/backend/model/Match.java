// src/main/java/com/example/backend/model/Match.java

package com.example.backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.CompoundIndexes;

import lombok.Data;

@Document(collection = "matches")
@CompoundIndexes({
    @CompoundIndex(
        name = "unique_match_per_combo",
        def = "{'country_id': 1, 'league_id': 1, "
            + "'home_team_api_id': 1, 'away_team_api_id': 1, 'date': 1}",
        unique = true
    )
})
@Data
public class Match {
    @Id
    private String id;

    @Field("match_api_id")
    @Indexed(unique = true)
    private int matchApiId;

    @Field("country_id")
    private int countryId;

    @Field("league_id")
    private int leagueId;

    @Field("season")
    private String season;

    @Field("stage")
    private int stage;

    @Field("date")
    private String date;

    @Field("home_team_api_id")
    private int homeTeamApiId;

    @Field("away_team_api_id")
    private int awayTeamApiId;

    @Field("home_team_goal")
    private int homeTeamGoal;

    @Field("away_team_goal")
    private int awayTeamGoal;

    // Betting odds (opzionali)
    @Field("B365H")
    private Double b365h;

    @Field("B365D")
    private Double b365d;

    @Field("B365A")
    private Double b365a;

    @Field("BWH")
    private Double bwh;

    @Field("BWD")
    private Double bwd;

    @Field("BWA")
    private Double bwa;

    @Field("IWH")
    private Double iwh;

    @Field("IWD")
    private Double iwd;

    @Field("IWA")
    private Double iwa;
}
