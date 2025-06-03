package com.example.backend.serviceImplementation;

import com.example.backend.model.Country;
import com.example.backend.serviceInterface.CountryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CountryServiceImpl implements CountryService {

    @Autowired
    private MongoTemplate mongoTemplate;

    @Override
   public List<Country> getAllCountries() {
    Query query = new Query(); 
    return mongoTemplate.find(query, Country.class);
}
}
