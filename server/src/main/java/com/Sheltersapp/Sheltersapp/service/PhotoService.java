package com.Sheltersapp.Sheltersapp.service;

import com.Sheltersapp.Sheltersapp.repository.PhotoRepository;
import org.springframework.stereotype.Service;

@Service
public class PhotoService {
    private final PhotoRepository photoRepository;

    public PhotoService(PhotoRepository photoRepository) {
        this.photoRepository = photoRepository;
    }

    public void deletePhoto(Long id){
        photoRepository.deleteById(id);
    }

}
