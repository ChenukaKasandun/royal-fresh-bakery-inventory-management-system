package lk.cckcakesandbakery.controller;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import lk.cckcakesandbakery.entity.CustomerOrderHasItem;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import lk.cckcakesandbakery.dao.CustomerDao;
import lk.cckcakesandbakery.dao.CustomerOrderDao;
import lk.cckcakesandbakery.dao.OrderStatusDao;
import lk.cckcakesandbakery.dao.UserDao;
import lk.cckcakesandbakery.entity.CustomerOrder;
import lk.cckcakesandbakery.entity.Privilege;
import lk.cckcakesandbakery.entity.User;
import org.springframework.web.bind.annotation.PutMapping;

@RestController
public class CustomerOrderController {

    @Autowired // ---> we can generate instances of interfaces
    private CustomerOrderDao customerOrderDao;

    @Autowired
    private UserDao userDao;

    @Autowired
    private CustomerDao customerDao;

    @Autowired
    private UserPrivilegeController userPrivilegeController;

    @Autowired
    private OrderStatusDao orderStatusDao;

    // request mapping for load order ui[URL --->/order]
    @RequestMapping(value = "/customerorder")
    public ModelAndView loadOrderUI() {

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        ModelAndView customerOrderUI = new ModelAndView();
        customerOrderUI.setViewName("customerOrder.html");
        customerOrderUI.addObject("loggedusername", auth.getName());
        customerOrderUI.addObject("title", "customer order");

        return customerOrderUI;
    }

    // request mapping for get customer orders by customer name [URL
    // --->//customerorder/orderByCustomerName]
    @GetMapping(value = "/customerorder/customerorderbycustomerid", params = {
            "customerId" }, produces = "application/json") // produces = "application/json" --> Data from the database
                                                             // pases to the front end in json format...
    public List<CustomerOrder> findCustomerOderByCustomerId(@RequestParam(name = "customerId") Integer customerId) {

        // Get Order No by CustomerId
        return customerOrderDao.getCustomerOrderByCustomerId(customerId);
    }

    // request mapping for get Total Price by Invoice No [URL
    // --->/customerorder/totalpricebyinvoiceno]
    @GetMapping(value = "/customerorder/totalpricebyinvoiceno", params = {
            "invoiceno" }, produces = "application/json") // produces = "application/json" --> Data from the database
    // pases to the front end in json format...
    public Double findTotalPriceByInvoice(@RequestParam(name = "invoiceno") String invoiceno) {

        return customerOrderDao.getTotalPriceByInvoice(invoiceno);
    }




    // request mapping for get Discounted Price by Invoice No [URL
    // --->/customerorder/totalpricebyinvoiceno]
    @GetMapping(value = "/customerorder/discountedpricebyinvoiceno", params = {
            "invoiceno" }, produces = "application/json") // produces = "application/json" --> Data from the database
    // pases to the front end in json format...
    public Double findDiscountedPriceByInvoice(@RequestParam(name = "invoiceno") String invoiceno) {

        return customerOrderDao.getDiscountedPriceByInvoice(invoiceno);
    }

    // request mapping for get Discounted Price by Invoice No [URL
    // --->/customerorder/advancedpaymentbyinvoiceno]
    @GetMapping(value = "/customerorder/advancedpaymentbyinvoiceno", params = {
            "invoiceno" }, produces = "application/json") // produces = "application/json" --> Data from the database
    // pases to the front end in json format...
    public Double findAdvancedPaymentByInvoice(@RequestParam(name = "invoiceno") String invoiceno) {

        return customerOrderDao.getAdvancedPaymentByInvoice(invoiceno);
    }


    // request mapping for get Total Price by Customer Order Id [URL
    // --->/customerorder/totalpricebycustomerorderid]
    @GetMapping(value = "/customerorder/totalpricebycustomerorderid", params = {
            "customerOrderId" }, produces = "application/json") // produces = "application/json" --> Data from the database
    // pases to the front end in json format...
    public Double findTotalPriceByCustomerOrderId(@RequestParam(name = "customerOrderId") Integer customerOrderId) {

        return customerOrderDao.getTotalPriceByCustomerOrderId(customerOrderId);
    }


    // request mapping for get Discounted Price by Customer OrderId [URL
    // --->/customerorder/discountedpricebycustomerorderid]
    @GetMapping(value = "/customerorder/discountedpricebycustomerorderid", params = {
            "customerOrderId" }, produces = "application/json") // produces = "application/json" --> Data from the database
    // pases to the front end in json format...
    public Double findDiscountedPriceByCustomerOrderId(@RequestParam(name = "customerOrderId") Integer customerOrderId) {

        return customerOrderDao.getDiscountedPriceByCustomerOrderId(customerOrderId);
    }



