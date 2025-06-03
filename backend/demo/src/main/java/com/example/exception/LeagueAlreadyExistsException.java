package com.example.exception;


import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

// Restituisce HTTP 409 se sollevata
@ResponseStatus(HttpStatus.CONFLICT)
public class LeagueAlreadyExistsException extends RuntimeException {
    public LeagueAlreadyExistsException(String message) {
        super(message);
    }
}
