package com.Sheltersapp.Sheltersapp.repository;

import com.Sheltersapp.Sheltersapp.model.Campaigns;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CampaignsRepository extends JpaRepository<Campaigns, Long> {
    List<Campaigns> findByShelterId(Long shelterId);
}
