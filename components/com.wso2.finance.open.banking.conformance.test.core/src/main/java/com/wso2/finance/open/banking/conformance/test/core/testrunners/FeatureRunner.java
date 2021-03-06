/*
 * Copyright (c) 2014, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
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

package com.wso2.finance.open.banking.conformance.test.core.testrunners;

import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.wso2.finance.open.banking.conformance.mgt.testconfig.Feature;
import com.wso2.finance.open.banking.conformance.test.core.context.Context;
import cucumber.api.cli.Main;
import org.apache.log4j.Logger;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileReader;

/**
 * Execute a single Feature and return result.
 */
public class FeatureRunner {

    private Feature feature;

    private Logger log = Logger.getLogger(FeatureRunner.class);

    /**
     * @param feature
     */
    public FeatureRunner(Feature feature) {

        this.feature = feature;
    }

    /**
     * Run each Scenario in a feature.
     *
     * @return
     */
    public JsonObject runFeature() {

        log.info("Start Running Feature: " + feature.getTitle());

        Context.getInstance().setFeatureContext(feature.getUri());
        File resultFile = new File("target/cucumber-report/cucumber.json");

        //set cucumber options
        String[] argv = new String[]
                {"-p", "json:" + resultFile.getPath(), "-g",
                        "classpath:com.wso2.finance.open.banking.conformance.test.core.steps",
                        feature.getUri()
                };

        ClassLoader contextClassLoader = Thread.currentThread().getContextClassLoader();
        try {
            Main.run(argv, contextClassLoader);
        } catch (Exception e) {
            log.warn("Unable to Run Feature " + feature.getTitle(), e);
        }

        Context.getInstance().clearFeatureContext();

        log.info("End Running Feature: " + feature.getTitle());

        try {
            return this.readJson(resultFile);
        } catch (FileNotFoundException e) {
            log.error("Feature Result File Not Found", e);
            return null;
        }
    }

    /**
     * @param url
     * @return
     * @throws FileNotFoundException
     */
    private JsonObject readJson(File url) throws FileNotFoundException {

        JsonParser parser = new JsonParser();
        JsonElement jsonElement = parser.parse(new FileReader(url));
        return jsonElement.getAsJsonArray().get(0).getAsJsonObject();
    }
}
