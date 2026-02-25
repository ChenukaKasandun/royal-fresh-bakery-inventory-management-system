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
@Table(name = "invoice")

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Invoice {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String invoice_no;

    private BigDecimal total_price;

    private BigDecimal discount_price;

    private LocalDate date;

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
    @JoinColumn(name = "invoice_status_id", referencedColumnName = "id") // Foreign key
    private InvoiceStatus invoice_status_id;

    @ManyToOne
    @JoinColumn(name = "production_session_id" , referencedColumnName = "id")
    private ProductionSession production_session_id;

    @ManyToOne
    @JoinColumn(name = "customer_order_id", referencedColumnName = "id") // Foreign key
    private CustomerOrder customer_order_id;

    // Association table   In Here, "cascade = CascadeType.ALL" should be essential to save data into association table
    //"orphanRemoval = true" should be essential to remove data from the association table
    @OneToMany(mappedBy = "invoice_id" , cascade = CascadeType.ALL ,orphanRemoval = true )
    private List<InvoiceHasItem> invoiceHasItemList;


}
