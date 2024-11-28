package com.Sheltersapp.Sheltersapp.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
public class Adoption {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private LocalDateTime date;
    private String description;

    @OneToOne
    @JoinColumn(name = "user_id")
    private Users users;

//    @OneToOne
//    @JoinColumn(name = "animal_id")
//    private Animal animal;

//    @ManyToOne
//    @JoinColumn(name = "shelter_id")
//    private Shelter shelter;

}
