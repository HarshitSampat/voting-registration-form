import { useEffect } from "react"

const Table = ({ tableData,onDelete,onEdit }) => {

    const handleDelete = (index) => {
        const fullName = tableData[index].firstName + ' '+ tableData[index].lastName
        alert( `Are you sure you want to Delete ${fullName}?`)
        onDelete(index);
    }

    return (
        <table className="table">
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
                {tableData.sort((a, b) =>
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
                            <div onClick={()=>onEdit(data,index)} className="">
                                <button className="btn btn-primary">
                                    <i className="bi bi-pencil-square me-1"></i>
                                    Edit
                                </button></div>
                        </td>
                        <td className="cursor-pointer">
                            <div onClick={()=>handleDelete(index)}>
                                <button className="btn btn-danger"><i className="bi bi-trash3 me-1"></i>Delete</button>
                            </div>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    )
}

export default Table