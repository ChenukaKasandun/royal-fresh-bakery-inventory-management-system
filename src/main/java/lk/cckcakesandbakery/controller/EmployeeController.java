package lk.cckcakesandbakery.controller;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import lk.cckcakesandbakery.dao.EmployeeDao;
import lk.cckcakesandbakery.dao.EmployeeStatusDao;
import lk.cckcakesandbakery.dao.RoleDao;
import lk.cckcakesandbakery.dao.UserDao;
import lk.cckcakesandbakery.entity.Employee;
import lk.cckcakesandbakery.entity.Role;
import lk.cckcakesandbakery.entity.User;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PutMapping;

@RestController
public class EmployeeController {

    @Autowired // by this anotation, setters and getters are automaticaly generated..Easy to
               // access
    private EmployeeStatusDao employeeStatusDao;

    @Autowired
    private EmployeeDao employeeDao;

    @Autowired
    private UserDao userDao;

    @Autowired
    private BCryptPasswordEncoder bCryptPasswordEncoder;

    @Autowired
    private RoleDao roleDao;

    EmployeeController(EmployeeStatusDao employeeStatusDao) {
        this.employeeStatusDao = employeeStatusDao;
    }

    // request mapping for load employee ui[URL --->/employee]
    @RequestMapping(value = "/employee")
    public ModelAndView loadEmployeeUI() {

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();// This can access authentication
                                                                                     // object which has numerous
                                                                                     // properties

        ModelAndView employeeUI = new ModelAndView();
        employeeUI.setViewName("employee.html");
        employeeUI.addObject("loggedusername", auth.getName());// This returns the name of the logged user in the
                                                               // Employee UI
        employeeUI.addObject("title", "Employee Management");// Inserting title from the backend using Thymeleaf
                                                             // Function
        return employeeUI;
    }

    // request mapping for get employee all data [URL --->//employee/alldata]
    @GetMapping(value = "/employee/alldata", produces = "application/json")
    public List<Employee> findAllData() {
        return employeeDao.findAll(Sort.by(Direction.DESC, "id"));// Aranging the data in descending order according to
                                                                  // the id

    }

    // request mapping for get employee all data [URL --->//employee/alldata]
    @GetMapping(value = "/employee/listWithoutUserAccount", produces = "application/json")
    public List<Employee> listWithoutUserAccount() {
        return employeeDao.listWithoutUserAccount();// Aranging the data in descending order according to
                                                    // the id

    }

    // insert post mapping for insert employee data [URL -->/employee/insert]
    @PostMapping(value = "/employee/insert") // @RequestBody --> can access data object comming from frontend
    public String saveEmployeeData(@RequestBody Employee employee) {

        // check logged user authorization
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User loggedUser = userDao.getByUsername(auth.getName());

        // duplicate check

        // NIC Duplicate Check
        Employee extEmployeeByNic = employeeDao.getByNIC(employee.getNic());
        if (extEmployeeByNic != null && extEmployeeByNic.getId() != employee.getId()) {
            // return "Save Not Completed : Nic already exist...!";
            return "Save Not Completed  : Entered Nic " + employee.getNic() + " already exist...!";

        }

        // Explanation
        // Employee extEmployeeByNic = employeeDao.getByNIC(employee.getNic()); ---> In
        // here This finds any employee record is present in the
        // database with the same nic which is updated in the front end objectduring
        // updating.If its present it is it falls to the variable 'extEmployeeByNic'.

        // extEmployeeByNic != null && extEmployeeByNic.getId() != employee.getId())
        // ------> In here the extEmployeeByNic should be not null as it must be present
        // in
        // the database and its PK should not same as the PK of front end object as we
        // should clearly identify two records as seperate.

        // Email Duplicate Check
        Employee extEmployeeByEmail = employeeDao.getByEmail(employee.getEmail());
        if (extEmployeeByEmail != null && extEmployeeByEmail.getId() != employee.getId()) {
            // return "Save not Completed : Email Allready exist..! ";
            return "Save Not Completed  : Entered Email " + employee.getEmail() + " already exist...!";

        }

        // Mobile No Duplicate Check
        Employee extEmployeeByMobile = employeeDao.getByMobile(employee.getMobileno());
        if (extEmployeeByMobile != null && extEmployeeByMobile.getId() != employee.getId()) {
            return "Save Not Completed : Entered Mobile No " + employee.getMobileno() + "already exists...!";

        }

        // Ahh now there is no such a record in the database so we can proceed to save
        // -->

        try {
            // set auto added data
            employee.setAdded_datetime(LocalDateTime.now());
            employee.setAdded_user_id(loggedUser.getId());
            employee.setEmp_no(employeeDao.getNextEmpNo());// calling the mrthod defined in EmployeeDao file to put msql
                                                           // query

            // Save operator
            employeeDao.save(employee);

            // dependancy for user account creation
            if (employee.getDesignation_id().getUseraccount()) {
                User user = new User();
                user.setUsername(employee.getEmp_no());
                user.setEmail(employee.getEmail());
                user.setStatus(true);
                user.setAdded_date_time(LocalDateTime.now());
                user.setAdded_user_id(employee.getAdded_user_id());
                user.setPassword(bCryptPasswordEncoder.encode(employee.getNic()));
                user.setEmployee_id(employeeDao.getByNIC(employee.getNic()));

                Set<Role> roles = new HashSet<>();
                Role role = roleDao.getReferenceById(employee.getDesignation_id().getRoleid());
                roles.add(role);

                user.setRoles(roles);

                userDao.save(user);

            }

            return "OK";
        } catch (Exception e) {
            return "Save Not Completed :" + e.getMessage();
        }

    }

