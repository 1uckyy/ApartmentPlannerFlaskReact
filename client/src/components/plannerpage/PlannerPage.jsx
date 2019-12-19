import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import jwt_decode from 'jwt-decode';
import axios from 'axios';

//components
import ChangeLang from '../general/ChangeLang';
import FurnitureItem from './FurnitureItem';
import Modal from './modalwindow/Modal';

//css
import '../../css/PlannerPageStyle.css';

//images
import recycle_bin from '../../images/PlannerPage/recycle_bin.png';
import search from '../../images/PlannerPage/search.png';

//images furniture items
import bed from '../../images/PlannerPage/FurnitureItems/bed.png';
import chair from '../../images/PlannerPage/FurnitureItems/chair.png';
import flower from '../../images/PlannerPage/FurnitureItems/flower.png';
import sofa from '../../images/PlannerPage/FurnitureItems/sofa.png';
import table from '../../images/PlannerPage/FurnitureItems/table.png';
import kreslo from '../../images/PlannerPage/FurnitureItems/kreslo.png';
import plita from '../../images/PlannerPage/FurnitureItems/plita.png';
import toilet from '../../images/PlannerPage/FurnitureItems/toilet.png';
import watch from '../../images/PlannerPage/FurnitureItems/watch.png';
import rakovina from '../../images/PlannerPage/FurnitureItems/rakovina.png';
import tumb from '../../images/PlannerPage/FurnitureItems/tumb.png';

//functions
import { login, register } from '../reglog/UserFunctions'

class PlannerPage extends Component {

    constructor() {
        super()
        this.state = {
            first_name: '',
            last_name: '',
            email: '',
            password: '',
            auth: false,
            have_acc: true,
        }

        this.onChangeLog = this.onChangeLog.bind(this)
        this.onSubmitLog = this.onSubmitLog.bind(this)
        this.onChangeReg = this.onChangeReg.bind(this)
        this.onSubmitReg = this.onSubmitReg.bind(this)
        this.onChangeForm = this.onChangeForm.bind(this)
    }

    onChangeForm (e) {
        this.setState({ have_acc: !this.state.have_acc });
    }

    onChangeReg (e) {
        this.setState({ [e.target.name]: e.target.value })
    }

    onSubmitReg (e) {
        e.preventDefault()

        const newUser = {
            first_name: this.state.first_name,
            last_name: this.state.last_name,
            email: this.state.email,
            password: this.state.password
        }

        register(newUser).then(res => {
            this.setState({
                have_acc: true
            })
        })
    }

    onChangeLog (e) {
        this.setState({ [e.target.name]: e.target.value })
    }

    onSubmitLog (e) {
        e.preventDefault()

        const user = {
            email: this.state.email,
            password: this.state.password
        }

        login(user).then(res => {
            if (!res.error) {
                this.setState({
                    auth: true
                })
            }
        })

        setTimeout(() => {
            this.setState(state => ({ isModalOpen: !state.isModalOpen }));
        }, 1000)
        
        this.setState(state => ({ isModalOpen: !state.isModalOpen }));
    }

    //modal window open?
    state = {
        isModalOpen: false
    };

    //change statement for modal open
    toggleModal = () => {
        let name_project_input = document.querySelector('div.project_name');
        let profile_email_input = document.querySelector('div.profile_email');
        if(name_project_input.innerText == "empty" || profile_email_input.innerText == "empty")
            this.setState(state => ({ isModalOpen: !state.isModalOpen }));
        else {
            this.props.history.push(`/profile`);
        }
    };

    componentWillMount() {
        if(localStorage.usertoken) {
            this.setState({
                auth: true
            })
        } else {
            this.setState({
                auth: false
            })
        }
    }

