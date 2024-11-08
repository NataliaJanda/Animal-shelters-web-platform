package com.Sheltersapp.Sheltersapp.DTO;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class OrderContributionDto {
    private Long orderId;
    private int quantity;
    private String message;

}
