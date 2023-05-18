import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap';
import axios from 'axios';
import './App.css';

const PatientList = () => {
    const [patients, setPatients] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [selectedPatient, setSelectedPatient] = useState(null);

    useEffect(() => {
        if (searchTerm !== '') {
            searchPatients();
        } else {
            getAllPatients();
        }
    }, [currentPage, searchTerm]);

    const previousPage = () => {
        if (currentPage > 0) {
            setCurrentPage(currentPage - 1);
        }
    };

    const nextPage = () => {
        if (currentPage < totalPages - 1) {
            setCurrentPage(currentPage + 1);
        }
    };



    const searchPatients = () => {
        const url = `http://localhost:8081/patients/search?searchTerm=${searchTerm}`;
        setLoading(true);
        axios
            .get(url)
            .then((response) => {
                setPatients(response.data.content);
                setCurrentPage(response.data.number);
                setTotalPages(response.data.totalPages);
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error retrieving patients:', error);
                setLoading(false);
            });
    };

    const getAllPatients = () => {
        const url = `http://localhost:8081/patients?page=${currentPage}&size=10`;
        setLoading(true);
        axios
            .get(url)
            .then((response) => {
                setPatients(response.data.content);
                setCurrentPage(response.data.number);
                setTotalPages(response.data.totalPages);
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error retrieving patients:', error);
                setLoading(false);
            });
    };

    const createPatient = (patientData, onSuccess, onError) => {
        axios
            .post('http://localhost:8081/patients', patientData)
            .then((response) => {
                onSuccess(response.data);
                setShowModal(false);
            })
            .catch((error) => {
                console.error('Error creating patient:', error);
                onError(error);
            });
    };

    const updatePatient = (id, patientData, onSuccess, onError) => {
        axios
            .put(`http://localhost:8081/patients/${id}`, patientData)
            .then((response) => {
                onSuccess(response.data);
                setShowModal(false);
            })
            .catch((error) => {
                console.error('Error updating patient:', error);
                onError(error);
            });
    };

    const deletePatient = (id) => {
        const url = `http://localhost:8081/patients/${id}`;
        axios
            .delete(url)
            .then((response) => {
                setPatients(patients.filter((patient) => patient.id !== id));
            })
            .catch((error) => {
                console.error('Error deleting patient:', error);
            });
    };

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        if (searchTerm !== '') {
            searchPatients();
        } else {
            getAllPatients();
        }
    };

    const handleCreatePatient = (patientData) => {
        createPatient(
            patientData,
            (newPatient) => {
                setPatients([newPatient, ...patients]);
            },
            () => {
                console.log("error");
            }
        );
    };

    const handleUpdatePatient = (id, updatedPatientData) => {
        updatePatient(
            id,
            updatedPatientData,
            (updatedPatient) => {
                setPatients(
                    patients.map((patient) =>
                        patient.id === updatedPatient.id ? updatedPatient : patient
                    )
                );
            },
            () => {
                console.log('error');
            }
        );
    };

    const openModal = (patient) => {
        setSelectedPatient(patient);
        setShowModal(true);
    };

    const closeModal = () => {
        setSelectedPatient(null);
        setShowModal(false);
    };

    return (
        <Container>
            <h2 className="my-4">Patient List</h2>
            <Form className="mb-4" onSubmit={handleSubmit}>
                <Row>
                    <Col>
                        <Form.Control
                            type="text"
                            value={searchTerm}
                            onChange={handleSearch}
                            placeholder="Search by PID or patient name"
                        />
                    </Col>
                    <Col>
                        <Button type="submit" variant="primary">
                            Search
                        </Button>
                        <Button variant="primary" className="ml-2" onClick={() => openModal()}>
                            Create
                        </Button>
                    </Col>
                </Row>
            </Form>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <Row>
                    {patients.map((patient) => (
                        <Col md={6} lg={4} key={patient.id}>
                            <Card className="mb-4">
                                <Card.Body>
                                    <Card.Title>
                                        {patient.firstName} {patient.lastName}
                                    </Card.Title>
                                    <Card.Text>PID: {patient.pid}</Card.Text>
                                    <Card.Text>Gender: {patient.gender}</Card.Text>
                                    <Card.Text>Date of Birth: {patient.dateOfBirth}</Card.Text>
                                    <Card.Text>Phone No: {patient.phoneNo}</Card.Text>
                                    <Card.Text>
                                        {patient.australianAddresses && patient.australianAddresses.length > 0 ? (
                                            <>
                                                <p>Address: {patient.australianAddresses[0].address}</p>
                                                <p>Suburb: {patient.australianAddresses[0].suburb}</p>
                                                <p>State: {patient.australianAddresses[0].state}</p>
                                                <p>Postcode: {patient.australianAddresses[0].postcode}</p>
                                            </>
                                        ) : (
                                            <div>No address available</div>
                                        )}
                                    </Card.Text>
                                    <Button variant="danger" onClick={() => deletePatient(patient.id)}>
                                        Delete
                                    </Button>
                                    <Button variant="primary" className="ml-2" onClick={() => openModal(patient)}>
                                        Edit
                                    </Button>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            )}
            <div className="pagination-container mt-4">
                <Button variant="secondary" onClick={previousPage} disabled={currentPage === 0}>
                    Previous Page
                </Button>
                <Button
                    variant="secondary"
                    className="ml-2"
                    onClick={nextPage}
                    disabled={currentPage === totalPages - 1}
                >
                    Next Page
                </Button>
            </div>

            {showModal && (
                <PatientModal
                    patient={selectedPatient}
                    onCreate={handleCreatePatient}
                    onUpdate={handleUpdatePatient}
                    onClose={closeModal}
                    showModal={showModal}
                />
            )}
        </Container>
    );
};

