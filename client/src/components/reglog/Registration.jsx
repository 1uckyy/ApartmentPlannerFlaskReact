import React, { Component } from 'react';
import { Link } from 'react-router-dom';

//components
import ChangeLang from '../general/ChangeLang';

//functions
import { register } from './UserFunctions'

class Registration extends Component {

    constructor() {
        super()
        this.state = {
            first_name: '',
            last_name: '',
            email: '',
            password: '',
        }
        this.onChange = this.onChange.bind(this)
        this.onSubmit = this.onSubmit.bind(this)
    }

    onChange (e) {
        this.setState({ [e.target.name]: e.target.value })
    }

    onSubmit (e) {
        e.preventDefault()

        const newUser = {
            first_name: this.state.first_name,
            last_name: this.state.last_name,
            email: this.state.email,
            password: this.state.password
        }

        register(newUser).then(res => {
            if (!res.error)
                this.props.history.push(`/login`)
            else 
                alert(res.error);
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

            <div style={{flexGrow:1}}>
                    <div className="col-md-6 mt-5 mx-auto" style={{ backgroundColor: "white", borderRadius: "10px", padding: "30px" }}>
                        <form noValidate onSubmit={this.onSubmit}>
                            <h1 className="h3 mb-3 font-weight-normal">Регистрация</h1>
                            <div className="form-group">
                                <label htmlFor="first_name">Имя</label>
                                <input type="text"
                                    className="form-control"
                                    name="first_name"
                                    placeholder="Введите имя"
                                    value={this.state.first_name}
                                    onChange={this.onChange} />
                            </div>
                            <div className="form-group">
                                <label htmlFor="last_name">Фамилия</label>
                                <input type="text"
                                    className="form-control"
                                    name="last_name"
                                    placeholder="Введите фамилию"
                                    value={this.state.last_name}
                                    onChange={this.onChange} />
                            </div>
                            <div className="form-group">
                                <label htmlFor="email">Адрес Email</label>
                                <input type="email"
                                    className="form-control"
                                    name="email"
                                    placeholder="Введите Email"
                                    value={this.state.email}
                                    onChange={this.onChange} />
                            </div>
                            <div className="form-group">
                                <label htmlFor="password">Пароль</label>
                                <input type="password"
                                    className="form-control"
                                    name="password"
                                    placeholder="Введите пароль"
                                    value={this.state.password}
                                    onChange={this.onChange} />
                            </div>
                            <button type="submit" className="btn btn-lg btn-primary">
                                Зарегистрироваться
                            </button>
                        </form>
                    </div>
                </div>
        </>
        )
    }
}

export default Registration;