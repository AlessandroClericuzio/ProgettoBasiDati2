
package com.example.backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Document(collection = "teams")
@Getter
@Setter
@Data
public class Team {
  @Id
    private String id;

    @Field("team_api_id")
    private int teamApiId;

    @Field("team_fifa_api_id")
    private int teamFifaApiId;

    @Field("team_long_name")
    private String teamLongName;

    @Field("team_short_name")
    private String teamShortName;

    // Getters & Setters
}
