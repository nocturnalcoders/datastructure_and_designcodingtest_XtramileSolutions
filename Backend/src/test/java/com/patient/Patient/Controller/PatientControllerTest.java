package com.patient.Patient.Controller;

import com.patient.Patient.controller.PatientController;
import com.patient.Patient.model.Patient;
import com.patient.Patient.service.PatientService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;
import static org.mockito.Mockito.times;

@WebMvcTest(PatientController.class)
public class PatientControllerTest {

    @MockBean
    private PatientService patientService;

    @Autowired
    private PatientController patientController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void getPatientById_ReturnsPatientIfExists() {
        // Mock data
        Long patientId = 1L;
        Optional<Patient> patient = Optional.of(mock(Patient.class));
        when(patientService.getPatientById(patientId)).thenReturn(patient);

        // Invoke the controller method
        Optional<Patient> result = patientController.getPatientById(patientId);

        // Verify the result
        assertEquals(patient, result);
        verify(patientService, times(1)).getPatientById(patientId);
    }



    @Test
    void searchPatients_ReturnsListOfPatients() {
        // Mock data
        String searchTerm = "John";
        Pageable pageable = Pageable.unpaged();
        Page<Patient> patients = mock(Page.class);
        when(patientService.searchPatients(searchTerm, pageable)).thenReturn(patients);

        // Invoke the controller method
        ResponseEntity<Page<Patient>> response = patientController.searchPatients(searchTerm, pageable);

        // Verify the result
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(patients, response.getBody());
        verify(patientService, times(1)).searchPatients(searchTerm, pageable);
    }

    @Test
    void updatePatient_ReturnsUpdatedPatient() {
        // Mock data
        Long patientId = 1L;
        Patient patient = mock(Patient.class);
        when(patientService.updatePatient(patientId, patient)).thenReturn(patient);

        // Invoke the controller method
        Patient result = patientController.updatePatient(patientId, patient);

        // Verify the result
        assertEquals(patient, result);
        verify(patientService, times(1)).updatePatient(patientId, patient);
    }

    @Test
    void deletePatient_ReturnsTrueIfDeleted() {
        // Mock data
        Long patientId = 1L;
        when(patientService.deletePatient(patientId)).thenReturn(true);

        // Invoke the controller method
        boolean result = patientController.deletePatient(patientId);

        // Verify the result
        assertTrue(result);
        verify(patientService, times(1)).deletePatient(patientId);
    }

    @Test
    void createPatient_ReturnsCreatedPatient() {
        // Mock data
        Patient patient = mock(Patient.class);
        when(patientService.createPatient(patient)).thenReturn(patient);

        // Invoke the controller method
        Patient result = patientController.createPatient(patient);

        // Verify the result
        assertEquals(patient, result);
        verify(patientService, times(1)).createPatient(patient);
    }

    @Test
    void getAllPatients_ReturnsListOfPatients() {
        // Mock data
        Pageable pageable = Pageable.unpaged();
        Page<Patient> patients = mock(Page.class);
        when(patientService.getAllPatients(pageable)).thenReturn(patients);

        // Invoke the controller method
        ResponseEntity<Page<Patient>> response = patientController.getAllPatients(pageable);

        // Verify the result
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(patients, response.getBody());
        verify(patientService, times(1)).getAllPatients(pageable);
    }

    @Test
    void getPatientById_ReturnsExistingPatient() {
        // Mock data
        Long patientId = 1L;
        Patient patient = mock(Patient.class);
        when(patientService.getPatientById(patientId)).thenReturn(Optional.of(patient));

        // Invoke the controller method
        Optional<Patient> result = patientController.getPatientById(patientId);

        // Verify the result
        assertTrue(result.isPresent());
        assertEquals(patient, result.get());
        verify(patientService, times(1)).getPatientById(patientId);
    }

    @Test
    void getPatientById_ReturnsEmptyOptionalForNonExistingPatient() {
        // Mock data
        Long patientId = 1L;
        when(patientService.getPatientById(patientId)).thenReturn(Optional.empty());

        // Invoke the controller method
        Optional<Patient> result = patientController.getPatientById(patientId);

        // Verify the result
        assertFalse(result.isPresent());
        verify(patientService, times(1)).getPatientById(patientId);
    }
}
