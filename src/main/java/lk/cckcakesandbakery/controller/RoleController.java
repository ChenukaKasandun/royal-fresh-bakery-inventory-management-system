package lk.cckcakesandbakery.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import lk.cckcakesandbakery.dao.RoleDao;

import lk.cckcakesandbakery.entity.Role;

@RestController
public class RoleController {

    @Autowired
    private RoleDao roleDao;

    // request mapping for get role all data [URL
    // --->//role/alldata]
    @GetMapping(value = "role/alldata", produces = "application/json")
    public List<Role> findAllData() {
        return roleDao.findAll();

    }

    // request mapping for get role all data without Admin [URL
    // --->//role/alldatawithoutadmin]
    @GetMapping(value = "role/alldatawithoutadmin", produces = "application/json")
    public List<Role> findAllDataWithoutAdmin() {
        return roleDao.findAllWithoutAdmin("name");

    }

}
