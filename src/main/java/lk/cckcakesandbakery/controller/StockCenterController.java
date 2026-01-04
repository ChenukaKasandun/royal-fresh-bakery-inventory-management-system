package lk.cckcakesandbakery.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

@RestController
public class StockCenterController {
    // request mapping for load stock ui[URL --->/stockcenter]
    @RequestMapping(value = "/stockcenter")
    public ModelAndView loadStockCenterUI() {
        ModelAndView stockCenterUI = new ModelAndView();
        stockCenterUI.setViewName("stockcenter.html");

        return stockCenterUI;
    }

}
