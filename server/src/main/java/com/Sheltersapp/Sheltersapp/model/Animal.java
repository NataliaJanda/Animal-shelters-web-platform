package com.Sheltersapp.Sheltersapp.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
public class Animal {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String atitude;
    private int age;

    @ManyToOne
    @JoinColumn(name = "shelter_id")
    private Shelter shelter;

    @ManyToOne
    @JoinColumn(name = "species_id")
    private Species species;

//    @OneToOne
//    @JoinColumn(name = "animal_id")
//    private Adoption adoption;
//
//    @OneToMany
//    @JoinColumn(name = "animal_id")
//    private List<Photo> photo;

}
