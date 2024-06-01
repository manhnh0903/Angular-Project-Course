package com.backend.demo.Entity;

import com.backend.demo.Enums.PaymentStatus;
import com.backend.demo.Enums.PaymentType;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;


@Entity
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
@ToString
public class Payment {


	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	private LocalDate date ;

	private double amount ;

	private PaymentType type ;

	private PaymentStatus status = PaymentStatus.CREATED;

	private String File;

	@ManyToOne
	private Student student;


}
