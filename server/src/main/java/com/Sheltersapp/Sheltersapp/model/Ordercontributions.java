package com.Sheltersapp.Sheltersapp.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@Entity
public class Ordercontributions {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private int quantity;
    private LocalDateTime date;
    private String message;
    private boolean is_accept;

    @ManyToOne
    @JoinColumn(name = "shelter_id")
    private Shelter shelter;

    @ManyToOne
    @JoinColumn(name = "order_id")
    private Orders orders;
}
