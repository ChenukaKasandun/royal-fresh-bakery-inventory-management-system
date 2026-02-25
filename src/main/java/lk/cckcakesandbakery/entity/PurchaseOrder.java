package lk.cckcakesandbakery.entity;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import jakarta.persistence.*;

import jakarta.persistence.GenerationType;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "purchase_order")

@Data
@AllArgsConstructor
@NoArgsConstructor

public class PurchaseOrder {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String order_no;


    private BigDecimal total_price;

    private LocalDate required_date;

    @NotNull
    private LocalDateTime added_date_time;

    private LocalDateTime update_date_time;

    private LocalDateTime delete_date_time;

    @NotNull
    private Integer added_user_id;

    private Integer update_user_id;

    private Integer delete_user_id;

    //fk
    @ManyToOne
    @JoinColumn(name = "supplier_id", referencedColumnName = "id")
    private Supplier supplier_id;

    //fk
    @ManyToOne
    @JoinColumn(name = "purchase_order_status_id", referencedColumnName = "id")
    private PurchaseOrderStatus purchase_order_status_id;

    //link association table
    @OneToMany(mappedBy = "purchase_order_id")
    private List<PurchaseOrderHasMaterial>purchaseOrderHasMaterialList;



}
