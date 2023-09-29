import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import statedata from '../assets/indianStateCityAreaCode.json'
import Select from 'react-select'

const Table = () => {
    const navigate = useNavigate()

    const [deleteIndex, setDeleteIndex] = useState(-1);
    const [fullName, setFullName] = useState('')
    const [userData, setUserData] = useState([])
    const [filterData, setFilterData] = useState([])
    const [state, setStates] = useState([])
    const [city, setCity] = useState([])
    const [genderFiltervalue, setGenderFilterValue] = useState('')
    const [stateFilterValue, setStateFilterValue] = useState('')
    const [cityFilterValue, setCityFilterValue] = useState('')
    const [hobbiesFilterVAlue, setHobbiesFilterValue] = useState([])
    const [TempSelectValue, setTempSelectValues] = useState([])

    const [ageFilterValue, setAgeFilterValue] = useState({
        min: 0,
        max: 0
    })
    const gender = ['Male', 'Female']

    useEffect(() => {
        const states = Object.keys(statedata)

        states.sort()
        handleStateCityDropdown("states", states)

        getCities()
        
        let userdata = localStorage.getItem("userData")
        if (userdata) {
            setUserData(JSON.parse(userdata))
            setFilterData(JSON.parse(userdata))
        }
    }, []);

    const openDeleteModal = (index) => {
        setDeleteIndex(index);
        let fullname = userData[index].firstName + ' ' + userData[index].lastName
        setFullName(fullname)
    };
    const closeDeleteModal = () => {
        setDeleteIndex(-1);
    };

    const handleDelete = (index) => {
        userData.splice(index, 1)
        setFilterData(userData)
        localStoreDataValues(userData)
        closeDeleteModal()
    }

    const localStoreDataValues = (userData) => {
        localStorage.setItem("userData", JSON.stringify(userData))
    }

    const handleEdit = (data, index) => {
        navigate(`/edit/userdata/${index}`);
    }

    const getCities = () =>{
        let cities = []
        const cityData = Object.keys(statedata)
        cityData.map((state,index)=>{
            Object.keys(statedata[state]).map((city,index)=>{
                cities.push(city)
            })
        })
        handleStateCityDropdown("Cities",cities.sort())
    }

    const handleFilter = (key, value) => {
        let filteredData = [];
        let userList = userData
        

        const checkvalue = checkCityIncludes(key,value)

        let status = false

        if (checkvalue['GenderData']) {
            status = true
            filteredData = userList.filter((data) => data.gender ===checkvalue['GenderData'])
        }

        // Apply state filter
        if (checkvalue['StateData']?.value) {
            status = true
            filteredData = (filteredData?.length > 0 ? filteredData : userList).filter((data) => data.state === checkvalue['StateData']?.value)
        }
        if (checkvalue['cityData']?.value) {
            status = true
            filteredData = (filteredData?.length > 0 ? filteredData : userList).filter((data) => data.city === checkvalue['cityData']?.value)
        }


        // Age range filter
        // if (ageFilterValue.min !== '' && ageFilterValue.max !== '') {
        //     filteredData = filteredData.filter(x => x.age >= ageFilterValue.min && x.age <= ageFilterValue.max);
        // }

        // // Hobbies filter
        // if (hobbiesFilterValue !== '') {
        //     filteredData = filteredData.filter(x => x.hobbies.includes(hobbiesFilterValue));
        // }
        // console.log("line 110", filteredData);
        setFilterData(status ? filteredData : userList);
    }
    const handleStateCityDropdown = (key, values) => {
        let stateCityValues = []
        let setValues = {}
        values.map((stateCity,index) => {
            setValues['value'] = stateCity;
            setValues['label'] = stateCity
            stateCityValues.push(setValues)
            setValues = {}
        })
        key === 'states' ?  setStates(stateCityValues) : setCity(stateCityValues)
    }

    const checkCityIncludes = (key,value) => {

        const genderData = key === 'Gedner' ? value : genderFiltervalue
        const stateData = key === 'State' ? value : stateFilterValue
        const cityData = key === 'City' ? value : cityFilterValue
        
        let filterValues = {}
        const stateName = stateData?.value
        if (stateName) {
            let cities = Object.keys(statedata[stateName])
            setCity(cities.map((city) => {
                return { label: city, value: city }
            }))
            if (cities.includes(cityData?.value)) {
                setGenderFilterValue(genderData)
                setStateFilterValue(stateData)
                setCityFilterValue(cityData)
                
            } else {
                setGenderFilterValue(genderData)
                setStateFilterValue(stateData)
                setCityFilterValue('')
            }
        } else {
           getCities()
            setGenderFilterValue(genderData)
            setStateFilterValue(stateData)
            setCityFilterValue(cityData)

        }
        filterValues['GenderData'] = genderData
        filterValues['StateData'] = stateData
        filterValues['cityData'] = cityData
        return filterValues

    }

    return (
        <div className="container">
            <Navbar />

            <div className="mt-4">
                <div className="row">
                    <div className="col-md-2">
                        <label htmlFor="filterGenderDropdown" className="mb-1">
                            <strong>Gender</strong></label>
                        <select
                            id="filterGenderDropdown"
                            className="form-control p-2 rounded"
                            onChange={(e) => {
                                handleFilter('Gedner', e.target.value)
                            }

                            }
                            value={genderFiltervalue || ''}
                        >
                            <option value="">Select Gender</option>
                            {gender.map((gender) => (
                                <option key={gender} value={gender}>{gender}</option>
                            ))}

                        </select>
                    </div>

                    {/* filter for stat */}
                    <div className="col-md-2 ms-2">
                        <div>
                            <label className="mb-1"><strong>State</strong></label>
                        </div>
                        <Select
                            defaultValue="SelectedOption"
                            options={state}
                            value={stateFilterValue || ''}
                            isClearable
                            isSearchable
                            onChange={(e) => handleFilter("State", e)}

                        ></Select>
                    </div>

                    {/* filter City */}
                    <div className="col-md-2">
                        <label htmlFor="city" className="mb-1">
                            <strong>City</strong>
                        </label>

                        <Select
                            defaultValue="Select Option"
                            options={city}
                            isClearable={true}
                            value={cityFilterValue || ''}
                            onChange={(e) => handleFilter("City", e)}

                        />
                    </div>


                </div>

            </div>

            <table className="table mt-3">
                <thead>
                    <tr>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Date of Birth</th>
                        <th>Gender</th>
                        <th>Hobbies</th>
                        <th>Age</th>
                        <th>Stat</th>
                        <th>City</th>
                        <th>Area</th>
                        <th>Edit</th>
                        <th>Delete</th>
                    </tr>
                </thead>
                <tbody>
                    {filterData.sort((a, b) =>
                        a.firstName.localeCompare(b.firstName)
                    ).map((data, index) => (
                        <tr key={`tr${index + 1}`}>
                            <td>{data.firstName}</td>
                            <td>{data.lastName}</td>
                            <td>{data.dateOfBirth}</td>
                            <td>{data.gender}</td>
                            <td>{data.hobbies.join(', ')}</td>
                            <td>{data.age}</td>
                            <td>{data.state}</td>
                            <td>{data.city}</td>
                            <td>{data.area}</td>
                            <td className="cursor-pointer">
                                <div onClick={() => handleEdit(data, index)} className="">
                                    <button id={index} className="btn btn-primary">
                                        <i className="bi bi-pencil-square me-1"></i>
                                        Edit
                                    </button></div>
                            </td>
                            <td className="cursor-pointer">
                                <div onClick={() => openDeleteModal(index)}>
                                    <button id={index} className="btn btn-danger"><i className="bi bi-trash3 me-1"></i>Delete</button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Delete Confirmation Modal */}
            <div
                className={`modal fade ${deleteIndex !== -1 ? "show" : ""}`}
                style={{ display: deleteIndex !== -1 ? "block" : "none" }}
            >
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Confirm Deletion</h5>
                            <button
                                type="button"
                                className="btn-close"
                                onClick={closeDeleteModal}
                            ></button>
                        </div>
                        <div className="modal-body">
                            Are you sure you want to delete {fullName}?
                        </div>
                        <div className="modal-footer">
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={closeDeleteModal}
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                className="btn btn-danger"
                                onClick={() => handleDelete(deleteIndex)}
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default Table