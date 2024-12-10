package com.Sheltersapp.Sheltersapp.DTO;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AdoptionFormDTO {
    private String name;
    private String surname;
    private String address;
    private String phoneNumber;
    private String email;
    private String experience;
    private String shelterEmail;
    private int animal_id;
}
