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

package com.wso2.finance.open.banking.conformance.api.dao;

import com.wso2.finance.open.banking.conformance.api.ApplicationDataHolder;
import com.wso2.finance.open.banking.conformance.api.dto.BasicAPIDTO;
import com.wso2.finance.open.banking.conformance.mgt.models.API;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * DTO for getting information on APIs
 */
public class APIDAO {

    private Map<String, API> apis = null;

    public APIDAO() {

        this.apis = ApplicationDataHolder.getInstance().getAPIs();
    }

    public List<BasicAPIDTO> getBasicAPIs() {

        return this.apis.values().stream().map(api ->
                new BasicAPIDTO(api.getName(),
                api.getTitle(), api.getVersion(),
                api.getDescription(), api.getAPIUri())
        ).collect(Collectors.toList());
    }

    public API getAPI(String key) {

        return this.apis.get(key);
    }
}
