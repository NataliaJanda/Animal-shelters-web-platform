package com.Sheltersapp.Sheltersapp.DTO;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class RegisterUser {
    private String email;
    private String username;
    private String name;
    private String lastName;
    private String password;
}
