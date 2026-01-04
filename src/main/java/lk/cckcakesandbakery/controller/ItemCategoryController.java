package lk.cckcakesandbakery.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import lk.cckcakesandbakery.dao.ItemCategoryDao;

import lk.cckcakesandbakery.entity.ItemCategory;

@RestController
public class ItemCategoryController {

    @Autowired
    private ItemCategoryDao itemCategoryDao;

    // request mapping for get item category all data [URL
    // --->//itemcategory/alldata]
    @GetMapping(value = "/itemcategory/alldata", produces = "application/json")
    public List<ItemCategory> findAllData() {
        return itemCategoryDao.findAll();

    }

}
