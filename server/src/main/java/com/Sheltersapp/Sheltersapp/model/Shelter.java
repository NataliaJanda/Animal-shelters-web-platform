package com.Sheltersapp.Sheltersapp.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
public class Shelter {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String description;
    private String address;
    private String commune;
    private String post_code;
    private String town;
    private String county;
    private String real_estate_number;
    private String regon;
    private String voivodeship;

    public Shelter(String name, String address, String commune, String post_code, String town, String county, String real_estate_number, String regon, String voivodeship) {
        this.name = name;
        this.address = address;
        this.commune = commune;
        this.post_code = post_code;
        this.town = town;
        this.county = county;
        this.real_estate_number = real_estate_number;
        this.regon = regon;
        this.voivodeship = voivodeship;
    }

    public Shelter(){}

}
