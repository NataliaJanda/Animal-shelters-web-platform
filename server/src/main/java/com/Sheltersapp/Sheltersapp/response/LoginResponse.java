package com.Sheltersapp.Sheltersapp.response;


import com.Sheltersapp.Sheltersapp.model.Role;
import lombok.Getter;
import lombok.Setter;
import org.springframework.http.ResponseEntity;

@Getter
@Setter
public class LoginResponse{
    private String token;
    private long expiresIn;
    private Role role;
    private Long userId;
    private String message;

    public LoginResponse(String token,Role role, long expiresIn, long userId) {
        this.token = token;
        this.userId = userId;
        this.role = role;
        this.expiresIn = expiresIn;
    }
    public LoginResponse(String message) {
        this.message = message;
    }
}
