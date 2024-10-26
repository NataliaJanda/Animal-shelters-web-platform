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
    private Long userId;

    public LoginResponse(String token,Role role, long expiresIn, long userId) {
        this.token = token;
        this.userId = userId;
        this.role = role;
        this.expiresIn = expiresIn;
    }
}
