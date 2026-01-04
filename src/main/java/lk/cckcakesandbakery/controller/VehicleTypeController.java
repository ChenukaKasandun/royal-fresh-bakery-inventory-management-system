package lk.cckcakesandbakery.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import lk.cckcakesandbakery.dao.VehicleTypeDao;

import lk.cckcakesandbakery.entity.VehicleType;

@RestController
public class VehicleTypeController {

    @Autowired // generate instance
    private VehicleTypeDao vehicleTypeDao;

    // request mapping for load vehicle type all data [URL--->
    // /vehicletype/alldata]
    @GetMapping(value = "/vehicletype/alldata", produces = "application/json")
    public List<VehicleType> findAllData() {
        return vehicleTypeDao.findAll();
    }

}
