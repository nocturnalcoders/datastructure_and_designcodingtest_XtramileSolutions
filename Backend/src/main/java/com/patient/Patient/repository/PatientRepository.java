package com.patient.Patient.repository;

import com.patient.Patient.model.Patient;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

public interface PatientRepository extends JpaRepository<Patient, Long> {
        Page<Patient> findByPidContainingIgnoreCaseOrFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCase(String pid, String firstName, String lastName, Pageable pageable);

}
