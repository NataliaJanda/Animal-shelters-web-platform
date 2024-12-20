package com.Sheltersapp.Sheltersapp.model;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;

@Entity
@Getter
@Setter
public class Users implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String username;
    private String name;
    private String last_name;
    private String email;
    private String password;

    private boolean activated;
    private String verificationCode;
    private LocalDateTime expired;

    @Enumerated(EnumType.STRING)
    private Role role;

    public Users(String username, String email, String name, String last_name, String password) {
        this.username = username;
        this.name = name;
        this.last_name = last_name;
        this.email = email;
        this.password = password;
    }

    public Users() {
    }

    @Override
    public String getPassword() {
        return password != null ? password : "";
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of();
    }


    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return activated;
    }

}
