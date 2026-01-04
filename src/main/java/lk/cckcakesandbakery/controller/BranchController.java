package lk.cckcakesandbakery.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import lk.cckcakesandbakery.dao.BranchDao;

import lk.cckcakesandbakery.entity.Branch;

@RestController
public class BranchController {

    @Autowired // generate instance
    private BranchDao branchDao;

    // request mapping for load Branch all data [URL--->
    // /branch/alldata]
    @GetMapping(value = "/branch/alldata", produces = "application/json")
    public List<Branch> findAllData() {
        return branchDao.findAll();
    }

}
