

package com.wso2.finance.open.banking.conformance.test.core.testrunners;

import org.testng.annotations.Test;
import cucumber.api.CucumberOptions;
import cucumber.api.testng.AbstractTestNGCucumberTests;



@CucumberOptions(features={"src/test/resources/features"}
        ,glue={"com.wso2.finance.open.banking.conformance.test.core.steps"}
        ,plugin = {"pretty", "html:target/cucumber"}
)
@Test
public class SampleTestRunner extends AbstractTestNGCucumberTests{

}
