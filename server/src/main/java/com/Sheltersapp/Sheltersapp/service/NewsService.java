package com.Sheltersapp.Sheltersapp.service;

import com.Sheltersapp.Sheltersapp.model.News;
import com.Sheltersapp.Sheltersapp.repository.NewsRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class NewsService {
    private final NewsRepository newsRepository;

    public NewsService(NewsRepository newsRepository) {
        this.newsRepository = newsRepository;
    }

    public List<News> allNews(){
        return newsRepository.findAll();
    }
    @Transactional
    public News createNews(News news){
        return newsRepository.save(news);
    }

    public Optional<News> getNewsById(Long id){
        return newsRepository.findById(id);
    }

    public void deleteNews(Long id){
        newsRepository.deleteById(id);
    }

    public List<News> findByShelterId(Long shelterId) {
        return newsRepository.findByShelterId(shelterId);
    }
}
