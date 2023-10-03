import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import indianStates from '../assets/indianStateandAreawithcode.json'
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
    const [searchFirstName, setSearchFirstName] = useState('')
    const [sortingValue, setSortingValue] = useState('')
    const [hobbiesFilterValue, setHobbiesFilterValue] = useState([])
    const [TempSelectValue, setTempSelectValues] = useState([])
    const [sortDropDownValues, setSortDropDownValues] = useState([])
    const [ageFilterminValue, setAgeFilterMinValue] = useState(0);
    const [ageFilteMaxValue, setAgeFilterMaaxValue] = useState(0)
    const [sortingFirstName, setSortingFirstName] = useState(false)
    const [sortingLastName, setSortingLastName] = useState(false)
    const [sortingdate, setSortingDate] = useState(false)
    const [sortingAge, setSortingAge] = useState(false)
    const [sortingState, setSortingState] = useState(false)
    const [sortingCity, setSortingCity] = useState(false)
    const [sortingArea, setSortingArea] = useState(false)
    const [sortingSalary, setSortingSalary] = useState(false)

    const [ageFilterValue, setAgeFilterValue] = useState(0)
    const gender = ['Male', 'Female']

    useEffect(() => {
        let indianState = indianStates.filter(x => x.parentId === null)
        let states = []
        if (indianStates)
            indianState.forEach(element => {
                states.push(element.name)
            });

        states.sort()
        handleStateCityDropdown("states", states)

        let userdata = localStorage.getItem("userData")
        if (userdata) {
            setUserData(JSON.parse(userdata))
            let dropDownOptions = Object.keys(JSON.parse(userdata)[0])
            handleStateCityDropdown("sortDropDown", dropDownOptions)
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

    const getCities = (statedatavalues) => {
        let cities = []
        let stateData = {}
        let cityData = []
        if (statedatavalues) {
            stateData = indianStates.find((state) => state.name === statedatavalues)
        }
        if (stateData.ID) {
            cityData = indianStates.filter((city) => city.parentId === stateData.ID)
        }

        if (cityData.length > 0) {
            cityData.forEach(x => {
                cities.push(x.name)
            })
        }

        handleStateCityDropdown("Cities", cities.sort())
        return cities
    }

    const handleFilter = (key, value) => {
        const genderData = key === 'Gedner' ? value : genderFiltervalue
        const stateData = key === 'State' ? value : stateFilterValue
        const cityData = key === 'City' ? value : cityFilterValue

        const stateName = stateData?.value
        let values = getCities(stateName)

        if (stateName) {
            let cities = getCities(stateName)
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
            getCities(stateName)
            setGenderFilterValue(genderData)
            setStateFilterValue(stateData)
            setCityFilterValue(cityData)
        }

    }
    const handleStateCityDropdown = (key, values) => {
        let stateCityValues = []
        let setValues = {}
        values.map((stateCity, index) => {
            setValues['value'] = stateCity;
            setValues['label'] = stateCity
            stateCityValues.push(setValues)
            setValues = {}
        })
        if (key === 'states') setStates(stateCityValues)
        if (key === 'Cities') setCity(stateCityValues)
        if (key === 'sortDropDown') setSortDropDownValues(stateCityValues)

    }

    const handleSearchWithFirstName = (e) => {
        const value = e.target.value;
        setSearchFirstName(value)

        let serchFiltervalues = filterData.filter(item => {
            for (let e in item) {
                if (item[e].toString().toLowerCase().includes(value.toLowerCase())) return item;
            }
        })
        setFilterData(serchFiltervalues)
    }

    const handleFilterData = () => {
        let filterData = userData
        if (genderFiltervalue) {
            filterData = filterData.filter(x => x.gender === genderFiltervalue)
        }

        if (stateFilterValue) {
            filterData = filterData.filter(x => x.state === stateFilterValue.value)
        }

        if (cityFilterValue) {
            filterData = filterData.filter(x => x.city === cityFilterValue.value)
        }

        if (ageFilterValue >= 0) {
            filterData = filterData.filter(x => x.age <= ageFilterValue)
        }
        setFilterData(filterData)
    }

    const handleFirstNameSorting = (filterOrder, field) => {
        const isAscending = filterOrder === 'asc';
        if (field === 'age' || field === 'salary') {

            let sortedValues = [...filterData].sort((a, b) => {
                if (isAscending)
                    return a[field] - b[field]
                else
                    return b[field] - a[field];
            });
            setFilterData([...sortedValues]);
        }
        else {
            let sortedValues = [...filterData].sort((a, b) => {
                if (isAscending)
                    return a[field].localeCompare(b[field])
                else
                    return b[field].localeCompare(a[field]);
            });
            setFilterData([...sortedValues]);
        }
    }

    return (
        <div className="container">
            <Navbar />
            <div className="mt-4">
                <div className="row">

                    <div className="col-md-2">
                        <label className="mb-1"></label>
                        <input
                            onChange={handleSearchWithFirstName}
                            value={searchFirstName}
                            className="form-control"
                            placeholder="Search"
                            id="search"
                            type="search"
                        />
                    </div>

                    <div className="col-md-2">
                        <label htmlFor="filterGenderDropdown" className="mb-1">
                            <strong>Gender</strong></label>
                        <select
                            id="filter-gender"
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
                            id="filter-state"
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
                            id="filter-city"
                            defaultValue="Select Option"
                            options={city}
                            isClearable={true}
                            value={cityFilterValue || ''}
                            onChange={(e) => handleFilter("City", e)}

                        />
                    </div>

                    {/* range Filter */}
                    <div className="col-md-2">
                        <label htmlFor="city" className="mb-1">
                            <strong>Age</strong>
                        </label>
                        <div>
                            <input type="range" value={ageFilterValue} onInput={(e) => setAgeFilterValue(e.target.value)} />
                            {ageFilterValue}
                        </div>
                    </div>

                    {/* filter Button */}
                    <div className="col-md-2">
                        <button className="btn btn-secondary mt-4" id="filter" onClick={handleFilterData}>Filter</button>
                    </div>
                </div>

            </div>

            <table className="table mt-3">
                <thead>
                    <tr>
                        <th>First Name

                            {sortingFirstName ? (
                                <i className="bi bi-arrow-down" onClick={(e) => {
                                    handleFirstNameSorting("asc", "firstName")
                                    setSortingFirstName(!sortingFirstName);
                                }}></i>
                            ) : (
                                <i className="bi bi-arrow-up" onClick={(e) => {
                                    handleFirstNameSorting("desc", "firstName")
                                    setSortingFirstName(!sortingFirstName);
                                }}></i>
                            )}
                        </th>
                        <th>Last Name
                            {sortingLastName ? (
                                <i className="bi bi-arrow-down" onClick={(e) => {
                                    handleFirstNameSorting("asc", "lastName")
                                    setSortingLastName(!sortingLastName);
                                }}></i>
                            ) : (
                                <i className="bi bi-arrow-up" onClick={(e) => {
                                    handleFirstNameSorting("desc", "lastName")
                                    setSortingLastName(!sortingLastName);
                                }}></i>
                            )}
                        </th>
                        <th>Date of Birth
                            {sortingdate ? (
                                <i className="bi bi-arrow-down" onClick={(e) => {
                                    handleFirstNameSorting("asc", "dateOfBirth")
                                    setSortingDate(!sortingdate);
                                }}></i>
                            ) : (
                                <i className="bi bi-arrow-up" onClick={(e) => {
                                    handleFirstNameSorting("desc", "dateOfBirth")
                                    setSortingDate(!sortingdate);
                                }}></i>
                            )}
                        </th>
                        <th>Gender</th>
                        <th>Hobbies</th>
                        <th>Age
                            {sortingAge ? (
                                <i className="bi bi-arrow-down" onClick={(e) => {
                                    handleFirstNameSorting("asc", "age")
                                    setSortingAge(!sortingAge);
                                }}></i>
                            ) : (
                                <i className="bi bi-arrow-up" onClick={(e) => {
                                    handleFirstNameSorting("desc", "age")
                                    setSortingAge(!sortingAge);
                                }}></i>
                            )}
                        </th>
                        <th>State
                            {sortingState ? (
                                <i className="bi bi-arrow-down" onClick={(e) => {
                                    handleFirstNameSorting("asc", "state")
                                    setSortingState(!sortingState);
                                }}></i>
                            ) : (
                                <i className="bi bi-arrow-up" onClick={(e) => {
                                    handleFirstNameSorting("desc", "state")
                                    setSortingState(!sortingState);
                                }}></i>
                            )}
                        </th>
                        <th>City
                            {sortingCity ? (
                                <i className="bi bi-arrow-down" onClick={(e) => {
                                    handleFirstNameSorting("asc", "city")
                                    setSortingCity(!sortingCity);
                                }}></i>
                            ) : (
                                <i className="bi bi-arrow-up" onClick={(e) => {
                                    handleFirstNameSorting("desc", "city")
                                    setSortingCity(!sortingCity);
                                }}></i>
                            )}
                        </th>
                        <th>Area
                            {sortingArea ? (
                                <i className="bi bi-arrow-down" onClick={(e) => {
                                    handleFirstNameSorting("asc", "area")
                                    setSortingArea(!sortingArea);
                                }}></i>
                            ) : (
                                <i className="bi bi-arrow-up" onClick={(e) => {
                                    handleFirstNameSorting("desc", "area")
                                    setSortingArea(!sortingArea);
                                }}></i>
                            )}
                        </th>
                        <th>Salary
                            {sortingSalary ? (
                                <i className="bi bi-arrow-down" onClick={(e) => {
                                    handleFirstNameSorting("asc", "salary")
                                    setSortingSalary(!sortingSalary);
                                }}></i>
                            ) : (
                                <i className="bi bi-arrow-up" onClick={(e) => {
                                    handleFirstNameSorting("desc", "salary")
                                    setSortingSalary(!sortingSalary);
                                }}></i>
                            )}
                        </th>
                        <th>Edit</th>
                        <th>Delete</th>

                    </tr>
                </thead>
                <tbody>
                    {filterData.map((data, index) => (
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
                            <td>{data.salary}</td>
                            <td className="cursor-pointer">
                                <div onClick={() => handleEdit(data, index)} className="">
                                    <button id={data.firstName + '-' + data.lastName + '-edit'} className="btn btn-primary">
                                        <i className="bi bi-pencil-square me-1"></i>
                                        Edit
                                    </button></div>
                            </td>
                            <td className="cursor-pointer">
                                <div onClick={() => openDeleteModal(index)}>
                                    <button id={data.firstName + '-' + data.lastName + '-delete'} className="btn btn-danger"><i className="bi bi-trash3 me-1"></i>Delete</button>
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
                                id="cancel"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                className="btn btn-danger"
                                id='confirm'
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