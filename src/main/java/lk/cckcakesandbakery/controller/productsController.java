package lk.cckcakesandbakery.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

@RestController
public class productsController {

    // request mapping for load products ui[URL --->/products]
    @RequestMapping(value = "/products")
    public ModelAndView loadProductsUI() {
        ModelAndView productsUI = new ModelAndView();
        productsUI.setViewName("products.html");

        return productsUI;
    }

}
