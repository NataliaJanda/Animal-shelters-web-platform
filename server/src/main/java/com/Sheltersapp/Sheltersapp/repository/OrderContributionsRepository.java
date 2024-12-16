package com.Sheltersapp.Sheltersapp.repository;

import com.Sheltersapp.Sheltersapp.model.Ordercontributions;
import com.Sheltersapp.Sheltersapp.model.Orders;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public interface OrderContributionsRepository extends JpaRepository<Ordercontributions, Long> {
    List<Ordercontributions> findByOrdersId(Long order_id);
    @Transactional
    void deleteByOrders(Orders orders);
    List<Ordercontributions> findByShelterId(Long shelterId);

}
