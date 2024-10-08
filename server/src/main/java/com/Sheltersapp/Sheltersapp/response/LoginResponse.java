package com.Sheltersapp.Sheltersapp.response;


import com.Sheltersapp.Sheltersapp.model.Role;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LoginResponse {
    private String token;
    private long expiresIn;
    private Role role;

    public LoginResponse(String token,Role role, long expiresIn) {
        this.token = token;
        this.role = role;
        this.expiresIn = expiresIn;
    }
}
