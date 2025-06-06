package com.example.backend.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

@Data
@Document(collection = "countries")
public class Country {
    @Id
    private String id;

    @Field("id")
    private int countryId;

    @Field("name")
    private String name;
}
