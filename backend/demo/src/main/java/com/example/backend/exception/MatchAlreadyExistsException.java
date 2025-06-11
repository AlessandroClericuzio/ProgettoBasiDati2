package com.example.backend.exception;


import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;


@ResponseStatus(HttpStatus.CONFLICT)
public class MatchAlreadyExistsException extends RuntimeException {
    public MatchAlreadyExistsException(String message) {
        super(message);
    }
}
