/*
 * Copyright (c) 2018, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import React from 'react';
import AppHeader from "./partials/AppHeader";
import AppBreadcrumbs from "./partials/AppBreadcrumbs";
import {ListGroup, ListGroupItem, Glyphicon, Button} from 'react-bootstrap';
import {connect} from 'react-redux'
import {addAPI, toggleAPI, clearAPIs} from "./actions";
import {Link} from 'react-router-dom'

class APISelectView extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <AppHeader/>
                <AppBreadcrumbs/>
                <div className={"container"}>
                    {this.renderMain()}
                </div>
            </div>
        )
    }

    renderSpec(api) {
        return (
            <ListGroupItem key={api.name} onClick={() => {this.toggleSpec(api)}} active={this.isSpecSelected(api.name)}>
                <div className="pull-right">
                    <i className={"fas fa-2x fa-" + (this.isSpecSelected(api.name) ? "check-square" : "square")}></i>
                </div>
                <h4>{api.title} {api.version}</h4>
                <p>{api.description}</p>
            </ListGroupItem>);
    }

    isSpecSelected(name){
        return (this.props.apis.selected.includes(name));
    }

    toggleSpec(api) {
        this.props.dispatch(toggleAPI(api.name))
    }

    isEmptySelection() {
        return this.props.apis.selected.length === 0;
    }

    renderMain() {
        return (
            <div>
                <h1>Available Tests</h1>
                <hr/>
                <ListGroup>
                    <ListGroupItem disabled><b>Available APIs</b></ListGroupItem>
                    {Object.values(this.props.apis.specs).map((spec) => {
                        return this.renderSpec(spec)
                    })}
                </ListGroup>
                <div className={"text-center"}>
                    <Link to={"/tests/new/configure"}>
                        <Button bsStyle={"primary"} bsSize={"lg"} disabled={this.isEmptySelection()}>Continue</Button>
                    </Link>
                </div>
            </div>
        );
    }
}

export default connect((state) =>
    ({apis: state.apis}))
(APISelectView);
