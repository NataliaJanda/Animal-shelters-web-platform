package com.Sheltersapp.Sheltersapp.DTO;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RegisterShelter {
    private String email;
    private String username;
    private String name;
    private String last_name;
    private String phone_number;
    private String password;
    private String address;
    private String commune;
    private String post_code;
    private String town;
    private String county;
    private String real_estate_number;
    private Integer regon;
    private String voivodeship;
}
