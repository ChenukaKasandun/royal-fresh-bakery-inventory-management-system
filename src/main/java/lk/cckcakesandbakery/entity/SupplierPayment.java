package lk.cckcakesandbakery.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "suppilier_payments")

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SupplierPayment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String total_price;

    private String paid_amount;

    private String balance_amount;

    private String note;

    private String returned_item_list;

    @NotNull
    private LocalDateTime added_date_time;

    private LocalDateTime update_date_time;

    private LocalDateTime delete_date_time;

    @NotNull
    private Integer added_user_id;

    private Integer update_user_id;

    private Integer delete_user_id;

    // Foreign Key Attributes
    @ManyToOne
    @JoinColumn(name = "supplier_payment_status_id", referencedColumnName = "id")
    private SupplierPaymentStatus supplier_payment_status_id;

    @ManyToOne
    @JoinColumn(name = "supplier_payment_method_id", referencedColumnName = "id")
    private SupplierPaymentMethod supplier_payment_method_id;;

    @ManyToOne
    @JoinColumn(name = "grn_id", referencedColumnName = "id")
    private Grn grn_id;

}
