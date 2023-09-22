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
        age:null,
        state: '',
        city: ''
    });

    const [errors, setErrors] = useState({
        firstNameError: '',
        lastNameError: '',
        dobError: '',
        genderError: '',
        hobbiesError: '',
        ageError:'',
        statError: '',
        cityError: '',
        dublicateErrormsg:''
    });

    const [tableData, setTableData] = useState([]);
    const [states, setStates] = useState([]);
    const [cities, setCities] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [editIndex, setEditIndex] = useState(-1);
    const [dublicateErrorMsg,setDublicateErrorMsg] = useState('')
    useEffect(() => {
        // Fetch the list of states from the API and setStates
        const statesFromData = Object.keys(statData);
        statesFromData.sort()
        setStates(statesFromData);
        
        let userdata = localStorage.getItem("userData")
        if(userdata) setTableData(JSON.parse(userdata)) 
    }, []);


    const validateForm = () => {
        let valid = true;
        const newErrors = { ...errors };

        // Firstname Errors
        if (formData.firstName.trim() === '') {
            newErrors.firstNameError = 'First Name cannot be blank';
            valid = false;
        }else if(formData.firstName.length < 3 )
        {
            newErrors.firstNameError = 'Firstname should at least 3 Characters long'
            valid= false
        }else if(formData.firstName.length>20){
            newErrors.firstNameError = 'Firstname cannot be more than 20 Characters long'
        }
         else {
            newErrors.firstNameError = '';
        }

        // LastName Errors
        if (formData.lastName.trim() === '') {
            newErrors.lastNameError = 'Last Name cannot be blank';
            valid = false;
        }else if(formData.lastName.length < 3 )
        {
            newErrors.lastNameError = 'Lastname should at least 3 Characters long'
            valid= false
        }else if(formData.lastName.length>20){
            newErrors.lastNameError = 'Lastname cannot be more than 20 Characters long'
        }
         else {
            newErrors.lastNameError = '';
        }

        // Date of birth
        if (formData.dateOfBirth === '') {
            newErrors.dobError = 'Please Select Date of Birth';
            valid = false;
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

        // age validation
        if(formData.age === null){
            newErrors.ageError = 'Age is required'
            valid = false
        }
        else if(formData.age<=0){
            newErrors.ageError = 'Age should be a positive number'
            valid=false
        }else if(formData.age>0 && formData.age<18){
            newErrors.ageError = 'Age should be more then 18'
        }
        else{
            newErrors.ageError = ''
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
        } else {
            newErrors.cityError = ''
        }
        setErrors(newErrors);
        return valid;
    };

    const setlocalStoreageData = (updatedTableData) =>{
        localStorage.setItem("userData",JSON.stringify(updatedTableData));
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
            }
            else {
                const isDuplicate = checkDublicate()
                if (!isDuplicate) {
                    setDublicateErrorMsg('')
                    const newRowData = { ...formData };
                    setTableData([...tableData, newRowData]);
                    // const userData = tableData.push(newRowData)
                    setlocalStoreageData([...tableData, newRowData])
                   clearFormData()
                } else {
                    setDublicateErrorMsg('Dublicate data entries are not allowed')
                }

            }
           
        }
    };

    const checkDublicate = ()=>{
      let isDublicate =  tableData.some((data) => {
            return (
                data.firstName === formData.firstName &&
                data.lastName === formData.lastName &&
                data.dateOfBirth === formData.dateOfBirth &&
                data.gender === formData.gender &&
                data.state === formData.state &&
                data.city === formData.city
            );
        });
        if(isDublicate){
            setDublicateErrorMsg('Dublicate data is not allowed')
            return true
        }
        else{
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

    const handleCityDropDown = (selectedState)=>{
        const citiesForSelectedState = statData[selectedState];
            citiesForSelectedState.sort()
            setCities(citiesForSelectedState);
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
    };

    const handleDelete = (indexToDelete) => {
        // Create a copy of the tableData without the item to delete
        const updatedTableData = tableData.filter((_, index) => index !== indexToDelete);
        // Update the tableData state with the updated data
        setTableData(updatedTableData);
        setlocalStoreageData(updatedTableData)
    };

    const handleEdit = (data, index) => {
        setIsEditing(true);
        setEditIndex(index);
        handleCityDropDown(data.state)
        setFormData(data);
    }

    const clearFormData = () =>{
        setFormData({
            firstName: '',
            lastName: '',
            dateOfBirth: '',
            gender: '',
            hobbies: [],
            age:null,
            state: '',
            city: ''
        });
    }

    return (
        <div className="container mt-5">
            <h1>Voting Registration Form</h1>
            <form >
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
                        <div className='col-6'>
                            <label htmlFor="age" className="form-label">Age</label>
                            <input
                                type="number"
                                className="form-control"
                                id="age"
                                name="age"
                                value={formData.age === null ? '' : formData.age}
                                onChange={handleInputChange}
                                onBlur={validateForm}
                            />
                            <span className="text-danger">{errors.ageError}</span>
                        </div>
                    </div>

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
                        name="state"
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
                        name="city"
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
                    <div className='text-danger'><strong>{dublicateErrorMsg}</strong></div>
                    <button type="button" className="btn btn-primary" id='submit' onClick={handleFormSubmit}>
                        {isEditing ? 'Update' : 'Submit'}</button>
                </div>
            </form>

            <div>
                <h2>Submitted Data</h2>
                <Table tableData={tableData} onDelete={handleDelete} onEdit={handleEdit}></Table>
            </div>
        </div>
    );
};

export default Registration;
