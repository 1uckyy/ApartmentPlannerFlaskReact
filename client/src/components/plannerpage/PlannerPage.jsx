import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import jwt_decode from 'jwt-decode';

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

class PlannerPage extends Component {

    constructor() {
        super()
        this.state = {
            email: '',
        }
    }

    //modal window open?
    state = {
        isModalOpen: false
    };

    //change statement for modal open
    toggleModal = () => {
        this.setState(state => ({ isModalOpen: !state.isModalOpen }));
    };

    componentDidMount () {
        //<add script>
        const script = document.createElement("script");
        script.setAttribute("id", "LogicScript");
    
        script.src = "LogicScript.js";
        script.async = true;
    
        document.body.appendChild(script);
        //</add script>

        //add email
        if(localStorage.usertoken){
            const token = localStorage.usertoken
            const decoded = jwt_decode(token)
            this.setState({
                email: decoded.identity.email,
            })
        }
    }

    componentWillUnmount() {
        const script = document.getElementById("LogicScript");
        document.body.removeChild(script);
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
            {/* button for modal window */}
            <button onClick={this.toggleModal} id="save_btn" className="save_btn">Сохранить</button>
            {/* render modal window */}
            {this.state.isModalOpen &&
                <Modal onClose={this.toggleModal}>
                    {/* <div className="modal_div">
                        <label className="modal_label_title">Вход</label>
                        <div>
                            <div className="modal_div_enter">
                                <label className="modal_label_suptitle">Логин</label>
                                <input type="text"/>
                            </div>
                            <div className="modal_div_enter">
                                <label className="modal_label_suptitle" style={{marginRight: "10px"}}>Пароль</label>
                                <input type="password"/>
                            </div>
                        </div>
                        <button id="btn_continue" className="modal_btn_continue">Продолжить</button>
                    </div> */}
                    <div className="modal_div">
                        <label className="modal_label_title">Введите название проекта</label>
                        <input id="project_name" type="text"/>
                        <button id="btn_continue" className="modal_btn_continue">Продолжить</button>
                    </div>
                </Modal>
            }
            <Link to="/profile">
                <div className="profile_email">
                    {this.state.email}
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
                </div>
            </div>
        </section>
    </>
    )
    }
}

export default PlannerPage;