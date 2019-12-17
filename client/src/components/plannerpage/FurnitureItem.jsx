import React, { Component } from 'react';

class FurnitureItem extends Component {

    componentDidMount () {
        var count = 1;
        var furnitureItemsContainer = document.querySelector('div.furniture_items_container');
        var node = furnitureItemsContainer.firstChild;
        while(count !== 6) {
            if(count == this.props.number) {
                node.querySelector('div.circle_add').setAttribute("onclick", "add('" + this.props.src + "', 0, 0, 1000, 1000, 0)");
            }

            node = node.nextSibling;
            count++;
        }
    }

    render () {
        return (
            <div className="furniture_item">
                <img src={this.props.src} alt="furniture item" className="img_fur_item"/>
                <div className="circle_add">
                    <div className="horiz_line"></div>
                    <div className="vert_line"></div>
                </div>
            </div>
        )
    }
}

export default FurnitureItem;
