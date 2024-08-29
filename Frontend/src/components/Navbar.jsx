import React, { useState } from 'react'
import Badge from 'react-bootstrap/Badge'
import { NavLink,useNavigate } from 'react-router-dom'
import Modal from '../Modal';
import Cart from '../screens/Cart';
import { useCartState } from './ContexReducer';
function Navbar() {
    let data = useCartState()
    const [cartview, setCartview] = useState(false)
    const navigate = useNavigate();
    const handleLogout = () =>{
            localStorage.removeItem('authToken')
            navigate('/login')
    }
    return (
        <>
            <nav id='navbar' className="navbar navbar-expand-lg navbar-dark" style={{backgroundColor:'#03fc03', position:'fixed', top:0, zIndex:5, width:"100%"}}>
                <div className="container-fluid">
                    <NavLink className="navbar-brand " style={{'fontFamily':'cursive', fontSize:'24px'}} to='/'>CraveCart</NavLink>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNav" style={{display:'flex', 'justifyContent':'space-between'}}>
                        <ul className="navbar-nav">
                            <li className="nav-item">
                                <NavLink className="nav-link active " aria-current="page" to='/' style={{color:'#001a36',fontWeight:'bold',fontFamily:'poppins'}} >Home</NavLink>
                            </li>
                            {localStorage.getItem('authToken')?<li className="nav-item">
                                <NavLink className="nav-link active " aria-current="page" to='/' style={{color:'#001a36','fontWeight':'bold',fontFamily:'poppins'}} >My Orders</NavLink>
                            </li> : "" }
                        </ul>
                        {!(localStorage.getItem('authToken'))?
                        <div className='d-flex'>
                        
                                <NavLink className="btn bg-white nav-link mx-2" style={{color:'black'}}  to="/login">Log In</NavLink>
                                <NavLink className="btn bg-white nav-link" style={{color:'#001a36'}}  to="/signup">Sign up</NavLink>
                         </div>: 
                         <div className='d-flex mx-2'>
                         
                         <div>
                            <div className="btn bg-info mx-1 text-white" onClick={()=> setCartview(true)}>My Cart
                             <Badge className='mx-1' pill bg='warning'>{data.length}</Badge>
                            </div>
                            <div>
                            {cartview ? <Modal onClose={()=>setCartview(false)}><Cart/></Modal>: null }
                            </div>
                         </div>
                         <div className="btn bg-danger text-white" onClick={handleLogout}>Log Out</div>
                         </div>
                         }
                    </div>
                </div>
            </nav>
        </>
    )
}

export default Navbar
