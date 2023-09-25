import { useEffect,useState } from "react"
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

const Table = () => {
    const navigate = useNavigate()

    const [deleteIndex, setDeleteIndex] = useState(-1);
    const [fullName,setFullName] = useState('')
    const [userData, setUserData] = useState([])

    useEffect(() => {
        
        let userdata = localStorage.getItem("userData")
        if(userdata) setUserData(JSON.parse(userdata)) 
        
    }, []);

    const openDeleteModal = (index) => {
        setDeleteIndex(index);
        let fullname = userData[index].firstName+' '+userData[index].lastName
        setFullName(fullname)
    };

    const closeDeleteModal = () => {
        setDeleteIndex(-1);
    };

    const handleDelete = (index) => {
        userData.splice(index,1)
        localStoreDataValues(userData)
        closeDeleteModal()
    }

    const localStoreDataValues = (userData)=>{
        localStorage.setItem("userData",JSON.stringify(userData))
    }

    const handleEdit = (data,index) => {
        navigate(`/edit/userdata/${index}`);
    }

    return (
        <div className="container">  
        <Navbar/>  
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
                    <th>Edit</th>
                    <th>Delete</th>
                </tr>
            </thead>
            <tbody>
                {userData.sort((a, b) =>
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
                        <td className="cursor-pointer">
                            <div onClick={()=>handleEdit(data,index)} className="">
                                <button id={index} className="btn btn-primary">
                                    <i className="bi bi-pencil-square me-1"></i>
                                    Edit
                                </button></div>
                        </td>
                        <td className="cursor-pointer">
                            <div onClick={()=>openDeleteModal(index)}>
                                <button id={index}  className="btn btn-danger"><i className="bi bi-trash3 me-1"></i>Delete</button>
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
                                onClick={()=>handleDelete(deleteIndex)}
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