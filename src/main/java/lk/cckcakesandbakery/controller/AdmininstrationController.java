package lk.cckcakesandbakery.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

@RestController
public class AdmininstrationController {
    // request mapping for load stock ui[URL --->/administrationcenter]
    @RequestMapping(value = "/administrationcenter")
    public ModelAndView loadAdministrationCenterUI() {
        ModelAndView administrationCenterUI = new ModelAndView();
        administrationCenterUI.setViewName("administration.html");

        return administrationCenterUI;
    }

}
