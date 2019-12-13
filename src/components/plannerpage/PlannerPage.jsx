//components
import React, { Component } from 'react';
import ChangeLang from '../general/ChangeLang';
import FurnitureItem from './FurnitureItem';

//css
import '../../css/PlannerPageStyle.css';

//images
import recycle_bin from '../../images/PlannerPage/recycle_bin.png';
import search from '../../images/PlannerPage/search.png';

class PlannerPage extends Component {
render () {
return (
<>
    <header id="header">
        <div className="logo_text_around">
            <div id="logo" className="logo_text">
                Apartment Planner
            </div>
        </div>
        <button id="save_btn" className="save_btn">Сохранить</button>
        <ChangeLang/>
    </header>

    <section className="main">
        <div id="added_elems" className="added_elems">
            <div className="added_elems_text">
                <div>Добавленные элементы</div>
                <img className="clear_btn" src={recycle_bin} alt="Clear container"
                    onclick="clearContainer()" />
                <div style={{display: "flex", position: "relative"}}>
                    <input type="text" name="searchItem" value="" placeholder="Поиск..." id="searchItem"
                        oninput="searchItem()" />
                    <img src={search} alt="Поиск" className="img_search" />
                </div>
            </div>
            <div id="added_elems_container" className="added_elems_container"></div>
        </div>
        <label id="itemName" className="item_name"></label>
        <canvas id="canvas" width="800" height="800">Ваш браузер не поддерживает canvas</canvas>
        <div className="change_room_size">
            <label className="label_wh">Размеры комнаты</label>
            <input type="text" name="" value="5000" className="input_wh" id="input_room_w" oninput="inputRoomW()" />
            <label className="label_wh">мм X </label>
            <input type="text" name="" value="2500" className="input_wh" id="input_room_h" oninput="inputRoomH()" />
            <label className="label_wh">мм</label>
        </div>
        <div className="changes">
            <div className="change_camera">
                <div className="camera_up" onclick="camera.move(0, -100);">
                    <div className="line_45deg line_45deg_up"></div>
                    <div className="line_45deg line_45deg_down"></div>
                </div>
                <div className="camera_down" onclick="camera.move(0, 100);">
                    <div className="line_45deg line_45deg_up"></div>
                    <div className="line_45deg line_45deg_down"></div>
                </div>
                <div className="camera_left" onclick="camera.move(-100, 0);">
                    <div className="line_45deg line_45deg_up"></div>
                    <div className="line_45deg line_45deg_down"></div>
                </div>
                <div className="camera_right" onclick="camera.move(100, 0);">
                    <div className="line_45deg line_45deg_up"></div>
                    <div className="line_45deg line_45deg_down"></div>
                </div>
            </div>
            <div className="change_scale">
                <div className="plus_scale" onclick="zoomPlusMinus('plus')">
                    <div className="horiz_line horiz_line_plus_scale"></div>
                    <div className="vert_line vert_line_plus_scale"></div>
                </div>
                <div className="horiz_line horiz_line_del"></div>
                <div className="minus_scale" onclick="zoomPlusMinus('minus')">
                    <div className="horiz_line horiz_line_minus_scale"></div>
                </div>
            </div>
        </div>
        <div className="elems_for_add">
            <div className="added_elems_text">Элементы для добавления</div>
            <div className="furniture_items_container">
                <FurnitureItem/>
            </div>
        </div>
    </section>
</>
)
}
}

export default PlannerPage;