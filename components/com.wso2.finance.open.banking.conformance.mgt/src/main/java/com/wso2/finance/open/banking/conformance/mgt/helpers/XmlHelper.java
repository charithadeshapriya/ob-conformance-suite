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

package com.wso2.finance.open.banking.conformance.mgt.helpers;

import com.wso2.finance.open.banking.conformance.mgt.models.API;
import com.wso2.finance.open.banking.conformance.mgt.models.TestPlan;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.OutputStream;
import javax.xml.bind.JAXBContext;
import javax.xml.bind.JAXBException;
import javax.xml.bind.Marshaller;
import javax.xml.bind.Unmarshaller;

/**
 * Helper class for marshalling and unmarshalling XML documents
 */
public class XmlHelper {

    public static void marshallAPI(API api, OutputStream outStream) throws JAXBException {

        JAXBContext context = JAXBContext.newInstance(API.class);
        Marshaller marshaller = context.createMarshaller();
        marshaller.setProperty(Marshaller.JAXB_FORMATTED_OUTPUT, Boolean.TRUE);
        marshaller.marshal(api, outStream);
    }

    public static  void marshallTestPlan(TestPlan testPlan, OutputStream outStream) throws JAXBException {
        JAXBContext context = JAXBContext.newInstance(TestPlan.class);
        Marshaller marshaller = context.createMarshaller();
        marshaller.setProperty(Marshaller.JAXB_FORMATTED_OUTPUT, Boolean.TRUE);
        marshaller.marshal(testPlan, outStream);
    }

    public static API unmarshallSepcificationXML(File xmlDocument) throws JAXBException,
            FileNotFoundException {

        JAXBContext context = JAXBContext.newInstance(API.class);
        Unmarshaller unmarshaller = context.createUnmarshaller();
        return (API) unmarshaller.unmarshal(new FileReader(xmlDocument));
    }

    public static TestPlan unmarshallTestPlanXML(File xmlDocument) throws JAXBException,
            FileNotFoundException {

        JAXBContext context = JAXBContext.newInstance(TestPlan.class);
        Unmarshaller unmarshaller = context.createUnmarshaller();
        return (TestPlan) unmarshaller.unmarshal(new FileReader(xmlDocument));
    }
}