    componentDidMount () {
        var btn_save = document.getElementById("btn_save");
        btn_save.setAttribute("onclick", "update_btn()");

        //add email
        if(localStorage.usertoken){
            const token = localStorage.usertoken
            const decoded = jwt_decode(token)
            this.setState({
                email: decoded.identity.email,
            })
        }

        //скрытое поле с данными загрузочного проекта
        const textarea_hidden = document.createElement("textarea");
        textarea_hidden.setAttribute("style", "display: none;");
        textarea_hidden.setAttribute("id", "textarea_hidden");
        document.body.appendChild(textarea_hidden);

        if(this.props.match.params.id != null) {
            //test
            axios
            .post("../getproject", {
                'project_name': this.props.match.params.id
            })
            .then(response => {
                let list = response.data['array_rects']
                textarea_hidden.innerText = JSON.stringify(list);
            })
        }

        //<add script>
        const script = document.createElement("script");
        script.setAttribute("id", "LogicScript");
    
        if(this.props.match.params.id)
            script.src = "../../LogicScript.js";
        else
            script.src = "../LogicScript.js";

        script.async = true;
    
        document.body.appendChild(script);
        //</add script>
    }

    componentWillUnmount() {
        const script = document.getElementById("LogicScript");
        document.body.removeChild(script);

        const textarea_hidden = document.getElementById("textarea_hidden");
        document.body.removeChild(textarea_hidden);
    }

