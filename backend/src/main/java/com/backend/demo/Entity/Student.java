package com.backend.demo.Entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.*;

@Entity
@AllArgsConstructor
@Builder
@NoArgsConstructor
@Getter
@Setter
@ToString
public class Student {

	@Id
	public String id ;

	public String code ;

	public String firstName;

	public String lastName;

	public String email;

	public String photoe;
}
