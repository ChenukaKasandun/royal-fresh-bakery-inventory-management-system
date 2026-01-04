package lk.cckcakesandbakery.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import lk.cckcakesandbakery.dao.VehicleStatusDao;
import lk.cckcakesandbakery.entity.VehicleStatus;

@RestController
public class VehicleStatusController {

    @Autowired // generate instance
    private VehicleStatusDao vehicleStatusDao;

    // request mapping for load vehicle status all data [URL--->
    // /vehicleroute/alldata]
    @GetMapping(value = "/vehiclstatus/alldata", produces = "application/json")
    public List<VehicleStatus> findAllData() {
        return vehicleStatusDao.findAll();
    }

}
