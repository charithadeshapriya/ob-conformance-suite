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

package com.wso2.finance.open.banking.conformance.mgt.testconfig;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;

public class TestPlan {

    private Map<String,API> apis;

    private Date lastRun;

    public TestPlan(){}

    public TestPlan(Map<String,API> apiMap)
    {
        this.apis = apiMap;
    }

    public API getAPI(String key)
    {
        return apis.get(key);
    }

    public List<API> getAPIs(){
        return new ArrayList(apis.values());
    }

    public Date getLastRun() {

        return lastRun;
    }

    public void setLastRun(Date lastRun) {

        this.lastRun = lastRun;
    }
}
