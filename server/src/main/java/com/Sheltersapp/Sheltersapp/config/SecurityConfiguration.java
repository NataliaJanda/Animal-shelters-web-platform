package com.Sheltersapp.Sheltersapp.config;

import com.Sheltersapp.Sheltersapp.model.Users;
import com.Sheltersapp.Sheltersapp.repository.UserRepository;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserService;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.util.Collections;
import java.util.Map;
import java.util.Optional;

@Configuration
@EnableWebSecurity
public class SecurityConfiguration implements WebMvcConfigurer{
    private final AuthenticationProvider authenticationProvider;
    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final UserRepository userRepository;

    public SecurityConfiguration(
            JwtAuthenticationFilter jwtAuthenticationFilter,
            AuthenticationProvider authenticationProvider, UserRepository userRepository
    ) {
        this.authenticationProvider = authenticationProvider;
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
        this.userRepository = userRepository;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(authorize -> authorize
                        .requestMatchers("/auth/**").permitAll()
                        .requestMatchers("/**").permitAll()
                        .anyRequest().authenticated()
                )
                .oauth2Login(oauth2 -> oauth2
                        .userInfoEndpoint(userInfo -> userInfo
                                .userService(customOAuth2UserService())
                        )
                        .successHandler((request, response, authentication) -> {
                            OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
                            String email = oAuth2User.getAttribute("email");

                            Optional<Users> existingUser = userRepository.findUsersByEmail(email);

                            if (existingUser.isPresent() && existingUser.get().isActivated()) {
                                response.sendRedirect("/auth/oauth2/success-login");
                            } else {
                                response.sendRedirect("/auth/oauth2/success");
                            }
                        })
                        .failureUrl("/auth/login?error=true")
                )
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.ALWAYS)
                )
                .authenticationProvider(authenticationProvider)
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }

    @Bean
    public OAuth2UserService<OAuth2UserRequest, OAuth2User> customOAuth2UserService() {
        DefaultOAuth2UserService delegate = new DefaultOAuth2UserService();

        return request -> {
            OAuth2User oAuth2User = delegate.loadUser(request);
            String registrationId = request.getClientRegistration().getRegistrationId();
            String userNameAttributeName;

            if ("google".equals(registrationId)) {
                userNameAttributeName = "sub";
            } else if ("facebook".equals(registrationId)) {
                userNameAttributeName = "id";
            } else {
                userNameAttributeName = request.getClientRegistration()
                        .getProviderDetails()
                        .getUserInfoEndpoint()
                        .getUserNameAttributeName();
            }

            if (userNameAttributeName == null || userNameAttributeName.isEmpty()) {
                userNameAttributeName = "email";
            }

            Map<String, Object> attributes = oAuth2User.getAttributes();

            return new DefaultOAuth2User(
                    Collections.singleton(new org.springframework.security.core.authority.SimpleGrantedAuthority("ROLE_USER")),
                    attributes,
                    userNameAttributeName
            );
        };
    }


    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins("http://localhost:3000")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH")
                .allowedHeaders("*")
                .allowCredentials(true);
    }
}
