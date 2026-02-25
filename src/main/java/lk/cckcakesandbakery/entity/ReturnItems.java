
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
import java.util.List;

@Entity // this class generate as an entity
@Table(name = "return_items") // table mapping

@Data // setter and getters, toString
@AllArgsConstructor // All Argument constructor
@NoArgsConstructor
public class ReturnItems {

    @Id // PK
    @GeneratedValue(strategy = GenerationType.IDENTITY) // AI
    private Integer id;

    @NotNull
    private LocalDate date;

    private BigDecimal total_returning_price;

    @NotNull
    private LocalDateTime added_date_time ;

    private LocalDateTime updated_date_time;

    private LocalDateTime deleted_date_time;

    @NotNull
    private Integer added_user_id;

    private Integer update_user_id;

    private Integer delete_user_id;


//    Foreign Key
    @ManyToOne
    @JoinColumn(name = "invoice_id" , referencedColumnName = "id")
    private Invoice invoice_id;

    // Association table   In Here, "cascade = CascadeType.ALL" should be essential to save data into association table
    //"orphanRemoval = true" should be essential to remove data from the association table
    @OneToMany(mappedBy = "return_items_id" , cascade = CascadeType.ALL ,orphanRemoval = true )
    private List<ReturnItemHasItem> returnItemHasItemList;







}
