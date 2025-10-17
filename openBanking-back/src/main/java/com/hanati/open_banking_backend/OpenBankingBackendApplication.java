package com.hanati.open_banking_backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@EnableJpaAuditing
@SpringBootApplication
public class OpenBankingBackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(OpenBankingBackendApplication.class, args);
	}

}