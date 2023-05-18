package com.patient.Patient.controller;

import com.patient.Patient.model.Patient;
import com.patient.Patient.model.dto.PatientDTO;
import com.patient.Patient.service.PatientService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/patients")
@RequiredArgsConstructor
@CrossOrigin
public class PatientController {
    private final PatientService patientService;

    @GetMapping
    public ResponseEntity<Page<Patient>>  getAllPatients(Pageable pageable) {
        Page<Patient> patients = patientService.getAllPatients(pageable);
        return new ResponseEntity<>(patients, HttpStatus.OK);

    }

    @GetMapping("/{id}")
    public Optional<Patient> getPatientById(@PathVariable Long id) {
        return patientService.getPatientById(id);
    }

    @PostMapping
    public Patient createPatient(@RequestBody Patient patient) {
        return patientService.createPatient(patient);
    }

    @GetMapping("/search")
    public ResponseEntity<Page<Patient>> searchPatients(@RequestParam String searchTerm, Pageable pageable) {
        Page<Patient> patients = patientService.searchPatients(searchTerm, pageable);
        return new ResponseEntity<>(patients, HttpStatus.OK);
    }

    @PutMapping("/{id}")
    public Patient updatePatient(@PathVariable Long id, @RequestBody Patient patient) {
        return patientService.updatePatient(id, patient);
    }

    @DeleteMapping("/{id}")
    public boolean deletePatient(@PathVariable Long id) {
        return patientService.deletePatient(id);
    }
}

