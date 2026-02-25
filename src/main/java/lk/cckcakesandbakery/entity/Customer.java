package lk.cckcakesandbakery.entity;

import java.time.LocalDateTime;
import java.util.List;

import jakarta.persistence.*;
import jakarta.persistence.GenerationType;
import org.hibernate.validator.constraints.Length;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "customer")

@Data
@AllArgsConstructor
@NoArgsConstructor

public class Customer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Length(max = 10)
    private String reg_no;

    @NotNull
    private String name;

    @NotNull
    private String address;

    @NotNull
    @Length(max = 10)
    private String mobileno;

    @NotNull
    private String email;

    private String note;

    @NotNull
    private LocalDateTime add_date_time;

    private LocalDateTime update_date_time;

    private LocalDateTime delete_date_time;

    @NotNull
    private Integer add_user_id;

    private Integer update_user_id;

    private Integer delete_user_id;

    @ManyToOne
    @JoinColumn(name = "customer_status_id", referencedColumnName = "id") // foreign key
    private CustomerStatus customer_status_id;

    @ManyToOne
    @JoinColumn(name = "vehicle_route_id", referencedColumnName = "id") // Foreign key
    private VehicleRoute vehicle_route_id;

    @ManyToOne
    @JoinColumn(name = "customer_type_id", referencedColumnName = "id") // Foreign Key
    private CustomerTypes customer_type_id;


    //Association Table     // Association table   In Here, "cascade = CascadeType.ALL" should be essential to save data into association table
     //"orphanRemoval = true" should be essential to remove data from the association table
    @OneToMany(mappedBy = "customer_id" , cascade = CascadeType.ALL , orphanRemoval = true)
    private List<CustomerHasItem> customerHasItemList;


}
