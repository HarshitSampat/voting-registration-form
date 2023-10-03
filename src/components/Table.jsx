import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import indianStates from '../assets/indianStateandAreawithcode.json'
import Select from 'react-select'
import { filter } from "lodash";

const Table = () => {
    const navigate = useNavigate()

    const [deleteIndex, setDeleteIndex] = useState(-1);
    const [fullName, setFullName] = useState('')
    const [userData, setUserData] = useState([])
    const [filterData, setFilterData] = useState([])
    const [state, setStates] = useState([])
    const [city, setCity] = useState([])
    const [area,setArea] = useState([])
    const [genderFiltervalue, setGenderFilterValue] = useState('')
    const [stateFilterValue, setStateFilterValue] = useState('')
    const [cityFilterValue, setCityFilterValue] = useState('')
    const [areaFilterValue,setAreaFilterValue] = useState('')
    const [searchFirstName, setSearchFirstName] = useState('')
    const [sortingValue, setSortingValue] = useState('')
    const [hobbiesFilterValue, setHobbiesFilterValue] = useState([])
    const [TempSelectValue, setTempSelectValues] = useState([])
    // const [sortDropDownValues, setSortDropDownValues] = useState([])
    const [ageFilterminValue, setAgeFilterMinValue] = useState(0);
    const [ageFilteMaxValue, setAgeFilterMaxValue] = useState(0)
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

    // paginate related state
    const [currentPage, setCurrentPage] = useState(1);
    const [usersPerPage] = useState(5);

    // Calculate the index of the last user on the current page
    const indexOfLastUser = currentPage * usersPerPage;
    // Calculate the index of the first user on the current page
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    // Get the current users to display
    const currentUsers = filterData.slice(indexOfFirstUser, indexOfLastUser)

    // Calculate total pages
    const totalUsers = filterData.length;
    const totalPages = Math.ceil(totalUsers / usersPerPage);


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
        const areaData = key === 'Area'? value : areaFilterValue

        const stateName = stateData?.value

        const cityName = cityData?.value
        let areaValues= []
        if(stateName && cityName) {
          areaValues =   getAreas(stateName,cityName)
        }

        if (stateName) {
            let cities = getCities(stateName)
            //
            if (cities.includes(cityData?.value)) {
                setGenderFilterValue(genderData)
                setStateFilterValue(stateData)
                setCityFilterValue(cityData)
                
                if(areaValues.includes(areaData?.value)){
                    setAreaFilterValue(areaData)
                }
                else{
                    setAreaFilterValue('')
                }

            } else {
                setGenderFilterValue(genderData)
                setStateFilterValue(stateData)
                setCityFilterValue('')
                setAreaFilterValue('')
            }
        } else {
            getCities(stateName)
            setGenderFilterValue(genderData)
            setStateFilterValue(stateData)
            setCityFilterValue(cityData)
            setAreaFilterValue('')
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
        if (key==='Areas') setArea(stateCityValues)

    }

    const handleSearch = (e) => {
        const value = e.target.value;
        setSearchFirstName(value)

        if (value) {
            let serchFiltervalues = filterData.filter(item => {
                for (let e in item) {
                    if (item[e].toString().toLowerCase().includes(value.toLowerCase())) return item;
                }
            })
            setFilterData(serchFiltervalues)
        } else {
            setFilterData(userData)
        }

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

        if (ageFilteMaxValue === 0) setAgeFilterMaxValue(120)
        if (ageFilterminValue && ageFilteMaxValue) {
            filterData = filterData.filter(x => (x.age <= ageFilteMaxValue && x.age >= ageFilterminValue))
        }

        if(areaFilterValue){
            filterData = filterData.filter(x=>x.area === areaFilterValue.value)
        }
        setFilterData(filterData)
    }

    const handleSorting = (filterOrder, field) => {
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
    const resetFilter = () => {
        setFilterData(userData)
        setSearchFirstName("")
        setAgeFilterValue(0)
        setGenderFilterValue("")
        setStateFilterValue("")
        setCityFilterValue("")
    }

    // Function to go to the next page
    const nextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };


    const prevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const getAreas = (stateName,cityName)=>{
      let cityData =   indianStates.find(x=>x.name === cityName)
      
      let parentId = cityData.ID
      let getArea =  indianStates.filter(x => x.parentId === parentId)
    
      let areaValues = []
      getArea.forEach(x => {
        areaValues.push(x.name)
      })

      handleStateCityDropdown("Areas",areaValues)
      return areaValues
    }

    return (
        <div className="container">
            <Navbar />
            <div className="mt-4">
                <div className="row">

                    <div className="col-md-2">
                        <label className="mb-1"></label>
                        <input
                            onChange={handleSearch}
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

                    <div className="col-md-2">
                        <label htmlFor="area" className="mb-1">
                            <strong>Area</strong>
                        </label>

                        <Select
                            id="filter-area"
                            defaultValue="Select Option"
                            options={area}
                            isClearable={true}
                            value={areaFilterValue || ''}
                            onChange={(e) => handleFilter("Area", e)}

                        />
                    </div>


                    {/* <label htmlFor="city" className="mb-1">
                            <strong>Age</strong>
                        </label>
                        <div>
                            <input type="range" value={ageFilterValue} onInput={(e) => setAgeFilterValue(e.target.value)} />
                            {ageFilterValue}
                        </div> */}



                </div>


                <div className="row mt-3">
                    <div className="col-md-2">
                        <label htmlFor="minFilterage">Min Age</label>
                        <input
                            id="filter-minAge"
                            className="form-control"
                            value={ageFilterminValue}
                            type="number"
                            onChange={(e) => setAgeFilterMinValue(e.target.value)}
                        />
                    </div>
                    <div className="col-md-2">
                        <label htmlFor="maxFilterage">Max Age</label>

                        <input type="number"
                            id="filter-maxAge"
                            className="form-control"
                            value={ageFilteMaxValue}
                            onChange={(e) => setAgeFilterMaxValue(e.target.value)}
                        />
                    </div>

                </div>

                {/* filter Button */}
                <div className="col">
                    <button className="btn btn-secondary mt-4" id="filter" onClick={handleFilterData}><i className="bi bi-filter"></i>Filter</button>
                    <button className="btn btn-success mt-4 ms-2" id="filter" onClick={resetFilter}><i className="bi bi-bootstrap-reboot me-2"></i>Reset Filter</button>
                </div>

            </div>

            <table className="table mt-3">
                <thead>
                    <tr>
                        <th>First Name

                            {sortingFirstName ? (
                                <i className="bi bi-arrow-down" onClick={(e) => {
                                    handleSorting("asc", "firstName")
                                    setSortingFirstName(!sortingFirstName);
                                }}></i>
                            ) : (
                                <i className="bi bi-arrow-up" onClick={(e) => {
                                    handleSorting("desc", "firstName")
                                    setSortingFirstName(!sortingFirstName);
                                }}></i>
                            )}
                        </th>
                        <th>Last Name
                            {sortingLastName ? (
                                <i className="bi bi-arrow-down" onClick={(e) => {
                                    handleSorting("asc", "lastName")
                                    setSortingLastName(!sortingLastName);
                                }}></i>
                            ) : (
                                <i className="bi bi-arrow-up" onClick={(e) => {
                                    handleSorting("desc", "lastName")
                                    setSortingLastName(!sortingLastName);
                                }}></i>
                            )}
                        </th>
                        <th>Date of Birth
                            {sortingdate ? (
                                <i className="bi bi-arrow-down" onClick={(e) => {
                                    handleSorting("asc", "dateOfBirth")
                                    setSortingDate(!sortingdate);
                                }}></i>
                            ) : (
                                <i className="bi bi-arrow-up" onClick={(e) => {
                                    handleSorting("desc", "dateOfBirth")
                                    setSortingDate(!sortingdate);
                                }}></i>
                            )}
                        </th>
                        <th>Gender</th>
                        <th>Hobbies</th>
                        <th>Age
                            {sortingAge ? (
                                <i className="bi bi-arrow-down" onClick={(e) => {
                                    handleSorting("asc", "age")
                                    setSortingAge(!sortingAge);
                                }}></i>
                            ) : (
                                <i className="bi bi-arrow-up" onClick={(e) => {
                                    handleSorting("desc", "age")
                                    setSortingAge(!sortingAge);
                                }}></i>
                            )}
                        </th>
                        <th>State
                            {sortingState ? (
                                <i className="bi bi-arrow-down" onClick={(e) => {
                                    handleSorting("asc", "state")
                                    setSortingState(!sortingState);
                                }}></i>
                            ) : (
                                <i className="bi bi-arrow-up" onClick={(e) => {
                                    handleSorting("desc", "state")
                                    setSortingState(!sortingState);
                                }}></i>
                            )}
                        </th>
                        <th>City
                            {sortingCity ? (
                                <i className="bi bi-arrow-down" onClick={(e) => {
                                    handleSorting("asc", "city")
                                    setSortingCity(!sortingCity);
                                }}></i>
                            ) : (
                                <i className="bi bi-arrow-up" onClick={(e) => {
                                    handleSorting("desc", "city")
                                    setSortingCity(!sortingCity);
                                }}></i>
                            )}
                        </th>
                        <th>Area
                            {sortingArea ? (
                                <i className="bi bi-arrow-down" onClick={(e) => {
                                    handleSorting("asc", "area")
                                    setSortingArea(!sortingArea);
                                }}></i>
                            ) : (
                                <i className="bi bi-arrow-up" onClick={(e) => {
                                    handleSorting("desc", "area")
                                    setSortingArea(!sortingArea);
                                }}></i>
                            )}
                        </th>
                        <th>Salary
                            {sortingSalary ? (
                                <i className="bi bi-arrow-down" onClick={(e) => {
                                    handleSorting("asc", "salary")
                                    setSortingSalary(!sortingSalary);
                                }}></i>
                            ) : (
                                <i className="bi bi-arrow-up" onClick={(e) => {
                                    handleSorting("desc", "salary")
                                    setSortingSalary(!sortingSalary);
                                }}></i>
                            )}
                        </th>
                        <th>Edit</th>
                        <th>Delete</th>

                    </tr>
                </thead>
                <tbody>
                    {currentUsers.map((data, index) => (
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
                                <div onClick={() => handleEdit(data, data.userId)} className="">
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

            {/* PAgination */}
            <nav>
                <ul className="pagination">
                    <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                        <button className="page-link" onClick={prevPage}>
                            Previous
                        </button>
                    </li>
                    {Array.from({ length: totalPages }, (_, i) => (
                        <li
                            key={i}
                            className={`page-item ${currentPage === i + 1 ? "active" : ""}`}
                        >
                            <button
                                className="page-link"
                                onClick={() => paginate(i + 1)}
                            >
                                {i + 1}
                            </button>
                        </li>
                    ))}
                    <li
                        className={`page-item ${currentPage === totalPages ? "disabled" : ""
                            }`}
                    >
                        <button className="page-link" onClick={nextPage}>
                            Next
                        </button>
                    </li>
                </ul>
            </nav>

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