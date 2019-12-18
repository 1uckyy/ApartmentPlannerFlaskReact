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
        this.onDelete = this.onDelete.bind(this);
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

    onDelete(project_name) {
        axios
        .delete('deleteproject/'+project_name, {
            headers: { 'Content-type': 'application/json' }
        })
        .then((response) => {
            console.log(response)
        })
        .catch((response) => {
            console.log(response)
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
                <div style={{flexGrow:1, overflow:'auto', marginTop: 20, backgroundColor: "white"}}>
                        <div className="col-sm-8 mx-auto">
                            <h1 className="text-center">Информация о профиле</h1>
                        </div>
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
                                </tbody>
                        </table>
                        <div className="col-sm-8 mx-auto" style={{marginTop:"20px"}}>
                            <h1 className="text-center">Ваши проекты:</h1>
                        </div>
                        <table className="table col-md-6 mx-auto">
                            <tbody>
                                {this.state.projects.map((item, i) => {
                                    const a = "/planner/"+item
                                    return <tr>
                                    <td align="right" style={{width: "50%"}}><Link to={a} >{item}</Link></td>
                                    <td>
                                        <button type="button" class="btn btn-danger" onClick={() => this.onDelete(item)}>Удалить</button>
                                    </td>
                                    </tr>
                                })}
                            </tbody>
                        </table>
                        <table className="table col-md-6 mx-auto">
                            <tbody>
                                <tr><td align="center" style={{width: "100%"}}><Link to="/planner"><button type="button" class="btn btn-success">Новый проект</button></Link></td></tr>
                            </tbody>
                        </table>
                    </div>
            </>
        )
    }
}

export default ProfilePage;
