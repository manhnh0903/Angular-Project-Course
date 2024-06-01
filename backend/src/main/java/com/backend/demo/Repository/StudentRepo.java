package com.backend.demo.Repository;

import com.backend.demo.Entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StudentRepo extends JpaRepository<Student, String>{


}
