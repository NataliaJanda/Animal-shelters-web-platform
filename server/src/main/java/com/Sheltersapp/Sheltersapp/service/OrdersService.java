package com.Sheltersapp.Sheltersapp.service;

import com.Sheltersapp.Sheltersapp.model.Orders;
import com.Sheltersapp.Sheltersapp.repository.OrdersRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;


@Service
public class OrdersService {
    private final OrdersRepository orderRepository;
    public OrdersService(OrdersRepository orderRepository) {
        this.orderRepository = orderRepository;
    }
    public List<Orders> allOrders(){
        return orderRepository.findAll();
    }
    @Transactional
    public Orders createOrders(Orders orders){
        return orderRepository.save(orders);
    }
    public Optional<Orders> getOrderById(Long id){
        return orderRepository.findById(id);
    }
    public List<Orders> findByShelterId(Long shelterId) {
        return orderRepository.findByShelterId(shelterId);
    }
    public void deleteOrder(Long id){
        orderRepository.deleteById(id);
    }
}
