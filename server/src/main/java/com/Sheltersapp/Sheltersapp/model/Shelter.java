package com.Sheltersapp.Sheltersapp.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@Entity
public class Shelter {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String address;
    private String description;

    @OneToMany
    @JoinColumn(name = "shelter_id")
    private List<Animal> animals;

    @OneToMany
    @JoinColumn(name = "shelter_id")
    private List<Campaigns> campaigns;

    @OneToMany
    @JoinColumn(name = "shelter_id")
    private List<Shelter_accounts> shelterAccounts;

    @OneToMany
    @JoinColumn(name = "shelter_id")
    private List<News> news;
}
