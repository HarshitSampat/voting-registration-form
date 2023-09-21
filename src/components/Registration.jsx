import React, { useEffect, useState } from 'react';
import Table from './Table';
import statData from '../assets/indinStateDetails.json'

const Registration = () => {

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        dateOfBirth: '',
        gender: '',
        hobbies: [],
        state:'',
        city:''
    });

    const [errors, setErrors] = useState({
        firstNameError: '',
        lastNameError: '',
        dobError: '',
        genderError: '',
        hobbiesError: '',
        statError:'',
        cityError:''
    });

    const [tableData, setTableData] = useState([]);
    const [selectedState, setSelectedState] = useState('');
    const [selectedCity, setSelectedCity] = useState('');
    const [states, setStates] = useState([]);
    const [cities, setCities] = useState([]);   

    useEffect(() => {
        // Fetch the list of states from the API and setStates
        const statesFromData = Object.keys(statData);
        setStates(statesFromData);
    }, []);


    const validateForm = () => {
        let valid = true;
        const newErrors = { ...errors };

        if (formData.firstName.trim() === '') {
            newErrors.firstNameError = 'First Name cannot be blank';
            valid = false;
        } else {
            newErrors.firstNameError = '';
        }

        if (formData.lastName.trim() === '') {
            newErrors.lastNameError = 'Last Name cannot be blank';
            valid = false;
        } else {
            newErrors.lastNameError = '';
        }

        if (formData.dateOfBirth === '') {
            newErrors.dobError = 'Please Select Date of Birth';
            valid = false;
        } else {
            newErrors.dobError = '';
        }

        if (formData.gender === '') {
            newErrors.genderError = 'Please Select Gender';
            valid = false;
        } else {
            newErrors.genderError = '';
        }

        if (formData.hobbies.length === 0) {
            newErrors.hobbiesError = 'At least one hobby is required';
            valid = false;
        } else {
            newErrors.hobbiesError = '';
        }

        if(formData.state.length === 0 ){
            newErrors.statError = 'State is required';
            valid = false
        }else{
            newErrors.statError = ''
        }

        if(formData.city.length === 0 ){
            newErrors.cityError = 'City is required'
        }else{
            newErrors.cityError = ''
        }
        setErrors(newErrors);
        return valid;
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            const newRowData = { ...formData };
            setTableData([...tableData, newRowData]);
            setFormData({
                firstName: '',
                lastName: '',
                dateOfBirth: '',
                gender: '',
                hobbies: [],
                state : '',
                city : ''
            });
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleCheckboxChange = (e) => {
        const { value, checked } = e.target;
        const updatedHobbies = checked
            ? [...formData.hobbies, value]
            : formData.hobbies.filter((hobby) => hobby !== value);
        setFormData({ ...formData, hobbies: updatedHobbies });
    };

    const handleStateChange = (e) =>{
        const selectedState = e.target.value;
    setFormData({
        ...formData,
        state: selectedState,
        city: '', // Reset the city value when the state changes
    });
    setErrors({ ...errors, statError: '' });

    // Update the city dropdown based on the selected state
    if (selectedState) {
        const citiesForSelectedState = statData[selectedState];
        setCities(citiesForSelectedState);
    } else {
        setCities([]);
    }
    }

    const handleCityChange = (e) => {
        const selectedCity = e.target.value;
    
        // Update the form data and clear the city error message
        setFormData({ ...formData, city: selectedCity });
        setErrors({ ...errors, cityError: '' });
    };

    return (
        <div className="container mt-5">
            <h1>Voting Registration Form</h1>
            <form onSubmit={handleFormSubmit}>
                <div className="mb-3">
                    <label htmlFor="firstName" className="form-label">First Name</label>
                    <input
                        type="text"
                        className="form-control"
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        onBlur={validateForm}
                    />
                    <span className="text-danger">{errors.firstNameError}</span>
                </div>
                <div className="mb-3">
                    <label htmlFor="lastName" className="form-label">Last Name</label>
                    <input
                        type="text"
                        className="form-control"
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        onBlur={validateForm}
                    />
                    <span className="text-danger">{errors.lastNameError}</span>
                </div>
                <div className="mb-3">
                    <label htmlFor="dateOfBirth" className="form-label">Date of Birth</label>
                    <input
                        type="date"
                        className="form-control"
                        id="dateOfBirth"
                        name="dateOfBirth"
                        value={formData.dateOfBirth}
                        onChange={handleInputChange}
                        onBlur={validateForm}
                    />
                    <span className="text-danger">{errors.dobError}</span>
                </div>
                <div className="mb-3">
                    <label className="form-label">Gender</label>
                    <div className="form-check">
                        <input
                            type="radio"
                            className="form-check-input"
                            id="male"
                            name="gender"
                            value="Male"
                            checked={formData.gender === 'Male'}
                            onChange={handleInputChange}
                            onBlur={validateForm}
                        />
                        <label htmlFor="male" className="form-check-label">Male</label>
                    </div>
                    <div className="form-check">
                        <input
                            type="radio"
                            className="form-check-input"
                            id="female"
                            name="gender"
                            value="Female"
                            checked={formData.gender === 'Female'}
                            onChange={handleInputChange}
                            onBlur={validateForm}
                        />
                        <label htmlFor="female" className="form-check-label">Female</label>
                    </div>
                    <span className="text-danger">{errors.genderError}</span>
                </div>
                <div className="mb-3">
                    <label className="form-label">Hobbies</label>
                    <div className="form-check">
                        <input
                            type="checkbox"
                            className="form-check-input"
                            id="Chess"
                            name="hobbies"
                            value="Chess"
                            checked={formData.hobbies.includes('Chess')}
                            onChange={handleCheckboxChange}
                            onBlur={validateForm}
                        />
                        <label htmlFor="Chess" className="form-check-label">Chess</label>
                    </div>
                    <div className="form-check">
                        <input
                            type="checkbox"
                            className="form-check-input"
                            id="Badminton"
                            name="hobbies"
                            value="Badminton"
                            checked={formData.hobbies.includes('Badminton')}
                            onChange={handleCheckboxChange}
                            onBlur={validateForm}
                        />
                        <label htmlFor="Badminton" className="form-check-label">Badminton</label>
                    </div>
                    <div className="form-check">
                        <input
                            type="checkbox"
                            className="form-check-input"
                            id="Hockey"
                            name="hobbies"
                            value="Hockey"
                            checked={formData.hobbies.includes('Hockey')}
                            onChange={handleCheckboxChange}
                            onBlur={validateForm}
                        />
                        <label htmlFor="Hockey" className="form-check-label">Hockey</label>
                    </div>
                    <div className="form-check">
                        <input
                            type="checkbox"
                            className="form-check-input"
                            id="Reading"
                            name="hobbies"
                            value="Reading"
                            checked={formData.hobbies.includes('Reading')}
                            onChange={handleCheckboxChange}
                            onBlur={validateForm}
                        />
                        <label htmlFor="Reading" className="form-check-label">Reading</label>
                    </div>
                    <span className="text-danger">{errors.hobbiesError}</span>
                </div>

                    {/* Select Stats */}
                    <div className="mb-3">
                    <label htmlFor="stateDropdown" className="form-label">
                        Select a State
                    </label>
                    <select
                        id="stateDropdown"
                        className="form-control"
                        value={formData.state}
                        onChange={handleStateChange}
                    >
                        <option value="">Select a State</option>
                        {states.map((state) => (
                            <option key={state} value={state}>
                                {state}
                            </option>
                        ))}
                    </select>
                    <span className="text-danger">{errors.statError}</span>
                </div>
                

                {/* Select City */}
                <div className="mb-3">
                    <label htmlFor="cityDropdown" className="form-label">
                        Select a City
                    </label>
                    <select
                        id="cityDropdown"
                        className="form-control"
                        value={formData.city}
                        onChange={handleCityChange}
                    >
                        <option value="">Select a City</option>
                        {cities.map((city) => (
                            <option key={city} value={city}>
                                {city}
                            </option>
                        ))}
                    </select>
                    <span className="text-danger">{errors.cityError}</span>
                </div>


                <div className="mb-3">
                    <button type="submit" className="btn btn-primary" id='submit'>Submit</button>
                </div>


            

            </form>

            <div>
                <h2>Submitted Data</h2>
                <Table tableData={tableData}></Table>
            </div>
        </div>
    );
};

export default Registration;
