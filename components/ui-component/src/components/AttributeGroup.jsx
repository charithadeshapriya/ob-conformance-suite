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
import {
    FormGroup, ControlLabel, FormControl, HelpBlock, Button,
} from 'react-bootstrap';
import { connect } from 'react-redux';
import { bootstrapUtils } from 'react-bootstrap/lib/utils';
import { setSpecValue, setFeatureValue } from '../actions';

bootstrapUtils.addStyle(Button, 'secondary');


export class StringAttribute extends React.Component {
    constructor(props) {
        super(props);

        const defaultValue = this.getDefaultValue();
        this.state = {
            value: defaultValue || '',
        };

        this.handleChange = this.handleChange.bind(this);
        this.getValidationStatus = this.getValidationStatus.bind(this);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.specName !== this.props.specName) {
            const defaultValue = this.getDefaultValue();
            this.setState({
                value: defaultValue || '',
            });
        }
    }

    getDefaultValue() {
        const testStateValue = this.props.getValue(this.props.attribute.name);
        return testStateValue || this.props.attribute.defaultValue;
    }

    getValidationStatus() {
        if (this.props.attribute.validationRegex) {
            const isValid = this.state.value.match(RegExp(this.props.attribute.validationRegex));
            return isValid ? null : 'error';
        } else {
            return null;
        }
    }

    handleChange(e) {
        this.setState({ value: e.target.value });
        this.props.updateChange(this.props.attribute.name,
            (this.getValidationStatus() == 'success' ? this.state.value : null));
    }

    render() {
        return (
            <FormGroup controlId={this.props.attribute.name} validationState={this.getValidationStatus()}>
                <ControlLabel>{this.props.attribute.label}</ControlLabel>
                <FormControl
                    type='text'
                    value={this.state.value}
                    placeholder='Enter text'
                    onChange={this.handleChange}
                />
                <FormControl.Feedback />
                <div hidden={this.getValidationStatus() !== 'error'} className='text-warning'>
                    <HelpBlock>{this.props.attribute.helpText}</HelpBlock>
                </div>
            </FormGroup>
        );
    }
}

const TextLabelAttribute = ({ attribute }) => (
    <div>
        <p>
            {attribute.label ? (
                <b>
                    {attribute.label}
                    {' '}
                    {' '}
                </b>
            ) : []}
            {attribute.defaultValue}
        </p>
    </div>
);

const LinkButtonAttribute = ({ attribute }) => (
    <div>
        <Button
            bsStyle='secondary'
            onClick={() => {
                window.open(attribute.defaultValue, '_blank');
            }}
        >
            {attribute.label}
        </Button>
    </div>
);

class AttributeGroup extends React.Component {
    constructor(props) {
        super(props);
        this.updateChange = this.updateChange.bind(this);
        this.getValue = this.getValue.bind(this);
    }

    updateChange(attributeName, value) {
        switch (this.props.scope) {
            case 'specification':
                this.props.dispatch(setSpecValue(this.props.specName, this.props.group.groupName,
                    attributeName, value));
                return;
            case 'feature':
                this.props.dispatch(setFeatureValue(this.props.specName, this.props.featureName,
                    this.props.group.groupName, attributeName, value));
        }
    }

    getValue(attributeName) {
        switch (this.props.scope) {
            case 'specification':
                return this.props.testvalues.specs[this.props.specName].selectedValues.specification[this.props.group.groupName][attributeName];
            case 'feature':
                return this.props.testvalues.specs[this.props.specName].selectedValues.features[this.props.featureName][this.props.group.groupName][attributeName];
            default:
                return null;
        }
    }

    renderAttribute(attribute){
        switch (attribute.attributeType){
            case "String":
                return <StringAttribute attribute={attribute} key={attribute.name} updateChange={this.updateChange} 
                    getValue={this.getValue} specName={this.props.specName}/>;
            case "TextLabel":
                return <TextLabelAttribute attribute={attribute} key={attribute.name}/>;
            case "LinkButton":
                return <LinkButtonAttribute attribute={attribute} key={attribute.name}/>;
            default:
                return <p>Not A Valid Field Type</p>;
        }
    }

    render() {
        return (
            <div className='attribute-group'>
                <h4 className='sub-heading'>{this.props.group.title}</h4>
                {this.props.group.description ? <p>{this.props.group.description}</p> : []}
                {this.props.group.attributes.map(attribute => this.renderAttribute(attribute))}
            </div>
        );
    }
}

export default connect(state => ({
    testvalues: state.testvalues,
}))(AttributeGroup);
