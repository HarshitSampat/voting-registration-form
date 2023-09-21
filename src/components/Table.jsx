const Table = ({tableData}) => {
    console.log(tableData);
    return (
        <table className="table">
            <thead>
                <tr>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>Date of Birth</th>
                    <th>Gender</th>
                    <th>Hobbies</th>
                    <th>Stat</th>
                    <th>City</th>
                </tr>
            </thead>
            <tbody>
                {tableData.map((data, index) => (
                    <tr key={`tr${index + 1}`}>
                        <td>{data.firstName}</td>
                        <td>{data.lastName}</td>
                        <td>{data.dateOfBirth}</td>
                        <td>{data.gender}</td>
                        <td>{data.hobbies.join(', ')}</td>
                        <td>{data.state}</td>
                        <td>{data.city}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    )
}

export default Table