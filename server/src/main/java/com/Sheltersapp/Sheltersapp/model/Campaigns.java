package com.Sheltersapp.Sheltersapp.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
public class Campaigns {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String description;
    private String start_date;
    private String end_date;
    private String goal;

    @ManyToOne
    @JoinColumn(name = "shelter_id")
    private Shelter shelter;
}
