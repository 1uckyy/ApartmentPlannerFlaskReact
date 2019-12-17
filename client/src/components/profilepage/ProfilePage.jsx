import React, { Component } from 'react';
import jwt_decode from 'jwt-decode';

class ProfilePage extends Component {

    constructor() {
        super()
        this.state = {
            first_name: '',
            last_name: '',
            email: ''
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
    }

    render () {
        return (
            <>
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
            </>
        )
    }
}

export default ProfilePage;
