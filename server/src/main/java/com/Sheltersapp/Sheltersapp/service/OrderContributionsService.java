package com.Sheltersapp.Sheltersapp.service;

import com.Sheltersapp.Sheltersapp.model.Ordercontributions;
import com.Sheltersapp.Sheltersapp.repository.OrderContributionsRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

@Service
public class OrderContributionsService {

    private final OrderContributionsRepository orderContributionsRepository;

    public OrderContributionsService(OrderContributionsRepository orderContributionsRepository) {
        this.orderContributionsRepository = orderContributionsRepository;
    }

    @Transactional
    public Ordercontributions createOrderContributions(Ordercontributions orderContributions){
        return orderContributionsRepository.save(orderContributions);
    }
}
