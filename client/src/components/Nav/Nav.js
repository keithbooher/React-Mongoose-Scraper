import React from "react";
import { Link } from "react-router-dom";

const Nav = () =>

  <nav className="navbar navbar-dark bg-danger" style={{position: 'fixed', zIndex: 100, width: '100%'}}>
    <Link className="navbar-brand" to="/">NYT Article Search</Link>
    <ul className="navbar-nav" style={{float: 'right'}}>
      <li className="nav-item" style={{margin: "5px"}}>
        <Link to="/"><button type="button" className="btn btn-info">Home</button></Link>
      </li>
      <li className="nav-item" style={{margin: "5px"}}>
        <Link to="/savedArticles"><button type="button" className="btn btn-info">Saved Articles</button></Link>
      </li>
    </ul>
</nav>;

export default Nav;