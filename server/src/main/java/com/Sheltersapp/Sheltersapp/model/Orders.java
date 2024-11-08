package com.Sheltersapp.Sheltersapp.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@Entity
public class Orders {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private LocalDateTime date;
    private String name;
    private int count;
    private String link;
    private String info;
    private boolean active;
    private boolean ispublic;

    @ManyToOne
    @JoinColumn(name = "shelter_id")
    private Shelter shelter;
}
