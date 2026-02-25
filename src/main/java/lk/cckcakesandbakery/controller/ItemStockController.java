package lk.cckcakesandbakery.controller;

import lk.cckcakesandbakery.dao.ItemStockDao;
import lk.cckcakesandbakery.entity.ItemStock;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import java.util.List;

@RestController
public class ItemStockController {

    @Autowired // generate instance
    private ItemStockDao itemStockDao;


    // request mapping for load stock ui[URL --->/itemstock]
    @RequestMapping(value = "/itemstock")
    public ModelAndView loadItemStockUI() {
        ModelAndView itemStockUI = new ModelAndView();
        itemStockUI.setViewName("itemstock.html");

        return itemStockUI;
    }

    // request mapping for load itemstock all data [URL--->
    // /itemstock/alldata]
    @GetMapping(value = "/itemstock/alldata", produces = "application/json")
    public List<ItemStock> findAllData() {
        return itemStockDao.findAll();
    }

}
