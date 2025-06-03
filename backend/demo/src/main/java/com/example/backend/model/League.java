// src/main/java/com/example/backend/model/League.java

package com.example.backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.CompoundIndexes;

import lombok.Data;

@Document(collection = "league")
// Índice único composto su (country_id, name) per evitare duplicati di nome nello stesso paese
@CompoundIndexes({
    @CompoundIndex(name = "unique_country_name", def = "{'country_id': 1, 'name': 1}", unique = true)
})
@Data
public class League {
    @Id
    private String id;

    @Field("id")
    @Indexed(unique = true)
    private int leagueId;
    
    @Field("country_id")
    private int countryId;

    @Field("name")
    private String name;
}