    // Delete mapping for the employee data [url-->/employee/delete]
    @DeleteMapping(value = "/employee/delete") // @Request mapping --> can access dataOb from front end
    public String deleteEmployee(@RequestBody Employee employee) {

        // check logged user authorization

        // Check ext(Existing)
        if (employee.getId() == null) {
            return "Delete Not completed : Employee Not exists..!";

        } // -------> This reffers to their is no id of the object so cannot delete

        Employee extEmployeeById = employeeDao.getReferenceById(employee.getId()); // main reason for assigning
                                                                                   // "extEmployeeById" is to avoid
                                                                                   // front end changes to the object
                                                                                   // before deleting.

        if (extEmployeeById == null) {
            return "Delete Not Completed : Employee not exists..!";

        } // ------> This refferes to there is a id of the object but there is no such a
          // record in data base so cannot update

        try {
            // set auto added data
            extEmployeeById.setDelete_datetime(LocalDateTime.now());
            extEmployeeById.setDelete_user_id(1);

            extEmployeeById.setEmployeestatus_id(employeeStatusDao.getReferenceById(3));

            // update operator(same as save)
            employeeDao.save(extEmployeeById);
            // employeeDao.delete(employee); --> Campus do not allow deleting records as
            // data are so important

            // employeeDao.save(extEmployeeById); ---->In hre "extEmployeeById" this is
            // saved instead of just "employee" object bqs,
            // if "employee" object is saved, changes of the front end object may also saved
            // in the darabase and it will be a destroyy data integrity

            // dependancy

            return "OK";

        } catch (Exception e) {

            return "Delete Not Completed : " + e.getMessage();
        }

    }

    @PutMapping("/employee/update")
    public String updateEmployeeData(@RequestBody Employee employee) {
        // Check logged user authorization

        // Check ext(Existing)
        if (employee.getId() == null) {
            return "Update Not completed : Employee Not exists..!";

        } // -------> This reffers to their is no id of the object so cannot update

        Employee extById = employeeDao.getReferenceById(employee.getId());

        if (extById == null) {
            return "UpdateNot Completed : Employee not exists..!";

        } // ------> This refferes to there is a id of the object but there is no sch a
          // record in data base so cannot update

        // Ahh now there is a record in the database so we can proceed to the dupplicate
        // check-->

        // dupplicate check ------. In update the same thing as the insert occurs.So we
        // need to ensure that the newly updated datails do not same as the details in
        // the database

        // NIC duplicate check
        Employee extEmployeeByNic = employeeDao.getByNIC(employee.getNic());
        if (extEmployeeByNic != null && extEmployeeByNic.getId() != employee.getId()) {
            return "Update Not Completed  : Entered nic " + employee.getNic() + " allready exist...!";
        }

        // Email duplicate check
        Employee extEmployeeByEmail = employeeDao.getByEmail(employee.getEmail());
        if (extEmployeeByEmail != null && extEmployeeByEmail.getId() != employee.getId()) {
            return "Update Not Completed : Email already exists...!";

        }

        try {

            // Set auto added data
            employee.setUpdate_datetime(LocalDateTime.now());
            employee.setUpdate_user_id(1);

            // Save operator
            employeeDao.save(employee);

            // dependancies

            return "OK";
        } catch (Exception e) {
            return "Update Not Completed : " + e.getMessage();
        }

    }

}
