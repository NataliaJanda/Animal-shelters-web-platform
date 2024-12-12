package com.Sheltersapp.Sheltersapp.controller;

import com.Sheltersapp.Sheltersapp.model.*;
import com.Sheltersapp.Sheltersapp.repository.NewsRepository;
import com.Sheltersapp.Sheltersapp.repository.ShelterAccountsRepository;
import com.Sheltersapp.Sheltersapp.service.JwtService;
import com.Sheltersapp.Sheltersapp.service.NewsService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Controller
@RequestMapping("/news")
public class NewsController {
    private static final Logger logger = LoggerFactory.getLogger(CampaignsController.class);
    private final JwtService jwtService;
    private final ShelterAccountsRepository shelterAccountsRepository;
    private final NewsService newsService;
    private final NewsRepository newsRepository;

    public NewsController(JwtService jwtService, ShelterAccountsRepository shelterAccountsRepository, NewsService newsService, NewsRepository newsRepository) {
        this.jwtService = jwtService;
        this.shelterAccountsRepository = shelterAccountsRepository;
        this.newsService = newsService;
        this.newsRepository = newsRepository;
    }

    @PostMapping("/admin/add")
    public ResponseEntity<?> createNewsWithPhoto(
            @RequestParam("title") String title,
            @RequestParam("description") String description,
            @RequestParam(value = "file", required = false) MultipartFile file,
            @RequestHeader("Authorization") String authHeader) {
        try {
            String jwtToken = authHeader.substring(7);
            String username = jwtService.extractUsername(jwtToken);
            Optional<Shelter_accounts> shelterAccountsOptional = shelterAccountsRepository.findByUsername(username);

            if (shelterAccountsOptional.isEmpty()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Nieautoryzowany użytkownik");
            }

            Shelter_accounts shelterAccounts = shelterAccountsOptional.get();
            Shelter userShelter = shelterAccounts.getShelter_id();

            News news = new News();
            news.setTitle(title);
            news.setDescription(description);
            news.setShelter(userShelter);
            news.setDate(LocalDateTime.now());

            if (file != null && !file.isEmpty()) {
                news.setPhoto(file.getBytes());
            }

            News savedNews = newsService.createNews(news);
            return ResponseEntity.ok(savedNews);
        } catch (Exception e) {
            logger.error("Błąd podczas dodawania ogłoszenia", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Błąd serwera");
        }
    }

    @GetMapping("/")
    @Transactional(readOnly = true)
    public ResponseEntity<List<News>> getAllCampaigns() {
        List<News> campaigns = newsService.allNews();
        return ResponseEntity.ok(campaigns);
    }

    @GetMapping("/{id}")
    public ResponseEntity<News> getCampaignById(@PathVariable Long id) {
        Optional<News> news = newsService.getNewsById(id);
        return news.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/shelter/{shelter_id}")
    public ResponseEntity<List<News>> getCampaignsByShelterId(@PathVariable Long shelter_id) {
        try {
            List<News> news = newsService.findByShelterId(shelter_id);

            if (news.isEmpty()) {
                return ResponseEntity.noContent().build();
            }

            return ResponseEntity.ok(news);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @DeleteMapping("/admin/delete/{id}")
    public ResponseEntity<Void> deleteCampaign(@PathVariable Long id) {
        newsService.deleteNews(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/admin/edit/{id}")
    public ResponseEntity<News> editCampaigns(@PathVariable Long id, @RequestBody News updateNews) {
        Optional<News> optionalCampaigns = newsService.getNewsById(id);

        if (optionalCampaigns.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        News existingNews = optionalCampaigns.get();
        existingNews.setDescription(updateNews.getDescription());
        existingNews.setTitle(updateNews.getTitle());

        News savedNews = newsService.createNews(existingNews);

        return ResponseEntity.ok(savedNews);
    }
}
