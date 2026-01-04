package lk.cckcakesandbakery.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import lk.cckcakesandbakery.dao.PrivilegeDao;
import lk.cckcakesandbakery.entity.Privilege;

@Controller
public class UserPrivilegeController {

    @Autowired
    private PrivilegeDao privilegeDao;

    // define function for get Privilege by given username and modulename
    public Privilege getPrivilegeByUserModule(String username, String modulename) {

        Privilege userPrivilege = new Privilege();

        if (username.equals("Admin")) {

            userPrivilege.setPrivi_select(true);
            userPrivilege.setPrivi_insert(true);
            userPrivilege.setPrivi_update(true);
            userPrivilege.setPrivi_delete(true);

        } else {

            String userPriviString = privilegeDao.getUserPrivilegeByUserModule(username, modulename);// this calls the
                                                                                                     // query from
                                                                                                     // privilegeDao -->
                                                                                                     // results the
                                                                                                     // privileges for
                                                                                                     // modules respect
                                                                                                     // to the roles of
                                                                                                     // users by
                                                                                                     // username
            String[] userPriviArray = userPriviString.split(","); // the object returned is converted into an array by
                                                                  // splitting by "," --> [1,1,1,1]

            System.out.println(userPriviString);

            userPrivilege.setPrivi_select(userPriviArray[0].equals("1"));
            userPrivilege.setPrivi_insert(userPriviArray[1].equals("1"));
            userPrivilege.setPrivi_update(userPriviArray[2].equals("1"));
            userPrivilege.setPrivi_delete(userPriviArray[3].equals("1"));

        }

        return userPrivilege;

    }

}
