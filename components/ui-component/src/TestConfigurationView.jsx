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
import RequestBuilder from './utils/RequestBuilder';
import {withRouter} from 'react-router-dom'
import { Grid, Row, Col, Button} from 'react-bootstrap';
import {updateSpecification,addSpecificationToTestValues,clearTestPlan} from "./actions";
import AppBreadcrumbs from "./partials/AppBreadcrumbs";
import {connect} from 'react-redux'
import TestPlanReduxHelper from './utils/TestPlanReduxHelper'
import axios from 'axios';
import {Specification, SpecificationEditor} from "./components/TestPlanComponents";

const client = new RequestBuilder();

class TestConfigurationView extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            selectedSpec: null
        };
        this.selectSpec = this.selectSpec.bind(this);
        this.isCompleted = this.isCompleted.bind(this);
        this.buildTestPlan = this.buildTestPlan.bind(this);
    }

    componentDidMount() {
        if (this.props.specifications.selected.length !== 0) {
            this.props.dispatch(clearTestPlan());
            axios.all(this.props.specifications.selected.map(key => client.getSingleSpecification(key))).then(
                axios.spread((...specs) => {
                    specs.forEach((spec) => {
                        this.props.dispatch(updateSpecification(spec.data.name,spec.data));
                        this.props.dispatch(addSpecificationToTestValues(spec.data));
                    });
                })).finally(() => {
                this.setState({
                    loading: false,
                    selectedSpec: this.props.specifications.selected[0]
                });
            });
        } else {
            this.props.history.push("/tests/new");
        }
    }

    renderEditor() {
        return <SpecificationEditor
            spec={TestPlanReduxHelper.getSpecFromState(this.props.specifications, this.state.selectedSpec)}/>;
    }

    renderSpecs() {
        return TestPlanReduxHelper.getSelectedSpecsFromState(this.props.specifications,this.props.specifications.selected).map(spec => {
            return (
                <Specification key={spec.name} spec={spec} selectElement={this.selectSpec}/>
            );
        });
    }

    selectSpec(key) {
        this.setState({
            selectedSpec: key
        })
    }

    isCompleted() {
        //return TestPlanReduxHelper.isTestPlanFilled(this.props.testvalues);
    }

    buildTestPlan(){
        console.log(TestPlanReduxHelper.buildTestPlanFromTestValues(this.props.testvalues));
    }

    renderMain() {
        return (
            <div>
                <br/>
                <Grid>
                    <Row>
                        <Col md={4}>
                            {this.renderSpecs()}
                        </Col>
                        <Col md={8}>
                            {this.state.selectedSpec ? this.renderEditor() : null}
                        </Col>
                    </Row>
                    <div className={"text-center"}>
                        <Button bsStyle={"primary"}
                                bsSize={"lg"}
                                disabled={this.isCompleted()}
                                onClick={this.buildTestPlan}
                        >Continue</Button>
                    </div>
                </Grid>
            </div>
        );
    }

    render() {
        return (
            <div>
                <AppHeader/>
                <AppBreadcrumbs/>
                <div className={"container"}>
                    {this.state.loading ? <h1>Loading</h1> : this.renderMain()}
                </div>
            </div>
        );
    }
}

export default withRouter(connect((state) => ({
    specifications: state.specifications,
    testvalues: state.testvalues
}))(TestConfigurationView));