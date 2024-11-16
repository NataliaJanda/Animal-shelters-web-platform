package com.Sheltersapp.Sheltersapp.response;

import com.Sheltersapp.Sheltersapp.model.Role;
import lombok.Getter;
import lombok.Setter;
@Getter
@Setter
public class LoginResponseShelter {

    private String token;
    private Long shelterId;
    private long expiresIn;
    private Role role;
    private String message;

    public LoginResponseShelter(String token, Role role, Long shelterId, long expiresIn) {
        this.token = token;
        this.shelterId = shelterId;
        this.role = role;
        this.expiresIn = expiresIn;
    }
    public LoginResponseShelter(String message) {
        this.message = message;
    }
}

