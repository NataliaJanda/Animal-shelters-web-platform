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
    private String name;
    private String last_name;
    private String address;
    private String phone_number;
    private String email;
    private String experience;
    private int animal_id;

    @OneToOne
    @JoinColumn(name = "user_id")
    private Users users;

}
