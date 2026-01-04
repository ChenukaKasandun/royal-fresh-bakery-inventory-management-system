package lk.cckcakesandbakery.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import lk.cckcakesandbakery.dao.VehicleRouteDao;

import lk.cckcakesandbakery.entity.VehicleRoute;

@RestController
public class VehicleRouteController {

    @Autowired // generate instance
    private VehicleRouteDao vehicleRouteDao;

    // request mapping for load vehicle route all data [URL--->
    // /vehicleroute/alldata]
    @GetMapping(value = "/vehicleroute/alldata", produces = "application/json")
    public List<VehicleRoute> findAllData() {
        return vehicleRouteDao.findAll();
    }

}
