import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'
import indianState from '../assets/indianStateandAreawithcode.json'
import Navbar from './Navbar';
import { useNavigate } from "react-router-dom";

const Registration = () => {
    const routerParams = useParams()
    const userId = routerParams['index']
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        dateOfBirth: '',
        gender: '',
        hobbies: [],
        age: null,
        state: '',
        city: '',
        area: '',
        salary: '',
    });

    const [errors, setErrors] = useState({
        firstNameError: '',
        lastNameError: '',
        dobError: '',
        genderError: '',
        hobbiesError: '',
        ageError: '',
        statError: '',
        cityError: '',
        areaError: '',
        dublicateErrormsg: '',
        salaryErrorMsg : ''
    });

    const [tableData, setTableData] = useState([]);
    const [states, setStates] = useState([]);
    const [cities, setCities] = useState([]);
    const [area, setAreas] = useState([])
    const [isEditing, setIsEditing] = useState(false);
    const [editIndex, setEditIndex] = useState(-1);
    const [dublicateErrorMsg, setDublicateErrorMsg] = useState('')
    useEffect(() => {
        let indianStates = indianState.filter(x => x.parentId === null)
        let stateNames = []
        if (indianState)
            indianStates.forEach(element => {
                stateNames.push(element.name)
            });
        setStates(stateNames)
        const url = window.location.href;

        let userdata = localStorage.getItem("userData")
        if (userdata) setTableData(JSON.parse(userdata))
        userdata = JSON.parse(userdata)
        if (url.split('/').includes('edit')) {
            setFormData(userdata[userId])
            setIsEditing(true)
            setEditIndex(userId)
            handleCityDropDown(userdata[userId].state)

            handleAreaDropDown(userdata[userId].city)
        }
        else setFormData(formData)
    }, []);


    const validateForm = () => {
        let valid = true;
        const newErrors = { ...errors };

        // Firstname Errors
        if (formData.firstName.trim() === '') {
            newErrors.firstNameError = 'First Name cannot be blank';
            valid = false;
        } else if (formData.firstName.length < 3) {
            newErrors.firstNameError = 'Firstname should at least 3 Characters long'
            valid = false
        } else if (formData.firstName.length > 20) {
            newErrors.firstNameError = 'Firstname cannot be more than 20 Characters long'
            valid = false
        }
        else {
            newErrors.firstNameError = '';
        }

        // LastName Errors
        if (formData.lastName.trim() === '') {
            newErrors.lastNameError = 'Last Name cannot be blank';
            valid = false;
        } else if (formData.lastName.length < 3) {
            newErrors.lastNameError = 'Lastname should at least 3 Characters long'
            valid = false
        } else if (formData.lastName.length > 20) {
            newErrors.lastNameError = 'Lastname cannot be more than 20 Characters long'
            valid = false
        }
        else {
            newErrors.lastNameError = '';
        }

        // Date of birth
        if (formData.dateOfBirth === '') {
            newErrors.dobError = 'Please Select Date of Birth';
            valid = false;
        }
        else if (formData.dateOfBirth || formData.age) {
            let age = countAge(formData.dateOfBirth)
            if (age < 18 || age > 120) {
                if (age < 0) {
                    newErrors.dobError = 'Enter Valid birthdate'
                    formData.age = 0
                    valid = false
                } else {
                    newErrors.dobError = 'Enter Valid birthdate'
                    newErrors.ageError = 'Age should be between 18 to 120'
                    valid = false
                }
            } else {
                newErrors.dobError = ''
                newErrors.ageError = ''
            }
        }
        else {
            newErrors.dobError = '';
        }

        // gender
        if (formData.gender === '') {
            newErrors.genderError = 'Please Select Gender';
            valid = false;
        } else {
            newErrors.genderError = '';
        }

        // hobies
        if (formData.hobbies.length === 0) {
            newErrors.hobbiesError = 'At least one hobby is required';
            valid = false;
        } else {
            newErrors.hobbiesError = '';
        }


        // State Validation
        if (formData.state.length === 0) {
            newErrors.statError = 'State is required';
            valid = false
        } else {
            newErrors.statError = ''
        }

        // city validation
        if (formData.city.length === 0) {
            newErrors.cityError = 'City is required'
            valid = false
        } else {
            newErrors.cityError = ''
        }

        // Area Validation
        if (formData.area.length === 0) {
            newErrors.areaError = 'Area Is required'
            valid = false
        } else {
            newErrors.areaError = ''
        }

        setErrors(newErrors);
        return valid;
    };

    const setlocalStoreageData = (updatedTableData) => {
        updatedTableData = updatedTableData.sort((a, b) => a.firstName.localeCompare(b.firstName))
        localStorage.setItem("userData", JSON.stringify(updatedTableData));
    }

    const handleFormSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            if (isEditing) {
                const updatedTableData = [...tableData];
                updatedTableData[editIndex] = { ...formData };
                setTableData(updatedTableData);
                // Reset form and state after update
                setlocalStoreageData(updatedTableData)
                setIsEditing(false);
                setEditIndex(-1);
                clearFormData()
                navigate('/userdata')
            }
            else {
                const isDuplicate = checkDublicate()
                if (!isDuplicate) {
                    setDublicateErrorMsg('')
                    const newRowData = { ...formData };
                    setTableData([...tableData, newRowData]);
                    setlocalStoreageData([...tableData, newRowData])
                    clearFormData()
                } else {
                    setDublicateErrorMsg('Dublicate data entries are not allowed')
                }

            }

        }
    };

    const checkDublicate = () => {
        let isDublicate = tableData.some((data) => {
            return (
                data.firstName === formData.firstName &&
                data.lastName === formData.lastName &&
                data.dateOfBirth === formData.dateOfBirth &&
                data.gender === formData.gender &&
                data.state === formData.state &&
                data.city === formData.city
            );
        });
        if (isDublicate) {
            setDublicateErrorMsg('Dublicate data is not allowed')
            return true
        }
        else {
            setDublicateErrorMsg('')
            return false
        }
    }

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

    const handleCityDropDown = (selectedState) => {
        let stateId = getStatID(selectedState)
        let selectedStateCities = indianState.filter(x => x.parentId === stateId)
        let cityDropdownvalues = []

        selectedStateCities.forEach(x => {
            cityDropdownvalues.push(x.name)
        })
        setCities(cityDropdownvalues);
    }

    const handleStateChange = (e) => {
        const selectedState = e.target.value;
        setFormData({
            ...formData,
            state: selectedState,
            city: '', // Reset the city value when the state changes
        });
        setErrors({ ...errors, statError: '' });

        // Update the city dropdown based on the selected state
        if (selectedState) {
            handleCityDropDown(selectedState)
        } else {
            setCities([]);
        }
    }

    const handleCityChange = (e) => {
        const selectedCity = e.target.value;


        // Update the form data and clear the city error message
        setFormData({ ...formData, city: selectedCity });
        setErrors({ ...errors, cityError: '' });

        if (selectedCity) {
            handleAreaDropDown(selectedCity)
        }
        else {
            setAreas([])
        }
    };

    const handleAreaChange = (e) => {
        const selectedArea = e.target.value
        setFormData({ ...formData, area: selectedArea });
        setErrors({ ...errors, areaError: '' });
    }
    const clearFormData = () => {
        setFormData({
            firstName: '',
            lastName: '',
            dateOfBirth: '',
            gender: '',
            hobbies: [],
            age: null,
            state: '',
            city: '',
            area: ''
        });
    }

    const handleAreaDropDown = (selectedCity) => {
        let getCityId = getSelectedCityId(selectedCity)
        let areaValues = indianState.filter(x => x.parentId === getCityId)
        let setAreavalues = DropdownValues(areaValues)
        console.log(setAreavalues);
        setAreas(setAreavalues)
    }

    const countAge = (dateOfBirth) => {
        let today = new Date()
        let getCurrYear = today.getFullYear()
        let getBirthYear = dateOfBirth.split('-')[0]
        let age = getCurrYear - getBirthYear
        formData.age = age
        return age
    }

    const getStatID = (selectedState) => {
        let selectedStateData = indianState.find(x => x.name === selectedState)
        return selectedStateData.ID
    }

    const getSelectedCityId = (selecteCity) => {
        let cityId = indianState.find(x => x.name === selecteCity)
        return cityId.ID
    }

    const DropdownValues = (data) => {
        let cityState = []
        data.forEach(element => {
            cityState.push(element.name)
        });
        return cityState
    }

    return (
        <div className='container'>
            <Navbar />
            <div className="container mt-4">
                <h1 className='mb-3 text-center'>Voting Registration Form</h1>
                <form>
                    {/* firstname Lastname row */}
                    <div className='row'>
                        <div className='col-md-6'>
                            <div className="mb-3">
                                <label htmlFor="firstName" className="form-label">First Name</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="firstName"
                                    name="firstName"
                                    value={formData?.firstName}
                                    onChange={handleInputChange}
                                    onBlur={validateForm}
                                />
                                <span className="text-danger">{errors.firstNameError}</span>
                            </div>
                        </div>
                        <div className='col-md-6'>
                            <div className="mb-3">
                                <label htmlFor="lastName" className="form-label">Last Name</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="lastName"
                                    name="lastName"
                                    value={formData?.lastName}
                                    onChange={handleInputChange}
                                    onBlur={validateForm}
                                />
                                <span className="text-danger">{errors.lastNameError}</span>
                            </div>
                        </div>
                    </div>

                    {/* DateOf birth and age row */}
                    <div className='row'>
                        <div className='col-6'>
                            <div className="mb-3">
                                <label htmlFor="dateOfBirth" className="form-label">Date of Birth</label>
                                <input
                                    type="date"
                                    className="form-control"
                                    id="dateOfBirth"
                                    name="dateOfBirth"
                                    value={formData?.dateOfBirth}
                                    onChange={handleInputChange}
                                    onBlur={validateForm}
                                />
                                <span className="text-danger">{errors.dobError}</span>
                            </div>
                        </div>
                        <div className='col-6'>
                            <label htmlFor="age" className="form-label">Age</label>
                            <input
                                type="number"
                                className="form-control"
                                id="age"
                                name="age"
                                value={formData?.age === null ? '' : formData?.age}
                                onChange={handleInputChange}
                                onBlur={validateForm}
                                disabled
                            />
                            <span className="text-danger">{errors.ageError}</span>
                        </div>
                    </div>

                    <div className="mb-3">
                        <div className='row'>
                            <div className='col-6'>
                                <label className="form-label">Gender</label>
                                <div className="form-check">
                                    <input
                                        type="radio"
                                        className="form-check-input"
                                        id="male"
                                        name="gender"
                                        value="Male"
                                        checked={formData?.gender === 'Male'}
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
                                        checked={formData?.gender === 'Female'}
                                        onChange={handleInputChange}
                                        onBlur={validateForm}
                                    />
                                    <label htmlFor="female" className="form-check-label">Female</label>
                                </div>
                                <span className="text-danger">{errors.genderError}</span>
                            </div>
                            <div className='col-6'>
                                <div className="mb-3">
                                    <label className="form-label">Hobbies</label>
                                    <div className="form-check">
                                        <input
                                            type="checkbox"
                                            className="form-check-input"
                                            id="Chess"
                                            name="hobbies"
                                            value="Chess"
                                            checked={formData?.hobbies.includes('Chess')}
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
                                            checked={formData?.hobbies.includes('Badminton')}
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
                                            checked={formData?.hobbies.includes('Hockey')}
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
                                            checked={formData?.hobbies.includes('Reading')}
                                            onChange={handleCheckboxChange}
                                            onBlur={validateForm}
                                        />
                                        <label htmlFor="Reading" className="form-check-label">Reading</label>
                                    </div>
                                    <span className="text-danger">{errors.hobbiesError}</span>
                                </div>
                            </div>
                        </div>

                    </div>


                    {/* Select Stats and city row*/}

                    <div className='row'>
                        <div className='col-md-4'>
                            <div className="mb-3">
                                <label htmlFor="stateDropdown" className="form-label">
                                    Select a State
                                </label>
                                <select
                                    id="stateDropdown"
                                    name="state"
                                    className="form-control"
                                    value={formData?.state}
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
                        </div>
                        <div className='col-md-4'>
                            <div className="mb-3">
                                <label htmlFor="cityDropdown" className="form-label">
                                    Select a City
                                </label>
                                <select
                                    id="cityDropdown"
                                    name="city"
                                    className="form-control"
                                    value={formData?.city}
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
                        </div>

                        {/* Area select  */}
                        <div className='col-md-4'>
                            <label htmlFor="areaDropdown" className="form-label">
                                Select Area
                            </label>

                            <select
                                id="areaDropdown"
                                name="area"
                                className="form-control"
                                value={formData?.area}
                                onChange={handleAreaChange}
                            >
                                <option value="">Select a Area</option>
                                {area.map((area) => (
                                    <option key={area} value={area}>
                                        {area}
                                    </option>
                                ))}
                            </select>
                            <span className="text-danger">{errors.areaError}</span>
                        </div>
                    </div>


                    <div className='row'>
                    <div className='col-6'>
                            <label htmlFor="age" className="form-label">Salary</label>
                            <input
                                type="number"
                                className="form-control"
                                id="salary"
                                name="salary"
                                value={formData?.salary === null ? '' : formData?.salary}
                                onChange={handleInputChange}
                                onBlur={validateForm}
                            />
                            <span className="text-danger">{errors.ageError}</span>
                        </div>
                    </div>

                    <div className="mb-3 mt-4">
                        <div className='text-danger'><strong>{dublicateErrorMsg}</strong></div>
                        <button type="button" className="btn btn-primary" id='submit' onClick={handleFormSubmit}>
                            {isEditing ? 'Update' : 'Submit'}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Registration;
