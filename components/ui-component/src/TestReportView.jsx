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
import {ListGroup, ListGroupItem, Button, Modal, Grid, Row, Col, Panel, Badge, ProgressBar} from 'react-bootstrap';
import AppBreadcrumbs from "./partials/AppBreadcrumbs";
import '../public/css/report-style.scss'
import {connect} from 'react-redux'
import RequestBuilder from './utils/RequestBuilder';
import TestReportHelper from './utils/TestReportHelper';
import AttributeGroup from "./components/AttributeGroup";
import LoaderComponent from "./components/LoaderComponent"

const client = new RequestBuilder();
const reportHelper = new TestReportHelper();

const stepStatus = (steps) => {
    var status = true;
    var errorStep;
    var errorDisplayList=[];
    var errorDescription;
    var errorClass;
    var faIconClass;

    steps.forEach(step => {
        status = status && (step.result.status === "passed");
        errorClass=step.result.status;
        errorDescription=step.result.error_message;
        errorStep = (step.keyword +" | " + step.name);
        step.result.status === "passed" ? faIconClass = "pull-right fas fa-check-circle" : faIconClass = "pull-right fas fa-times-circle";

        errorDisplayList.push(
            <ListGroupItem bsStyle="" className = {errorClass}>
                <b>{errorStep.split(" ")[0]}</b> {errorStep.split(' ').slice(1).join(' ')}
                { step.result.status === "skipped"
                    ? <span className="pull-right">skipped</span>
                    : <i className={faIconClass}/>
                }
            </ListGroupItem>
        );

    });
    if(status){
        return (<p className="passedTag status-badge"><i className="fas fa-check-circle"/> Passed</p>) ;
    }else{
        //console.log(errorMessage);
        return (
            <div>
                <p className="failedTag status-badge"><i className="fas fa-times-circle"/> Failed</p>
                <Panel className="error-panel" defaultExpanded={false}>
                    <Panel.Toggle componentClass="a" className="error-details-link">View details</Panel.Toggle>
                    <Panel.Collapse>
                        <p><b>Failure details :</b></p>
                        <ListGroup>
                            {errorDisplayList}
                        </ListGroup>
                    </Panel.Collapse>
                </Panel>
            </div>
        );
    }
}

const FeatureElement = ({element}) => (
    <ListGroupItem>
        <h4 className="scenario-title">{element.name}</h4>
        <p>
            <span className="text-muted">Checking Compliance for </span>
            <span className="scenario-spec-details">
                <b>{element.tags[0].name.slice(1)} &nbsp;</b>
                <Badge className="spec-badge">Section {element.tags[1].name.slice(1)}</Badge>
            </span>
        </p>
        {stepStatus(element.steps)}
    </ListGroupItem>
);

const ElementStep = ({step}) => (
    step.result.status
);

const ReportFeature = ({feature}) => (
        <Panel defaultExpanded={false}>
            <Panel.Heading>
                <div className="pull-right feature-result">
                <span className={reportHelper.getFeatureResultStatus(feature, reportHelper).class}>
                    <i className={reportHelper.getFeatureResultStatus(feature, reportHelper).status === "Passed"
                        ? "fas fa-check-circle" : "fas fa-times-circle"}/>&nbsp;{reportHelper.getFeatureResultStatus(feature, reportHelper).status}</span>
                </div>
                <Panel.Title><h4 className="feature-title"><b>Feature:</b> {feature.name}</h4></Panel.Title>
                <Panel.Toggle componentClass="a">View Scenarios</Panel.Toggle>
            </Panel.Heading>
            <Panel.Collapse>
                <Panel.Body>
                    {feature.elements.map(element => <FeatureElement element={element}/>)}
                </Panel.Body>
            </Panel.Collapse>
        </Panel>
);

const ReportSpec = connect((state) => ({specifications: state.specifications,}))(({spec,specName,specifications}) => (
    <Panel>
        <Panel.Heading className="spec-heading">
            <h2>{specifications.specs[specName].title} <small>{specifications.specs[specName].version} </small></h2>
            <p className={"text-muted"}>{specifications.specs[specName].description}</p>
        </Panel.Heading>
        <Panel.Body>{spec.map(featurex => <ReportFeature feature={featurex}/>)}</Panel.Body>
    </Panel>
));

