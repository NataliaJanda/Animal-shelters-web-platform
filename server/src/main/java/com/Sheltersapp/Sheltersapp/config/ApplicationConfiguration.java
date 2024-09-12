package com.Sheltersapp.Sheltersapp.config;

import com.Sheltersapp.Sheltersapp.model.Shelter_accounts;
import com.Sheltersapp.Sheltersapp.model.Users;
import com.Sheltersapp.Sheltersapp.repository.ShelterAccountsRepository;
import com.Sheltersapp.Sheltersapp.repository.UserRepository;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@Configuration
public class ApplicationConfiguration {
    private final UserRepository userRepository;
    private final ShelterAccountsRepository shelterAccountsRepository;


    public ApplicationConfiguration(UserRepository userRepository, ShelterAccountsRepository shelterAccountsRepository) {
        this.userRepository = userRepository;
        this.shelterAccountsRepository = shelterAccountsRepository;
    }

    @Bean
    public UserDetailsService userDetailsService() {
        return username -> {
            UserDetails userDetails = userRepository.findByUsername(username)
                    .map(this::mapToUserDetails)
                    .orElseGet(() -> shelterAccountsRepository.findByUsername(username)
                            .map(this::mapToUserDetailsShelter)
                            .orElseThrow(() -> new UsernameNotFoundException("User not found")));

            return userDetails;
        };
    }

    private UserDetails mapToUserDetails(Users user) {
        return User.builder()
                .username(user.getUsername())
                .password(user.getPassword())
                .build();
    }

    private UserDetails mapToUserDetailsShelter(Shelter_accounts account) {
        return User.builder()
                .username(account.getUsername())
                .password(account.getPassword())
                .build();
    }

    @Bean
    BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService());
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }
}
