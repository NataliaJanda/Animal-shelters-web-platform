package com.Sheltersapp.Sheltersapp.DTO;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class VerifyUser {
    private String username;
    private String verificationCode;
}
