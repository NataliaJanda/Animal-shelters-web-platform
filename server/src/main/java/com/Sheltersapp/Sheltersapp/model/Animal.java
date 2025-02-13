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
    private String description;
    private String sex;
    private String size;
    private String race;
    private boolean vaccination;
    private int age;
    private boolean available;

    @ManyToOne
    @JoinColumn(name = "shelter_id")
    private Shelter shelter;

    @ManyToOne
    @JoinColumn(name = "species_id")
    private Species species;

//    @OneToOne
//    @JoinColumn(name = "adoption_id")
//    private Adoption adoption;

}
