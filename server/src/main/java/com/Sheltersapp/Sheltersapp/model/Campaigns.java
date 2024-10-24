package com.Sheltersapp.Sheltersapp.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@Entity
public class Campaigns {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String title;
    private String description;
    private LocalDate start_date;
    private LocalDate end_date;
    private String goal;

    @ManyToOne
    @JoinColumn(name = "shelter_id")
    private Shelter shelter;
}
