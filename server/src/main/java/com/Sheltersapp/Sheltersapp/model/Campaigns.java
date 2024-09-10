package com.Sheltersapp.Sheltersapp.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@Entity
public class Campaigns {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    private String description;
    private String start_date;
    private String end_date;
    private String goal;

    public Campaigns(String description, String start_date, String end_date, String goal) {
        this.description = description;
        this.start_date = start_date;
        this.end_date = end_date;
        this.goal = goal;
    }

    public Campaigns() {
    }

}
