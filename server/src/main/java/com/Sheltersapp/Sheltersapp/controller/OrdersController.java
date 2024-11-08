package com.Sheltersapp.Sheltersapp.controller;

import com.Sheltersapp.Sheltersapp.model.Orders;
import com.Sheltersapp.Sheltersapp.model.Shelter;
import com.Sheltersapp.Sheltersapp.model.Shelter_accounts;
import com.Sheltersapp.Sheltersapp.repository.ShelterAccountsRepository;
import com.Sheltersapp.Sheltersapp.service.JwtService;
import com.Sheltersapp.Sheltersapp.service.OrdersService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;


import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/orders")
public class OrdersController {
    @Autowired
    private OrdersService orderService;
    private final ShelterAccountsRepository shelterAccountsRepository;
    private static final Logger logger = LoggerFactory.getLogger(CampaignsController.class);
    private final JwtService jwtService;

    public OrdersController(ShelterAccountsRepository shelterAccountsRepository, JwtService jwtService) {
        this.shelterAccountsRepository = shelterAccountsRepository;
        this.jwtService = jwtService;
    }
    @GetMapping("")
    @Transactional(readOnly = true)
    public ResponseEntity<List<Orders>> getAllOrders() {
        List<Orders> orders = orderService.allOrders();
        return ResponseEntity.ok(orders);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Orders> getCampaignById(@PathVariable Long id) {
        Optional<Orders> orders = orderService.getOrderById(id);
        return orders.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping("/admin/add")
    public ResponseEntity<Orders> createOrders(@RequestBody Orders orders, @RequestHeader("Authorization")String authHeader ){

        String jwtToken = authHeader.substring(7);
        String username = jwtService.extractUsername(jwtToken);
        Optional<Shelter_accounts> shelter_accounts_Optional = shelterAccountsRepository.findByUsername(username);
        Shelter_accounts shelter_accounts = shelter_accounts_Optional.get();
        Shelter userShelter = shelter_accounts.getShelter_id();
        orders.setShelter(userShelter);

        orders.setDate(LocalDateTime.now());

        logger.info("Request received to create orders: {}", orders);

        try {
            Orders savedOrders = orderService.createOrders(orders);
            logger.info("Campaign orders created: {}", savedOrders);
            return ResponseEntity.ok(savedOrders);
        } catch (Exception e) {
            logger.error("Error orders campaign", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/shelter/{shelter_id}")
    public ResponseEntity<List<Orders>> getOrdersByShelterId(@PathVariable Long shelter_id) {
        try {
            List<Orders> orders = orderService.findByShelterId(shelter_id);

            if (orders.isEmpty()) {
                return ResponseEntity.noContent().build();
            }

            return ResponseEntity.ok(orders);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