    // Normally, Spring can infer the parameter name if your code is compiled with
    // the -parameters flag. But if that flag is missing, Spring can't see the
    // actual name of the method argument (customerName), and you'll get this error:
    // IllegalArgumentException: Name for argument of type [java.lang.String] not
    // specified...

    // So by writing @RequestParam(name = "customerName"), you're manually
    // specifying the name to avoid that error.



    // ..............................CRUD Operations...................
    // 1.............Select...........................................
    // request mapping for get customerorder all data [URL
    // --->//customerorder/alldata]
    @GetMapping(value = "/customerorder/alldata", produces = "application/json")
    public List<CustomerOrder> findAllData() {

        // Get user authentication
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule((auth.getName()), "Customer_Order");

        // Check user authorization
        if (userPrivilege.getPrivi_select()) {
            return customerOrderDao.findAll(Sort.by(Direction.DESC, "id"));// this sets the data in descending order

        } else {
            return new ArrayList<>();

        }

    }

    // 2...........Insert...........................
    // request mapping for insert customer order data from the frontend [URL
    // --->//customerorder/insert]
    @PostMapping(value = "/customerorder/insert")
    public String saveCustomerOrderData(@RequestBody CustomerOrder customerorder) {

        // Check logged user authentication
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User loggedUser = userDao.getByUsername(auth.getName());

        // Check logged user authorization
        Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule((auth.getName()), "Customer_Order");

        if (userPrivilege.getPrivi_insert()) {

            // duplicate check

            try {

                // Set auto added data
                customerorder.setAdded_date_time(LocalDateTime.now());
                customerorder.setAdd_user_id(loggedUser.getId());
                customerorder.setOrder_no(customerOrderDao.getNextOrderNo());

                //Saving data in association table
                for (CustomerOrderHasItem cohi : customerorder.getCustomerOrderHasItemList()){
                    cohi.setCustomer_order_id(customerorder);
                }

                // save operator(save frontend object)
                customerOrderDao.save(customerorder);
                return "OK";
            } catch (Exception e) {
                return "Save not completed :" + e.getMessage();
            }

        } else {

            return "Cannot Submit..!User Do not have Privileges...!";

        }

    }

    // 3................Delete......................................
    /// Delete rawmaterial data from the frontend [URL --->//rawmaterial/delete]
    @DeleteMapping(value = "/customerorder/delete")
    public String deleteCustomer(@RequestBody CustomerOrder customerOrder) {

        // Check logged user authentication
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User loggedUser = userDao.getByUsername(auth.getName());

        // Check logged user authorization
        Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule((auth.getName()), "Customer_Order");

        if (userPrivilege.getPrivi_delete()) {

            // Check ext (Existing)
            if (customerOrder.getId() == null) {
                return "Delete not completed : Customer Order not exists..!";

            } // This refers there is no id in the object,so cannot delete..!

            CustomerOrder extCustomerOrderById = customerOrderDao.getReferenceById(customerOrder.getId());

            if (extCustomerOrderById == null) {
                return "Delete Not Completed : Customer Order not exists...!";

            } // This refferes to there is a id of thre object,but ithat id is not in the
              // database

            try {

                // Set auto added data
                extCustomerOrderById.setDelete_date_time(LocalDateTime.now());
                extCustomerOrderById.setDelete_user_id(loggedUser.getId());

                extCustomerOrderById.setCustomer_order_status_id(orderStatusDao.getReferenceById(3));

                customerOrderDao.save(extCustomerOrderById);

                // customerOrderDao.delete(extCustomerOrderById);

                // Dependancy

                return "OK";

            } catch (Exception e) {
                return "Delete not completed : " + e.getMessage();
            }

        } else {

            return " Cannot Delete..!User do not have permissions..!";

        }

    }

    // 4.....................Update......................
    // Mapping for save fontend dataob to the database
    @PutMapping(value = "/customerorder/update")
    public String updateCustomerOrderData(@RequestBody CustomerOrder customerOrder) {

        // Check logged user authentication
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User loggedUser = userDao.getByUsername(auth.getName());

        // Check logged user authorization
        Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule((auth.getName()), "Customer_Order");

        if (userPrivilege.getPrivi_update()) {

            // Dupllicate check

            try {

                // Set auto added data
                customerOrder.setUpdate_date_time((LocalDateTime.now()));
                customerOrder.setUpdate_user_id(loggedUser.getId());

                // Save operator(save fontend data object)
                customerOrderDao.save(customerOrder);
                return "OK";
            } catch (Exception e) {

                return "Update Not Completed :" + e.getMessage();
            }

        } else {
            return "Cannot Update..! User do not have Privileges...!";
        }

    }

}
