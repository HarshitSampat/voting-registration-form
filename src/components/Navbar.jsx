import { Link } from "react-router-dom"
import Registration from "./Registration"
import Table from "./Table"
const Navbar = () => {
    return (
        <>
            <nav className="navbar navbar-expand-lg navbar-light bg-success mt-2">
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarTogglerDemo03" aria-controls="navbarTogglerDemo03" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button><Link to='/' className="text-white ms-2 p-2 bg-dark rounded text-decoration-none">Home</Link>

                <div className="collapse navbar-collapse" id="navbarTogglerDemo03">
                    <ul className="navbar-nav mr-auto mt-2 mt-lg-0">
                        <li className="nav-item active">
                           <Link to='/userdata' className="text-white ms-3 bg-dark p-2 rounded text-decoration-none">UserData</Link>
                        </li>
                    </ul>
                </div>
            </nav>
        </>
    )
}

export default  Navbar