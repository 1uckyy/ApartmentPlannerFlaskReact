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
import remove from '../../images/PlannerPage/remove.png';

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
        script.innerHTML = `var canvas = document.getElementById("canvas");
        canvas.addEventListener('wheel', zoom);
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
        var canvasWidth = canvas.width;
        var canvasHeight = canvas.height;
        
        var context = canvas.getContext("2d");
        
        context.strokeStyle = '#001EFF';
        
        var Header = document.getElementById("header");
        var addedElems = document.getElementById("added_elems");
        var addedElemsContainer = document.getElementById("added_elems_container");
        
        //двигаем или изменяем размеры?
        var moveItem;
        
        var mouse = {
            x: 0,
            y: 0,
            onItemX: 0, //координата x над захваченным объектом
            onItemY: 0 //координата y над захваченным объектом
        };
        
        var camera = {
            x: 0,
            y: 0,
        
            move: function (x, y) {
                this.x += x;
                this.y += y;
            }
        }
        
        //мышка зажата над объектом
        var selected = false;
        //вспом. перем. для изменения размеров
        var changeSizeXLeft = false;
        var changeSizeXRight = false;
        var changeSizeYTop = false;
        var changeSizeYBottom = false;
        
        var Rect = function (img, x, y, w, h, angle) {
            this.x = x;
            this.y = y;
            this.w = w;
            this.h = h;
            this.img = img;
            this.angle = angle;
        }
        
        Rect.prototype = {
            returnX: function () {
                return this.x;
            },
        
            returnY: function () {
                return this.y;
            },
        
            returnW: function () {
                return this.w;
            },
        
            returnH: function () {
                return this.h;
            },
        
            getCenterX() {
                return this.x + this.w / 2;
            },
        
            getCenterY() {
                return this.y + this.h / 2;
            },
        
            getAngleInRadian() {
                return this.angle * Math.PI / 180;
            },
        
            getXWithRotate() {
                return this.x * Math.cos(this.getAngleInRadian()) - this.y * Math.sin(this.getAngleInRadian()) /*перенос*/
                    - this.getCenterX() * (Math.cos(this.getAngleInRadian()) - 1) + this.getCenterY() * Math.sin(this.getAngleInRadian());
            },
        
            getYWithRotate() {
                return this.x * Math.sin(this.getAngleInRadian()) + this.y * Math.cos(this.getAngleInRadian()) /*перенос*/
                    - this.getCenterY() * (Math.cos(this.getAngleInRadian()) - 1) - this.getCenterX() * Math.sin(this.getAngleInRadian());
            },
        
            contextSet: function () {
                context.translate(this.getCenterX() - camera.x, this.getCenterY() - camera.y);
                context.rotate(this.getAngleInRadian());
            },
        
            contextUnset: function () {
                context.rotate(-this.angle * Math.PI / 180);
                context.translate(-this.getCenterX() + camera.x, -this.getCenterY() + camera.y);
            },
        
            draw: function () {
                let srcimg = new Image();
                srcimg.src = this.img;
                context.drawImage(srcimg, -this.w / 2, -this.h / 2, this.w, this.h);
            },
        
            stroke: function () {
                context.strokeRect(-this.w / 2, -this.h / 2, this.w, this.h);
            }
        }
        
        var i, rects = [], count = 0, strokeRect = false, namesArray = [];
        
        //название проекта
        var project_name_name = document.querySelector("div.project_name").innerText;
        
        function add(imgSrc, x, y, w, h, angle) {
            rects.push(new Rect(imgSrc, x, y, w, h, angle));
        
            let item = document.createElement("div");
            item.setAttribute("class", "added_elem");
            item.setAttribute("id", "item" + count);
        
            let test = count;
            item.onmouseover = () => { strokeRect = rects[test]; }
            item.onmouseout = () => { strokeRect = false }
        
            let deleteItem = document.createElement("img");
            deleteItem.setAttribute("src", "`+remove+`");
            deleteItem.setAttribute("class", "delete_item_img");
            deleteItem.setAttribute("onclick", "deleteItem(" + count + ")");
        
            let img = document.createElement("img");
            img.setAttribute("src", imgSrc);
            img.setAttribute("class", "img_added_elem");
        
            let burger_params = document.createElement("div");
            burger_params.setAttribute("class", "burger_params");
            burger_params.setAttribute("onclick", "addParams(" + count + ")");
            let burger_params_line = document.createElement("div");
            burger_params_line.setAttribute("class", "burger_params_line");
            burger_params.appendChild(burger_params_line);
        
            count++;
            let textField = document.createElement("input");
            textField.setAttribute("class", "textfield_added_elem");
            calculationItemName(textField);
        
            item.appendChild(deleteItem);
            item.appendChild(img);
            item.appendChild(textField);
            item.appendChild(burger_params);
            addedElemsContainer.appendChild(item);
        }
        
        //вычисление названия item'a
        function calculationItemName(textField) {
            if (namesArray.length == 0) {
                namesArray.push(1);
                textField.setAttribute("value", "Item " + 1);
            } else if (namesArray.length == 1) {
                if (namesArray[0] > 1) {
                    textField.setAttribute("value", "Item " + 1);
                    namesArray.push(1);
                } else {
                    textField.setAttribute("value", "Item " + 2);
                    namesArray.push(2);
                }
            } else {
                namesArray.sort();
                if (namesArray[0] > 1) {
                    textField.setAttribute("value", "Item " + 1);
                    namesArray.push(1);
                } else {
                    let detected = false;
                    for (var i = 0; i < namesArray.length; i++) {
                        if ((namesArray[i + 1] - namesArray[i]) > 1 && namesArray[i + 1] != namesArray[i]) {
                            textField.setAttribute("value", "Item " + (namesArray[i] + 1));
                            namesArray.push(namesArray[i] + 1);
                            detected = true;
                            break;
                        }
                    }
                    if (detected == false) {
                        textField.setAttribute("value", "Item " + (namesArray[namesArray.length - 1] + 1));
                        namesArray.push((namesArray[namesArray.length - 1] + 1));
                    }
                }
            }
        }
        
        function deleteItem(id) {
            let deleteItemDiv = document.getElementById("item" + id);
        
            //удаление названия элемента из массива названий
            let itemName = deleteItemDiv.querySelector("input.textfield_added_elem").value;
            let itemNameArr = itemName.split(" ");
            let indexNameItem = namesArray.indexOf(parseInt(itemNameArr[1]));
            if (itemNameArr[0] == "Item") {
                namesArray.splice(indexNameItem, 1);
            }
        
            rects.splice(id, 1);
            addedElemsContainer.removeChild(deleteItemDiv);
        
            var index = 0;
            //переопределение id
            let node = addedElemsContainer.firstChild;
            if (node !== null) {
                redefinitionId(node, index);
                while ((node = node.nextSibling) !== null) {
                    index++;
                    redefinitionId(node, index);
                }
                count = ++index;
            } else {
                strokeRect = false;
                clearContainer();
            }
        }
        
        //поиск объекта
        function searchItem() {
            let searchValue = document.getElementById("searchItem").value;
            let reg = new RegExp("^" + searchValue);
            let item = addedElemsContainer.firstChild;
            if (item != null) {
                do {
                    if (reg.test(item.querySelector("input.textfield_added_elem").value))
                        item.setAttribute("class", "added_elem");
                    else
                        item.setAttribute("class", "added_elem hidden");
                } while ((item = item.nextSibling) != null)
            }
        }
        
        //переопределение id
        function redefinitionId(node, index) {
            node.setAttribute("id", "item" + index);
            node.onmouseover = () => { strokeRect = rects[index]; }
        
            node.firstChild.setAttribute("onclick", "deleteItem(" + index + ")");
            node.lastChild.setAttribute("onclick", "addParams(" + index + ")");
        }
        
        function addParams(id) {
            var item = document.getElementById("item" + id);
        
            if (item.querySelector("div.params_box")) {
                let findParamsBox = item.lastChild;
                item.removeChild(findParamsBox);
                findParamsBox = item.lastChild;
                item.removeChild(findParamsBox);
        
                let burgerParams = item.querySelector("div.burger_to_x");
                burgerParams.removeAttribute("class");
                burgerParams.setAttribute("class", "burger_params_line");
            } else {
                let paramsBox = document.createElement("div");
                paramsBox.setAttribute("class", "params_box");
                paramsBox.setAttribute("style", "width: 100%; height: 80px; display: flex; flex-direction: row-reverse;");
        
                //поля с коориднатами
                let XYBox = document.createElement("div");
                XYBox.setAttribute("class", "XYBox");
        
                let labelAndInputX = document.createElement("div");
                let labelX = document.createElement("label");
                labelX.innerText = "Коорд. X: ";
                let textFieldX = document.createElement("input");
                textFieldX.setAttribute("class", "text_field_params_box");
                textFieldX.setAttribute("value", rects[id].x);
                textFieldX.setAttribute("id", "inputx" + id);
                textFieldX.setAttribute("oninput", "inputX(" + id + ")");
                labelAndInputX.appendChild(labelX);
                labelAndInputX.appendChild(textFieldX);
        
                let labelAndInputY = document.createElement("div");
                let labelY = document.createElement("label");
                labelY.innerText = "Коорд. Y: ";
                let textFieldY = document.createElement("input");
                textFieldY.setAttribute("class", "text_field_params_box");
                textFieldY.setAttribute("value", rects[id].y);
                textFieldY.setAttribute("id", "inputy" + id);
                textFieldY.setAttribute("oninput", "inputY(" + id + ")");
                labelAndInputY.appendChild(labelY);
                labelAndInputY.appendChild(textFieldY);
        
                XYBox.appendChild(labelAndInputX);
                XYBox.appendChild(labelAndInputY);
        
                //поля с шириной и высотой
                let WHBox = document.createElement("div");
                WHBox.setAttribute("class", "XYBox");
        
                let labelAndInputW = document.createElement("div");
                let labelW = document.createElement("label");
                labelW.innerText = "Ширина (мм): ";
                let textFieldW = document.createElement("input");
                textFieldW.setAttribute("class", "text_field_params_box");
                textFieldW.setAttribute("value", rects[id].w);
                textFieldW.setAttribute("id", "inputw" + id);
                textFieldW.setAttribute("oninput", "inputW(" + id + ")");
                labelAndInputW.appendChild(labelW);
                labelAndInputW.appendChild(textFieldW);
        
                let labelAndInputH = document.createElement("div");
                let labelH = document.createElement("label");
                labelH.innerText = "Длина (мм): ";
                let textFieldH = document.createElement("input");
                textFieldH.setAttribute("class", "text_field_params_box");
                textFieldH.setAttribute("value", rects[id].h);
                textFieldH.setAttribute("id", "inputh" + id);
                textFieldH.setAttribute("oninput", "inputH(" + id + ")");
                labelAndInputH.appendChild(labelH);
                labelAndInputH.appendChild(textFieldH);
        
                WHBox.appendChild(labelAndInputW);
                WHBox.appendChild(labelAndInputH);
        
                paramsBox.appendChild(WHBox);
                paramsBox.appendChild(XYBox);
                item.appendChild(paramsBox);
        
                let sliderBox = document.createElement("div");
                sliderBox.setAttribute("class", "slider_box");
                let sliderLabel = document.createElement("label");
                sliderLabel.innerText = "Угол поворота: ";
                let sliderDiv = document.createElement("div");
                sliderDiv.setAttribute("style", "display: flex; align-items: center;");
                let minValue = document.createElement("label");
                minValue.innerText = 0;
                let slider = document.createElement("input");
                slider.setAttribute("type", "range");
                slider.setAttribute("min", "0");
                slider.setAttribute("max", "360");
                slider.setAttribute("step", "1");
                slider.setAttribute("id", "slider" + id);
                slider.setAttribute("value", rects[id].angle);
                slider.setAttribute("oninput", "rotate(" + id + ")");
                let maxValue = document.createElement("label");
                maxValue.innerText = 360;
                let sliderValue = document.createElement("input");
                sliderValue.setAttribute("id", "sliderValue" + id);
                sliderValue.setAttribute("class", "slider_value");
                sliderValue.setAttribute("oninput", "rotateValue(" + id + ")");
                sliderValue.value = rects[id].angle;
        
                sliderDiv.appendChild(minValue);
                sliderDiv.appendChild(slider);
                sliderDiv.appendChild(maxValue);
        
                sliderBox.appendChild(sliderLabel);
                sliderBox.appendChild(sliderDiv);
                sliderBox.appendChild(sliderValue);
                item.appendChild(sliderBox);
        
        
                let burgerParams = item.querySelector("div.burger_params_line");
                burgerParams.removeAttribute("class");
                burgerParams.setAttribute("class", "burger_to_x");
            }
        }
        
        //ввод x
        function inputX(id) {
            let textFieldX = document.getElementById("inputx" + id);
            rects[id].x = parseInt(textFieldX.value);
        }
        
        //ввод y
        function inputY(id) {
            let textFieldY = document.getElementById("inputy" + id);
            rects[id].y = parseInt(textFieldY.value);
        }
        
        //ввод w
        function inputW(id) {
            let textFieldW = document.getElementById("inputw" + id);
            rects[id].w = parseInt(textFieldW.value);
        }
        
        //ввод h
        function inputH(id) {
            let textFieldH = document.getElementById("inputh" + id);
            rects[id].h = parseInt(textFieldH.value);
        }
        
        //ползунок поворота
        function rotate(id) {
            let slider = document.getElementById("slider" + id);
            let sliderValue = document.getElementById("sliderValue" + id);
            rects[id].angle = parseInt(slider.value);
            sliderValue.value = slider.value;
        }
        
        //поле для ввода угла поворота
        function rotateValue(id) {
            let slider = document.getElementById("slider" + id);
            let sliderValue = document.getElementById("sliderValue" + id);
            rects[id].angle = parseInt(sliderValue.value);
            slider.value = sliderValue.value;
        }
        
        function clearContainer() {
            rects.splice(0);
            namesArray.splice(0);
            while (addedElemsContainer.firstChild != null) {
                let elem = addedElemsContainer.firstChild;
                addedElemsContainer.removeChild(elem);
            }
            count = 0;
        }
        
        var isCursorInRect = (rect) => {
            //let rectRight = rect.x + rect.w;
            //let rectBottom = rect.y + rect.h;
        
            let rectRight = rect.getXWithRotate() * (-1) - rect.getCenterX() * (-2);
            let rectBottom = rect.getYWithRotate() * (-1) - rect.getCenterY() * (-2);
        
            //находим коэффициент b в уравнении у = kх + b
            let b = rect.getYWithRotate() - Math.tan(rect.angle * Math.PI / 180) * rect.getXWithRotate();
            let b_opposite = rectBottom - Math.tan(rect.angle * Math.PI / 180) * rectRight;
        
            //находим коэффициент b в уравнении у = kх + b
            let bOtherAngle = rect.getXWithRotate() + Math.tan(rect.angle * Math.PI / 180) * rect.getYWithRotate();
            let b_oppositeOtherAngle = rectRight + Math.tan(rect.angle * Math.PI / 180) * rectBottom;
        
            let selectedByCursor = false;
        
            if (rect.angle <= 90 || rect.angle > 270) {
                if ((mouse.y > (Math.tan(rect.angle * Math.PI / 180) * mouse.x + b)) && (mouse.y < (Math.tan(rect.angle * Math.PI / 180) * mouse.x + b_opposite)) && (mouse.x > - (Math.tan(rect.angle * Math.PI / 180) * mouse.y - bOtherAngle)) && (mouse.x < - (Math.tan(rect.angle * Math.PI / 180) * mouse.y - b_oppositeOtherAngle))) {
                    canvas.style.cursor = "move";
                    selectedByCursor = true;
                }
            } else {
                if ((mouse.y < (Math.tan(rect.angle * Math.PI / 180) * mouse.x + b)) && (mouse.y > (Math.tan(rect.angle * Math.PI / 180) * mouse.x + b_opposite)) && (mouse.x < - (Math.tan(rect.angle * Math.PI / 180) * mouse.y - bOtherAngle)) && (mouse.x > - (Math.tan(rect.angle * Math.PI / 180) * mouse.y - b_oppositeOtherAngle))) {
                    canvas.style.cursor = "move";
                    selectedByCursor = true;
                }
            }
        
            if (rect.angle == 0) {
                //курсор resize
                if (mouse.x - rect.x < 20 && mouse.y - rect.y > 20 && (rectBottom - mouse.y) > 20 && mouse.x - rect.x > 0)
                    canvas.style.cursor = "w-resize";
                if (mouse.y - rect.y < 20 && mouse.x - rect.x < 20 && mouse.x - rect.x > 0 && mouse.y - rect.y > 0)
                    canvas.style.cursor = "nw-resize";
                if (mouse.y - rect.y < 20 && mouse.x - rect.x > 20 && (rectRight - mouse.x) > 20 && mouse.y - rect.y > 0)
                    canvas.style.cursor = "n-resize";
                if (mouse.y - rect.y < 20 && rectRight - mouse.x < 20 && rectRight - mouse.x > 0 && mouse.y - rect.y > 0)
                    canvas.style.cursor = "ne-resize";
                if (rectRight - mouse.x < 20 && mouse.y - rect.y > 20 && (rectBottom - mouse.y) > 20 && rectRight - mouse.x > 0)
                    canvas.style.cursor = "e-resize";
                if (rectBottom - mouse.y < 20 && rectRight - mouse.x < 20 && rectRight - mouse.x > 0 && rectBottom - mouse.y > 0)
                    canvas.style.cursor = "se-resize";
                if (rectBottom - mouse.y < 20 && mouse.x - rect.x > 20 && (rectRight - mouse.x) > 20 && rectBottom - mouse.y > 0)
                    canvas.style.cursor = "s-resize";
                if (rectBottom - mouse.y < 20 && mouse.x - rect.x < 20 && mouse.x - rect.x > 0 && rectBottom - mouse.y > 0)
                    canvas.style.cursor = "sw-resize";
            }
        
            return selectedByCursor;
        }
        
        //перенос начала системы координат в центр canvasa'а
        context.translate(canvas.offsetWidth / 2, canvas.offsetHeight / 2);
        //изначальные размеры комнаты
        var wallWidth = 5000, wallHeight = 2500;
        
        //ввод ширины
        function inputRoomW() {
            let inputW = document.getElementById("input_room_w");
            wallWidth = inputW.value;
        }
        
        function inputRoomH() {
            let inputH = document.getElementById("input_room_h");
            wallHeight = inputH.value;
        }
        
        //комната
        function drawRoom() {
            context.strokeStyle = '#929292';
            context.lineWidth = 100;
            context.fillStyle = '#CAE0E4';
            context.strokeRect(-wallWidth / 2 - camera.x, -wallHeight / 2 - camera.y, wallWidth, wallHeight);
            context.fillRect(-wallWidth / 2 - camera.x, -wallHeight / 2 - camera.y, wallWidth, wallHeight);
            context.stroke();
        }
        
        //коэффициент увеличения масштаба
        context.scale(0.2, 0.2);
        var scale = 0.2;
        
        //ф-я изменения масштаба
        function zoom(event) {
            if (event.deltaY == -100) {
                context.scale(1.1, 1.1);
                scale *= 1.1;
            }
            if (event.deltaY == 100) {
                context.scale(0.9, 0.9);
                scale *= 0.9;
            }
        }
        
        function zoomPlusMinus(value) {
            if (value == "plus") {
                context.scale(1.1, 1.1);
                scale *= 1.1;
            }
            if (value == "minus") {
                context.scale(0.9, 0.9);
                scale *= 0.9;
            }
        }
        
        setInterval(() => {
            context.clearRect(-10000, -10000, 20000, 20000);
            canvas.style.cursor = "default";
        
            //комната
            drawRoom();
        
            //сброс названия
            let itemName = document.getElementById("itemName");
            if(itemName != null)
                itemName.innerText = "";
        
            for (i in rects) {
                rects[i].contextSet();
        
                rects[i].draw();
        
                let item = document.getElementById("item" + i);
                if(item != null)
                 //сброс фона добавленного элемента
                 item.setAttribute("style", "");
        
                if (isCursorInRect(rects[i])) {
                    context.strokeStyle = '#001EFF';
                    context.lineWidth = 5;
                    //отрисовка синих границ объекта
                    rects[i].stroke();
                    //название объекта
                    itemName.innerText = item.querySelector("input.textfield_added_elem").value;
        
                    //установка фона выбранного добавленного элемента
                    item.setAttribute("style", "background-color: rgb(219, 226, 226);");
                }
        
                rects[i].contextUnset();
            }
        
            //отрисовка синих границ объекта, если навелись на item
            if (strokeRect != false) {
                strokeRect.contextSet();
                context.strokeStyle = '#001EFF';
                context.lineWidth = 5;
                strokeRect.stroke();
                strokeRect.contextUnset();
            }
        
            if ((selected.h < 200 || selected.w < 200) && moveItem == false) {
                //влево
                if (changeSizeXLeft) {
                    if (selected.x > mouse.x) {
                        selected.w += selected.x - mouse.x;
                        selected.x = mouse.x;
                    }
                }
        
                //вправо
                if (changeSizeXRight) {
                    let selectedXRight = selected.x + selected.w;
                    if (selectedXRight < mouse.x)
                        selected.w += mouse.x - selectedXRight;
                }
        
                //наверх
                if (changeSizeYTop) {
                    if (selected.y > mouse.y) {
                        selected.h += selected.y - mouse.y;
                        selected.y = mouse.y;
                    }
                }
        
                //вниз
                if (changeSizeYBottom) {
                    let selectedYBottom = selected.y + selected.h;
                    if (selectedYBottom < mouse.y)
                        selected.h += mouse.y - selectedYBottom;
                }
            }
        
            //не применять если высота или ширина слишком маленькие
            if (selected.h >= 200 && selected.w >= 200 && moveItem == false) {
                //изменение размера объекта
                //влево
                if (changeSizeXLeft) {
                   if (selected.x > mouse.x) {
                       selected.w += selected.x - mouse.x;
                       selected.x = mouse.x;
                   }
                   if (selected.x < mouse.x) {
                       selected.w -= mouse.x - selected.x;
                       selected.x = mouse.x;
                   }
                }
        
                //вправо
                if (changeSizeXRight) {
                   let selectedXRight = selected.x + selected.w;
                   if (selectedXRight > mouse.x)
                       selected.w -= selectedXRight - mouse.x;
                   if (selectedXRight < mouse.x)
                       selected.w += mouse.x - selectedXRight;
                }
        
                let rectRight = selected.getXWithRotate() * (-1) - selected.getCenterX() * (-2);
                let rectBottom = selected.getYWithRotate() * (-1) - selected.getCenterY() * (-2);
        
                //находим коэффициент b в уравнении у = kх + b
                let b = selected.getYWithRotate() - Math.tan(selected.angle * Math.PI / 180) * selected.getXWithRotate();
        
                let bSelected = mouse.y - Math.tan(selected.angle * Math.PI / 180) * mouse.x;
        
                let differenceB = b - bSelected;
        
                //наверх
                if (changeSizeYTop) {
                    selected.h += differenceB;
                    selected.y = mouse.y;
                }
        
                //вниз
                if (changeSizeYBottom) {
                   let selectedYBottom = selected.y + selected.h;
                   if (selectedYBottom > mouse.y)
                       selected.h -= selectedYBottom - mouse.y;
                   if (selectedYBottom < mouse.y)
                       selected.h += mouse.y - selectedYBottom;
                }
            }
        
            //перемещение объекта
            if (selected && (mouse.x - selected.x > 20) && (mouse.y - selected.y > 20) && (((selected.x + selected.w) - mouse.x) > 20) &&
                (((selected.y + selected.h) - mouse.y) > 20) && moveItem == true) {
                if ((mouse.x + selected.w / 2) < wallWidth && (mouse.x - selected.w / 2) > -wallWidth) {
                    selected.x = mouse.x + mouse.onItemX;
                }
                if ((mouse.y + selected.h / 2) < wallHeight && (mouse.y - selected.h / 2) > -wallHeight) {
                    selected.y = mouse.y + mouse.onItemY;
                }
            }
        }, 1);
        
        canvas.onmousemove = function (e) {
            mouse.x = (e.pageX - addedElems.offsetWidth - canvas.offsetWidth / 2) / scale + camera.x;
            mouse.y = (e.pageY - Header.offsetHeight - canvas.offsetHeight / 2) / scale + camera.y;
        
            for (i in rects) {
                //запись координат в поля x и y
                let textFieldX = document.getElementById("inputx" + i);
                let textFieldY = document.getElementById("inputy" + i);
                if (textFieldX != null || textFieldY != null) {
                    textFieldX.value = rects[i].x;
                    textFieldY.value = rects[i].y;
                }
        
                //запись параметров в поля w и h
                let textFieldW = document.getElementById("inputw" + i);
                let textFieldH = document.getElementById("inputh" + i);
                if (textFieldW != null || textFieldH != null) {
                    textFieldW.value = rects[i].w;
                    textFieldH.value = rects[i].h;
                }
            }
        }
        
        canvas.onmouseout = function () {
            selected = false;
        
            changeSizeXLeft = false;
            changeSizeXRight = false;
            changeSizeYTop = false;
            changeSizeYBottom = false;
        }
        
        canvas.onmousedown = function () {
            if (!selected) {
                var i;
                for (i in rects) {
                    if (isCursorInRect(rects[i])) {
                        selected = rects[i];
        
                        //координаты мыши относительно самого объекта
                        mouse.onItemX = selected.returnX() - mouse.x;
                        mouse.onItemY = selected.returnY() - mouse.y;
        
                        //let rectRight = selected.x + selected.w;
                        //let rectBottom = selected.y + selected.h;
                        //if ((mouse.x - selected.x > 20) && (mouse.y - selected.y > 20) && ((rectRight - mouse.x) > 20) &&
                        //    ((rectBottom - mouse.y) > 20))
                        //    moveItem = true;
                        //else
                        //    moveItem = false;
        
                        moveItem = false;
        
        
                        let rectRight = selected.getXWithRotate() * (-1) - selected.getCenterX() * (-2);
                        let rectBottom = selected.getYWithRotate() * (-1) - selected.getCenterY() * (-2);
        
                        //находим коэффициент b в уравнении у = kх + b
                        let b = selected.getYWithRotate() - Math.tan(selected.angle * Math.PI / 180) * selected.getXWithRotate();
                        let b_opposite = rectBottom - Math.tan(selected.angle * Math.PI / 180) * rectRight;
        
                        //находим коэффициент b в уравнении у = kх + b
                        let bOtherAngle = selected.getXWithRotate() + Math.tan(selected.angle * Math.PI / 180) * selected.getYWithRotate();
                        let b_oppositeOtherAngle = rectRight + Math.tan(selected.angle * Math.PI / 180) * rectBottom;
        
                        //let selectedByCursor = false;
        
                        if (selected.angle <= 90 || selected.angle > 270) {
                           if ((mouse.y > (Math.tan(selected.angle * Math.PI / 180) * mouse.x + b)) && (mouse.y < (Math.tan(selected.angle * Math.PI / 180) * mouse.x + b_opposite)) && (mouse.x > - (Math.tan(selected.angle * Math.PI / 180) * mouse.y - bOtherAngle)) && (mouse.x < - (Math.tan(selected.angle * Math.PI / 180) * mouse.y - b_oppositeOtherAngle))) {
                               canvas.style.cursor = "move";
                               moveItem = true;
                           }
                        } else {
                           if ((mouse.y < (Math.tan(selected.angle * Math.PI / 180) * mouse.x + b)) && (mouse.y > (Math.tan(selected.angle * Math.PI / 180) * mouse.x + b_opposite)) && (mouse.x < - (Math.tan(selected.angle * Math.PI / 180) * mouse.y - bOtherAngle)) && (mouse.x > - (Math.tan(selected.angle * Math.PI / 180) * mouse.y - b_oppositeOtherAngle))) {
                               canvas.style.cursor = "move";
                               moveItem = true;
                           }
                        }
        
                        for (var i = 0; i < 20; i++) {
                            if (mouse.y < (Math.tan(selected.angle * Math.PI / 180) * mouse.x + Math.ceil(b) + i)) {
                                changeSizeYTop = true;
                                moveItem = false;
                            }
                        }
        
                        if (mouse.x - selected.x < 20) {
                           changeSizeXLeft = true;
                           moveItem = false;
                        }
                        if ((selected.x + selected.w) - mouse.x < 20) {
                           changeSizeXRight = true;
                           moveItem = false;
                        }
                        if (mouse.y - selected.y < 20) {
                           changeSizeYTop = true;
                           moveItem = false;
                        }
                        if (((selected.y + selected.h) - mouse.y) < 20) {
                           changeSizeYBottom = true;
                           moveItem = false;
                        }
                    }
                }
            }
        }
        
        canvas.onmouseup = function () {
            selected = false;
        
            changeSizeXLeft = false;
            changeSizeXRight = false;
            changeSizeYTop = false;
            changeSizeYBottom = false;
        }
        
        // перемещение камеры
        addEventListener("keydown", moveCamera);
        function moveCamera(e) {
            switch (e.keyCode) {
                case 37:  // если нажата клавиша влево
                    camera.move(-100, 0);
                    break;
                case 38:   // если нажата клавиша вверх
                    camera.move(0, -100);
                    break;
                case 39:   // если нажата клавиша вправо
                    camera.move(100, 0);
                    break;
                case 40:   // если нажата клавиша вниз
                    camera.move(0, 100);
                    break;
            }
        }
        
        //сохранение проекта
        var save_btn = () => {
            let error_text = document.getElementById("error_text");
        
            let name_project_input = document.getElementById("project_name");
        
            let author_project = document.querySelector("div.profile_email");
        
            let json_file = {
                project_author: author_project.innerText,
                project_name: name_project_input.value,
                array_rects: rects,
            }
            
            fetch('save', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify(json_file)
              })
              .then(function (response) {
                return response.json();
            })
            .then(function (result) {
                if(result['result']['message'] == 'Такое название уже существует.') {
                    error_text.setAttribute("class", "default_have_error");
                    setTimeout(() => {error_text.setAttribute("class", "default_not_error");}, 1000);
                } else
                    location.href = "/profile";
            })
            .catch (function (error) {
                console.log('Request failed', error);
            });
        }
        
        //обновление проекта
        var update_btn = () => {
            let name_project_input = document.querySelector('div.project_name');
            if(name_project_input.innerText != "empty") {
                let json_file = {
                    project_name: name_project_input.innerText,
                    array_rects: rects,
                }
        
                let response = fetch('../update', {
                    method: 'PUT',
                    headers: {
                    'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(json_file)
                });
            }
        }
        
        //привязка кнопок
        var clearCntr = document.getElementById("clearContainer");
        clearCntr.setAttribute("onclick", "clearContainer()");
        
        var search = document.getElementById("searchItem");
        search.setAttribute("oninput", "searchItem()");
        
        var input_room_w = document.getElementById("input_room_w");
        input_room_w.setAttribute("oninput", "inputRoomW()");
        
        var input_room_h = document.getElementById("input_room_h");
        input_room_h.setAttribute("oninput", "inputRoomH()");
        
        var camera_up = document.querySelector('div.camera_up');
        camera_up.setAttribute("onclick", "camera.move(0, -100);");
        
        var camera_down = document.querySelector('div.camera_down');
        camera_down.setAttribute("onclick", "camera.move(0, 100);");
        
        var camera_left = document.querySelector('div.camera_left');
        camera_left.setAttribute("onclick", "camera.move(-100, 0);");
        
        var camera_right = document.querySelector('div.camera_right');
        camera_right.setAttribute("onclick", "camera.move(100, 0);");
        
        var plus_scale = document.querySelector('div.plus_scale');
        plus_scale.setAttribute("onclick", "zoomPlusMinus('plus')");
        
        var minus_scale = document.querySelector('div.minus_scale');
        minus_scale.setAttribute("onclick", "zoomPlusMinus('minus')");
        
        
        
        //загрузка проекта из textarea
        setTimeout(() => {
            var textarea_hidden = document.getElementById("textarea_hidden");
            textarea_hidden = document.getElementById("textarea_hidden");
            var list = JSON.parse(textarea_hidden.value);
                for(let a = 0; a < list.length; a++){
                    add(list[a]['img'], list[a]['x'], list[a]['y'], list[a]['w'], list[a]['h'], list[a]['angle'],);
                }
        }, 1000); `;
    
        // if(this.props.match.params.id)
        //     script.src = "../../LogicScript.js";
        // else
        //     script.src = "../LogicScript.js";

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