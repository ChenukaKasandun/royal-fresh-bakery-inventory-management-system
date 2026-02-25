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
@Table(name = "grn")

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Grn {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @NotNull
    private LocalDate received_date;

    @NotNull
    private BigDecimal total_price;

    @NotNull
    private String grn_no;

    @NotNull
    private String bill_no;

    @NotNull
    private LocalDateTime add_date_time;

    private LocalDateTime update_date_time;

    private LocalDateTime delete_date_time;

    @NotNull
    private Integer add_user_id;

    private Integer update_user_id;

    private Integer delete_user_id;

    @ManyToOne
    @JoinColumn(name = "grn_status_id", referencedColumnName = "id")
    private GrnStatus grn_status_id;

    @ManyToOne
    @JoinColumn(name = "supplier_id", referencedColumnName = "id")
    private Supplier supplier_id;

    @ManyToOne
    @JoinColumn(name = "purchase_order_id", referencedColumnName = "id")
    private PurchaseOrder purchase_order_id;


//    Association Table
    @OneToMany(mappedBy = "grn_id")
    private List<GrnHasMaterial> grnHasMaterialList;

}
