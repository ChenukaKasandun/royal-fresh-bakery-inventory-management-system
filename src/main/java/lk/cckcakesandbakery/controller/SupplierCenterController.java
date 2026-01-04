package lk.cckcakesandbakery.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

@RestController
public class SupplierCenterController {

    // request mapping for load stock ui[URL --->/suppliercenter]
    @RequestMapping(value = "/suppliercenter")
    public ModelAndView loadSupplierCenterUI() {
        ModelAndView supplierCenterUI = new ModelAndView();
        supplierCenterUI.setViewName("suppliercenter.html");

        return supplierCenterUI;
    }

}
