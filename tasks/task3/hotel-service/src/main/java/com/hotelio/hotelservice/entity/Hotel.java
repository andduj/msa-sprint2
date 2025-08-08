package com.hotelio.hotelservice.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "hotels")
public class Hotel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String name;
    private String city;
    private Integer stars;
    
    public Hotel() {}
    
    public Hotel(String name, String city, Integer stars) {
        this.name = name;
        this.city = city;
        this.stars = stars;
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getName() {
        return name;
    }
    
    public void setName(String name) {
        this.name = name;
    }
    
    public String getCity() {
        return city;
    }
    
    public void setCity(String city) {
        this.city = city;
    }
    
    public Integer getStars() {
        return stars;
    }
    
    public void setStars(Integer stars) {
        this.stars = stars;
    }
}
