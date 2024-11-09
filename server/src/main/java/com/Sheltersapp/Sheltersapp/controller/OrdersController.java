package com.Sheltersapp.Sheltersapp.controller;

import com.Sheltersapp.Sheltersapp.model.*;
import com.Sheltersapp.Sheltersapp.repository.OrderContributionsRepository;
import com.Sheltersapp.Sheltersapp.repository.OrdersRepository;
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
    private final OrderContributionsRepository orderContributionsRepository;
    private final OrdersRepository ordersRepository;
    private static final Logger logger = LoggerFactory.getLogger(CampaignsController.class);
    private final JwtService jwtService;

    public OrdersController(ShelterAccountsRepository shelterAccountsRepository, OrderContributionsRepository orderContributionsRepository, OrdersRepository ordersRepository, JwtService jwtService) {
        this.shelterAccountsRepository = shelterAccountsRepository;
        this.orderContributionsRepository = orderContributionsRepository;
        this.ordersRepository = ordersRepository;
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

    @PatchMapping("/{id}/archive")
    public ResponseEntity<Void> archiveOrders(@PathVariable Long id) {
        Optional<Orders> ordersOpt = orderService.getOrderById(id);

        if (ordersOpt.isPresent()) {
            Orders orders = ordersOpt.get();
            orders.setActive(false);
            orderService.createOrders(orders);
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @Transactional
    @DeleteMapping("/admin/delete/{id}")
    public ResponseEntity<Void> deleteOrders(@PathVariable Long id) {
        Optional<Orders> orders  = ordersRepository.findById(id);
        Orders orders1 = orders.get();
        orderContributionsRepository.deleteByOrders(orders1);
        orderService.deleteOrder(id);

        return ResponseEntity.noContent().build();
    }

    @PutMapping("/admin/edit/{id}")
    public ResponseEntity<Orders> editOrders(@PathVariable Long id, @RequestBody Orders updateOrder) {
        Optional<Orders> optionalOrders = orderService.getOrderById(id);

        if (optionalOrders.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Orders existingOrders = optionalOrders.get();
        existingOrders.setInfo(updateOrder.getInfo());
        existingOrders.setCount(updateOrder.getCount());

        Orders savedOrders = orderService.createOrders(existingOrders);

        return ResponseEntity.ok(savedOrders);
    }
}