class TestReportView extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            uuid: props.match.params.uuid,
            revision: props.match.params.revision,
            loading: true,
            data: null,
            currentSpecName: "specExample",
            passed: 0,
            failed: 0,
            rate: 0,
            attributes: null,
            showInteractionModel: null,
            testRunning: false
        };

        this.interval = null;
        this.renderMain = this.renderMain.bind(this);
        this.appendResults = this.appendResults.bind(this);
    }


    componentDidMount() {
        //var currentRoute = this.props.location.pathname;
        client.getResultsForTestPlan(this.state.uuid, this.state.revision).then((response)=>{
            var report = response.data.report.result;
            //console.log(response.data);
            var results = reportHelper.getTestSummary(report);
            this.setState({
                loading:false,
                data: report,
                passed: results.passed,
                failed: results.failed,
                rate: results.rate
            });
            if(response.data.report.state === "RUNNING"){
                this.setState({testRunning: true});
                this.interval = setInterval(() => this.appendResults(), 2000);
            }
        });
    }
    componentWillUnmount() {
        clearInterval(this.interval);
    }

    appendResults(){
        client.pollResultsForTestPlan(this.state.uuid).then((response)=>{
            response.data.forEach((result) => {
                if(result.runnerState==="DONE"){
                    this.setState({
                        testRunning : false
                    });
                }
                this.setState({
                    showInteractionModel : false
                });
                var resultObject = this.state.data;
                if(result.featureResult){
                    var feature = result; //todo - Refactor this

                    var featureResult = reportHelper.getFeatureResult(feature['featureResult'],reportHelper);
                        resultObject = {
                        ...resultObject,
                        [feature.specName] : [...resultObject[feature.specName],feature.featureResult]
                        };
                        this.setState({
                            data: resultObject,
                            passed: this.state.passed + featureResult.passed,
                            failed: this.state.failed + featureResult.failed,
                            rate: (((this.state.passed+ featureResult.passed)/(parseFloat(this.state.passed + featureResult.passed)+(this.state.failed + featureResult.failed)))*100).toFixed(2)
                        })
                }else if(result.attributeGroup){
                    this.setState({
                        attributes : result.attributeGroup,
                        showInteractionModel : true
                    })
                }
            });
        });
    }

    render() {
        return (
            <div>
                <AppHeader/>
                <AppBreadcrumbs/>
                <br/>
                {this.state.loading ? <h1>Loading..</h1> : this.renderMain()}
            </div>
        );
    }

    renderMain(){
        return (
            <Grid>
                <Modal show={this.state.showInteractionModel} onHide={()=>{this.setState({showInteractionModel : false})}} container={this}>
                    <Modal.Header closeButton>
                        <Modal.Title>
                            Browser Interaction
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {this.state.attributes ? <AttributeGroup group={this.state.attributes} key={this.state.attributes.groupName}/> : []}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={()=>{this.setState({showInteractionModel : false})}}>Close</Button>
                    </Modal.Footer>
                </Modal>
                <Row className="stickeyHeader">
                    <Col md={12}>
                        <h1>Test Report</h1>

                        <div className={"overall-results-block report-block"}>
                            {this.state.passed > 0
                                ? <p><span className="passed-summary">Passed</span> : {this.state.passed}</p>
                                : null
                            }

                            {this.state.failed > 0
                                ? <p><span className="failed-summary">Failed</span> : {this.state.failed}</p>
                                : null
                            }

                            { this.state.testRunning
                                ? <LoaderComponent/>
                                : null
                            }
                        </div>
                        <hr/>
                    </Col>
                </Row>
                <Row>
                    <Col md={12}>
                        <div>
                            {Object.keys(this.state.data).map((key) => <ReportSpec spec={this.state.data[key]} specName={key}/>)}
                        </div>
                    </Col>
                </Row>
            </Grid>
        );
    }
}

export default TestReportView;
