package com.Sheltersapp.Sheltersapp.service;

import com.Sheltersapp.Sheltersapp.model.Users;
import com.Sheltersapp.Sheltersapp.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class UserService {
    private final UserRepository userRepository;
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Transactional
    public Users createUser(Users user){
        return userRepository.save(user);
    }

    public List<Users> allUsers() {
        List<Users> users = new ArrayList<>();
        userRepository.findAll().forEach(users::add);
        return users;
    }
    public Optional<Users> getUserById(Long id){
        return userRepository.findById(id);
    }

    public void deleteUser(Long id){
        userRepository.deleteById(id);
    }


}
