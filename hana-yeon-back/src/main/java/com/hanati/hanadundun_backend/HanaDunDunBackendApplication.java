package com.hanati.hanadundun_backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@EnableJpaAuditing
@SpringBootApplication
public class HanaDunDunBackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(HanaDunDunBackendApplication.class, args);
	}

}