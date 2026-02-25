package lk.cckcakesandbakery.entity;

import jakarta.persistence.*;
import jakarta.persistence.GenerationType;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity // this class generate as an entity
@Table(name = "walking_customer_payment") // table mapping

@Data // setter and getters, toString
@AllArgsConstructor // All Argument constructor
@NoArgsConstructor // Default constructor
public class WalkingCustomerPayment {

    @Id // PK
    @GeneratedValue(strategy = GenerationType.IDENTITY) // AI
    private Integer id;


    @NotNull
    private LocalDate payment_date;

    @NotNull
    private Integer add_user_id;

    private Integer update_user_id;

    private Integer delete_user_id;



    @NotNull
    private LocalDateTime add_date_time;

    private LocalDateTime update_date_time;

    private LocalDateTime delete_date_time;

    private BigDecimal balance_amount;

    private BigDecimal paid_amount;


//    Foreign Key
    @ManyToOne
    @JoinColumn(name = "customer_payment_method_id", referencedColumnName = "id")
    private CustomerPaymentMethod customer_payment_method_id;


}