const PatientModal = ({ patient, onCreate, onUpdate, onClose, showModal }) => {
    const [formData, setFormData] = useState({
        pid: '',
        firstName: '',
        lastName: '',
        gender: '',
        phoneNo: '',
        dateOfBirth: '',
        australianAddress: {
            address: '',
            suburb: '',
            state: '',
            postcode: ''
        },
    });

    useEffect(() => {
        if (patient) {
            setFormData({
                pid: patient.pid || '',
                firstName: patient.firstName || '',
                lastName: patient.lastName || '',
                gender: patient.gender || '',
                dateOfBirth: patient.dateOfBirth || '',
                phoneNo: patient.phoneNo || '',
                australianAddress: {
                    address: patient.australianAddress?.address || '',
                    suburb: patient.australianAddress?.suburb || '',
                    state: patient.australianAddress?.state || '',
                    postcode: patient.australianAddress?.postcode || ''
                }
            });
        } else {
            setFormData({
                pid: '',
                firstName: '',
                lastName: '',
                gender: '',
                phoneNo: '',
                dateOfBirth: '',
                australianAddress: {
                    address: '',
                    suburb: '',
                    state: '',
                    postcode: ''
                },
            });
        }
    }, [patient]);

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        if (patient) {
            onUpdate(patient.id, formData);
        } else {
            onCreate(formData);
        }
    };

        return (
            <div className={`modal ${showModal ? 'modal-show' : ''}`}>
                <div className="modal-content">
                    <h3>{patient ? 'Edit Patient' : 'Add Patient'}</h3>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>PID:</label>
                            <input
                                className="form-control"
                                type="text"
                                name="pid"
                                value={formData.pid}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="form-group">
                            <label>First Name:</label>
                            <input
                                className="form-control"
                                type="text"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="form-group">
                            <label>Last Name:</label>
                            <input
                                className="form-control"
                                type="text"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="form-group">
                            <label>Gender:</label>
                            <input
                                className="form-control"
                                type="text"
                                name="gender"
                                value={formData.gender}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="form-group">
                            <label>Date of Birth:</label>
                            <input
                                className="form-control"
                                type="date"
                                name="dateOfBirth"
                                value={formData.dateOfBirth}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="form-group">
                            <label>Phone No:</label>
                            <input
                                className="form-control"
                                type="text"
                                name="phoneNo"
                                value={formData.phoneNo}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="form-group">
                            <label>Address:</label>
                            <input
                                className="form-control"
                                type="text"
                                name="address"
                                value={formData.australianAddress?.address || ''}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="form-group">
                            <label>Suburb:</label>
                            <input
                                className="form-control"
                                type="text"
                                name="suburb"
                                value={formData.australianAddress.suburb}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="form-group">
                            <label>State:</label>
                            <input
                                className="form-control"
                                type="text"
                                name="state"
                                value={formData.australianAddress.state}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="form-group">
                            <label>Postcode:</label>
                            <input
                                className="form-control"
                                type="text"
                                name="postcode"
                                value={formData.australianAddress.postcode}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="modal-buttons">
                            <button className="btn btn-primary" type="submit">
                                {patient ? 'Update' : 'Create'}
                            </button>
                            <button className="btn btn-default" type="button" onClick={onClose}>
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        );
    };

export default PatientList;

