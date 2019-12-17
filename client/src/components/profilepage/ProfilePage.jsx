import React, { Component } from 'react';
import jwt_decode from 'jwt-decode';
import axios from 'axios';
import { Link } from 'react-router-dom';
import ChangeLang from '../general/ChangeLang';

class ProfilePage extends Component {

    constructor() {
        super()
        this.state = {
            first_name: '',
            last_name: '',
            email: '',
            projects: []
        }
    }

    componentDidMount () {
        const token = localStorage.usertoken
        const decoded = jwt_decode(token)
        this.setState({
            first_name: decoded.identity.first_name,
            last_name: decoded.identity.last_name,
            email: decoded.identity.email,
        })

        //get user projects
        axios
        .post("getprojects", {
            project_author: decoded.identity.email
        })
        .then(response => {

            var list = []

            for(let i=0; i<response.data.length; i++) {
                list.push(response.data[i]['project_name']);
            }

            this.setState({
                projects: list
            })
        })
    }

    render () {
        return (
            <>
                <header id="header" className="header">
                    <div className="logo_text_around">
                    <Link to="/" style={{textDecoration: "none"}}>
                        <div id="logo" className="logo_text">
                            Apartment Planner
                        </div>
                    </Link>
                    </div>

                    <ChangeLang />
                </header>
                <table className="table col-md-6 mx-auto">
                    <tbody>
                        <tr>
                            <td>Имя:</td>
                            <td>{this.state.first_name}</td>
                        </tr>
                        <tr>
                            <td>Фамилия:</td>
                            <td>{this.state.last_name}</td>
                        </tr>
                        <tr>
                            <td>Email:</td>
                            <td>{this.state.email}</td>
                        </tr>
                        <tr>
                            <td>Projects:</td>
                            {this.state.projects.map(function(item) {
                                const a = "/planner/"+item
                                return <Link to={a} >
                                <td key={item}>{item}</td>
                            </Link>
                            })}
                        </tr>
                    </tbody>
                </table>
            </>
        )
    }
}

export default ProfilePage;
