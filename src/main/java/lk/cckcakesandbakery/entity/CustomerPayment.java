package lk.cckcakesandbakery.entity;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

import jakarta.persistence.*;
import jakarta.persistence.GenerationType;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "customer_payment")

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CustomerPayment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private LocalDate payment_date;

    private BigDecimal paid_amount;

    private BigDecimal balance_amount;


    @NotNull
    private LocalDateTime add_date_time;

    @NotNull
    private Integer add_user_id;

    @ManyToOne
    @JoinColumn(name = "invoice_id", referencedColumnName = "id")
    private Invoice invoice_id;

    @ManyToOne
    @JoinColumn(name = "customer_payment_method_id", referencedColumnName = "id")
    private CustomerPaymentMethod customer_payment_method_id;

    @ManyToOne
    @JoinColumn(name = "customer_payment_type_id", referencedColumnName = "id")
    private CustomerPaymentType customer_payment_type_id;

    @ManyToOne
    @JoinColumn(name = "return_items_id" , referencedColumnName = "id")
    private ReturnItems return_items_id;

}
