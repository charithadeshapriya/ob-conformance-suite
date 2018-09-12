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

package com.wso2.finance.open.banking.conformance.mgt.models;

import java.util.List;
import java.util.NoSuchElementException;
import javax.xml.bind.annotation.XmlAttribute;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlElementWrapper;
import javax.xml.bind.annotation.XmlRootElement;

/**
 * Model class representing a single API.
 */
@XmlRootElement(namespace = "com.wso2.finance.open.banking.conformance.mgt.models", name = "API")
public class API {

    @XmlAttribute
    private String name;
    @XmlAttribute
    private String version;
    @XmlElement
    private String title;
    @XmlElement
    private String description;
    @XmlElement
    private String apiUri;
    @XmlElementWrapper(name = "attributeGroups")
    @XmlElement(name = "AttributeGroup")
    private List<AttributeGroup> attributeGroups;
    @XmlElementWrapper(name = "vectors")
    @XmlElement(name = "Vector")
    private List<Vector> testingVectors;
    @XmlElementWrapper(name = "features")
    @XmlElement(name = "Feature")
    private List<Feature> features;

    public API() {

    }

    /**
     * @param name
     * @param version
     * @param title
     * @param description
     * @param apiUri
     * @param attributeGroups
     * @param testingVectors
     * @param features
     */
    public API(String name, String version, String title, String description, String apiUri,
                         List<AttributeGroup> attributeGroups, List<Vector> testingVectors, List<Feature> features) {

        this.name = name;
        this.version = version;
        this.title = title;
        this.description = description;
        this.apiUri = apiUri;
        this.attributeGroups = attributeGroups;
        this.testingVectors = testingVectors;
        this.features = features;
    }

    /**
     * @return
     */
    public String getName() {

        return name;
    }

    /**
     * @return
     */
    public String getTitle() {

        return title;
    }

    /**
     * @return
     */
    public String getDescription() {

        return description;
    }

    /**
     * @return
     */
    public String getAPIUri() {

        return apiUri;
    }

    /**
     * @return
     */
    public List<AttributeGroup> getAttributeGroups() {

        return attributeGroups;
    }

    /**
     * @return
     */
    public List<Vector> getTestingVectors() {

        return testingVectors;
    }

    /**
     * @return
     */
    public List<Feature> getFeatures() {

        return features;
    }

    /**
     * @return
     */
    public String getVersion() {

        return version;
    }

    /**
     *
     * @param tag
     * @return
     * @throws NoSuchElementException
     */
    public Vector getVector(String tag) throws NoSuchElementException {
        int len=testingVectors.size();
        for(int i=0; i<len; i++) {
            if (testingVectors.get(i).getTag().equals(tag)){
                return testingVectors.get(i);
            }
        }
        throw new NoSuchElementException("Invalid tag.");
    }

    /**
     *
     * @param title
     * @return
     * @throws NoSuchElementException
     */
    public Feature getFeature(String title) throws NoSuchElementException {
        int len=features.size();
        for(int i=0; i<len; i++) {
            if (features.get(i).getTitle().equals(title)){
                return features.get(i);
            }
        }
        throw new NoSuchElementException("Invalid feature title.");
    }

    /**
     *
     * @param groupName
     * @return
     * @throws NoSuchElementException
     */
    public AttributeGroup getAttributeGroup(String groupName) throws NoSuchElementException {
        int len=attributeGroups.size();
        for(int i=0; i<len; i++) {
            if (attributeGroups.get(i).getGroupName().equals(groupName)){
                return attributeGroups.get(i);
            }
        }
        throw new NoSuchElementException("Invalid group name.");
    }
}