    render () {

    const register_user = (
            <>
                <div className="modal-dialog" className="modal_div" role="document">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" style={{ color: "black" }}>Регистрация</h5>
                        </div>
                        <div class="modal-body">
                        <form noValidate onSubmit={this.onSubmitReg}>
                            <div className="form-group">
                                <label htmlFor="first_name" className="modal_label_suptitle">Имя</label>
                                <input type="text"
                                    className="form-control"
                                    name="first_name"
                                    placeholder="Введите имя"
                                    value={this.state.first_name}
                                    onChange={this.onChangeReg} />
                            </div>
                            <div className="form-group">
                                <label htmlFor="last_name" className="modal_label_suptitle">Фамилия</label>
                                <input type="text"
                                    className="form-control"
                                    name="last_name"
                                    placeholder="Введите фамилию"
                                    value={this.state.last_name}
                                    onChange={this.onChangeReg} />
                            </div>
                            <div className="form-group">
                                <label htmlFor="email" className="modal_label_suptitle">Адрес Email</label>
                                <input type="email"
                                    className="form-control"
                                    name="email"
                                    placeholder="Введите Email"
                                    value={this.state.email}
                                    onChange={this.onChangeReg} />
                            </div>
                            <div className="form-group">
                                <label htmlFor="password" className="modal_label_suptitle">Пароль</label>
                                <input type="password"
                                    className="form-control"
                                    name="password"
                                    placeholder="Введите пароль"
                                    value={this.state.password}
                                    onChange={this.onChangeReg} />
                            </div>
                            <button type="submit" className="btn btn-lg btn-primary">
                                Продолжить
                            </button>
                        </form>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-link" onClick={this.onChangeForm}>Войти</button>
                        </div>
                    </div>
            </div>
            </>
    )

    const login_user = (
        <>
            <div className="modal-dialog" className="modal_div" role="document">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" style={{ color: "black" }}>Вход</h5>
                        </div>
                        <div class="modal-body">
                        <form noValidate onSubmit={this.onSubmitLog}>
                                <div className="form-group">
                                    <label htmlFor="email" className="modal_label_suptitle">Адрес Email</label>
                                    <input type="email"
                                        className="form-control"
                                        name="email"
                                        placeholder="Введите Email"
                                        value={this.state.email}
                                        onChange={this.onChangeLog} />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="password" className="modal_label_suptitle">Пароль</label>
                                    <input type="password"
                                        className="form-control"
                                        name="password"
                                        placeholder="Введите пароль"
                                        value={this.state.password}
                                        onChange={this.onChangeLog} />
                                </div>
                                <button type="submit" className="btn btn-lg btn-primary">
                                    Продолжить
                                </button>
                        </form>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-link" onClick={this.onChangeForm}>Зарегистрироваться</button>
                        </div>
                    </div>
            </div>
        </>
    )

    const Continue = (
        <>
                <div class="modal-dialog" className="modal_div_continue" role="document">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" style={{ color: "black" }}>Введите название проекта</h5>
                        </div>
                        <div class="modal-body">
                            <input id="project_name" type="text" className="form-control"/>
                            <div id="error_text" className="default_not_error">Проект с таким названием уже существует!</div>
                        </div>
                        <div class="modal-footer">
                            <button id="btn_continue" type="button" class="btn btn-primary">Продолжить</button>
                        </div>
                    </div>
                </div>
        </>
    )

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
            {/* button for modal window */}
            <button onClick={this.toggleModal} className="save_btn" id="btn_save">Сохранить</button>
            {/* render modal window */}
            {this.state.isModalOpen &&
                <Modal onClose={this.toggleModal}>
                    {this.state.auth ? Continue : this.state.have_acc ? login_user : register_user}
                </Modal>
            }
            <Link to="/profile">
                <div className="short_info">
                    <div className="info_text">Profile:</div>
                    <div className="profile_email">
                        {this.state.email ? this.state.email : 'empty'}
                    </div>
                    <div className="info_text">Project:</div>
                    <div className="project_name">
                        {this.props.match.params.id ? this.props.match.params.id : 'empty'}
                    </div>
                </div>
            </Link>
            <ChangeLang/>
        </header>

        <section className="main">
            <div id="added_elems" className="added_elems">
                <div className="added_elems_text">
                    <div>Добавленные элементы</div>
                    <img className="clear_btn" src={recycle_bin} alt="Clear container"
                        id="clearContainer" />
                    <div style={{display: "flex", position: "relative"}}>
                        <input type="text" name="searchItem" placeholder="Поиск..." id="searchItem"/>
                        <img src={search} alt="Поиск" className="img_search" />
                    </div>
                </div>
                <div id="added_elems_container" className="added_elems_container"></div>
            </div>
            <label id="itemName" className="item_name"></label>
            <canvas id="canvas" width="800" height="800">Ваш браузер не поддерживает canvas</canvas>
            <div className="change_room_size">
                <label className="label_wh">Размеры комнаты</label>
                <input type="text" name="" placeholder="5000" className="input_wh" id="input_room_w" />
                <label className="label_wh">мм X </label>
                <input type="text" name="" placeholder="2500" className="input_wh" id="input_room_h" />
                <label className="label_wh">мм</label>
            </div>
            <div className="changes">
                <div className="change_camera">
                    <div className="camera_up">
                        <div className="line_45deg line_45deg_up"></div>
                        <div className="line_45deg line_45deg_down"></div>
                    </div>
                    <div className="camera_down">
                        <div className="line_45deg line_45deg_up"></div>
                        <div className="line_45deg line_45deg_down"></div>
                    </div>
                    <div className="camera_left">
                        <div className="line_45deg line_45deg_up"></div>
                        <div className="line_45deg line_45deg_down"></div>
                    </div>
                    <div className="camera_right">
                        <div className="line_45deg line_45deg_up"></div>
                        <div className="line_45deg line_45deg_down"></div>
                    </div>
                </div>
                <div className="change_scale">
                    <div className="plus_scale">
                        <div className="horiz_line horiz_line_plus_scale"></div>
                        <div className="vert_line vert_line_plus_scale"></div>
                    </div>
                    <div className="horiz_line horiz_line_del"></div>
                    <div className="minus_scale">
                        <div className="horiz_line horiz_line_minus_scale"></div>
                    </div>
                </div>
            </div>
            <div className="elems_for_add">
                <div className="added_elems_text">Элементы для добавления</div>
                <div className="furniture_items_container">
                    <FurnitureItem src={bed} number={1}/>
                    <FurnitureItem src={table} number={2}/>
                    <FurnitureItem src={flower} number={3}/>
                    <FurnitureItem src={sofa} number={4}/>
                    <FurnitureItem src={chair} number={5}/>
                    <FurnitureItem src={kreslo} number={6}/>
                    <FurnitureItem src={plita} number={7}/>
                    <FurnitureItem src={rakovina} number={8}/>
                    <FurnitureItem src={toilet} number={9}/>
                    <FurnitureItem src={tumb} number={10}/>
                    <FurnitureItem src={watch} number={11}/>
                </div>
            </div>
        </section>
    </>
    )
    }
}

export default PlannerPage;