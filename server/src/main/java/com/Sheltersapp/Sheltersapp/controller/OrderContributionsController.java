package com.Sheltersapp.Sheltersapp.controller;

import com.Sheltersapp.Sheltersapp.DTO.OrderContributionDto;
import com.Sheltersapp.Sheltersapp.model.Ordercontributions;
import com.Sheltersapp.Sheltersapp.model.Orders;
import com.Sheltersapp.Sheltersapp.model.Shelter;
import com.Sheltersapp.Sheltersapp.model.Shelter_accounts;
import com.Sheltersapp.Sheltersapp.repository.OrderContributionsRepository;
import com.Sheltersapp.Sheltersapp.repository.OrdersRepository;
import com.Sheltersapp.Sheltersapp.repository.ShelterAccountsRepository;
import com.Sheltersapp.Sheltersapp.service.JwtService;
import com.Sheltersapp.Sheltersapp.service.OrderContributionsService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;


import java.time.LocalDateTime;
import java.util.Optional;

@RestController
@RequestMapping("/OrderContributions")
public class OrderContributionsController {

    private static final Logger logger = LoggerFactory.getLogger(Ordercontributions.class);

    private final JwtService jwtService;
    private final ShelterAccountsRepository shelterAccountsRepository;
    private final OrdersRepository ordersRepository;
    private final OrderContributionsService orderContributionsService;
    private final OrderContributionsRepository orderContributionsRepository;

    public OrderContributionsController(JwtService jwtService, ShelterAccountsRepository shelterAccountsRepository, OrdersRepository ordersRepository, OrderContributionsService orderContributionsService, OrderContributionsRepository orderContributionsRepository) {
        this.jwtService = jwtService;
        this.shelterAccountsRepository = shelterAccountsRepository;
        this.ordersRepository = ordersRepository;
        this.orderContributionsService = orderContributionsService;
        this.orderContributionsRepository = orderContributionsRepository;
    }

    @PostMapping("/admin/add")
    public ResponseEntity<?> createOrderContribution(@RequestBody OrderContributionDto orderContributionDto, @RequestHeader("Authorization")String authHeader ) {

        String jwtToken = authHeader.substring(7);
        String username = jwtService.extractUsername(jwtToken);
        Optional<Shelter_accounts> shelter_accounts_Optional = shelterAccountsRepository.findByUsername(username);
        Shelter_accounts shelter_accounts = shelter_accounts_Optional.get();
        Shelter userShelter = shelter_accounts.getShelter_id();

        Orders order = ordersRepository.findById(orderContributionDto.getOrderId())
                .orElseThrow(() -> new EntityNotFoundException("Order not found"));

        Ordercontributions orderContribution = new Ordercontributions();
        orderContribution.setOrders(order);
        orderContribution.setShelter(userShelter);
        orderContribution.setQuantity(orderContributionDto.getQuantity());
        orderContribution.setMessage(orderContributionDto.getMessage());
        orderContribution.setDate(LocalDateTime.now());

        orderContributionsRepository.save(orderContribution);
        return ResponseEntity.ok("Order Contribution created successfully");
    }

}
