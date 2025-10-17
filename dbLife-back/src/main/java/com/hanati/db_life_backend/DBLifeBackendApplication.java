package com.hanati.db_life_backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class DBLifeBackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(DBLifeBackendApplication.class, args);
	}

}