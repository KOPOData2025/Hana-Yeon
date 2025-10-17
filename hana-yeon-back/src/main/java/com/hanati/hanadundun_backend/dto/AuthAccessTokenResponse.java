package com.hanati.hanadundun_backend.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AuthAccessTokenResponse {
    
    @JsonProperty("authAccessToken")
    private String authAccessToken;
    
    @JsonProperty("tokenType")
    private String tokenType;
    
    @JsonProperty("expiresIn")
    private Long expiresIn;
    
    @JsonProperty("scope")
    private String scope;
    
    @JsonProperty("clientUseCode")
    private String clientUseCode;
}