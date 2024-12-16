package com.Sheltersapp.Sheltersapp.service;

import com.Sheltersapp.Sheltersapp.model.Adoption;
import com.Sheltersapp.Sheltersapp.model.Ordercontributions;
import com.Sheltersapp.Sheltersapp.repository.OrderContributionsRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class OrderContributionsService {

    private final OrderContributionsRepository orderContributionsRepository;

    public OrderContributionsService(OrderContributionsRepository orderContributionsRepository) {
        this.orderContributionsRepository = orderContributionsRepository;
    }
    public Ordercontributions save(Ordercontributions ordercontributions){
        return orderContributionsRepository.save(ordercontributions);
    }

    @Transactional
    public Ordercontributions createOrderContributions(Ordercontributions orderContributions){
        return orderContributionsRepository.save(orderContributions);
    }
    public Optional<Ordercontributions> getContributionById(Long id){
        return orderContributionsRepository.findById(id);
    }

    public List<Ordercontributions> findByOrdersId(Long ordersId) {
        return orderContributionsRepository.findByOrdersId(ordersId);
    }
    public void deleteContributions(Long id){
        orderContributionsRepository.deleteById(id);
    }

    public List<Ordercontributions> findByShelterId(Long shelterId) {
        return orderContributionsRepository.findByShelterId(shelterId);
    }
}
