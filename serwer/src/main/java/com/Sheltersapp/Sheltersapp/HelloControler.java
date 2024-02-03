package com.Sheltersapp.Sheltersapp;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HelloControler {
    @GetMapping("/")
    public String index() {
        return "Greetings from Spring Boot!";
    }
}
