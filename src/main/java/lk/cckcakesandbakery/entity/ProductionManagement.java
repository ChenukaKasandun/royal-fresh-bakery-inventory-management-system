package lk.cckcakesandbakery.entity;

import java.time.LocalDate;
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
@Table(name = "production")

@Data
@AllArgsConstructor
@NoArgsConstructor

public class ProductionManagement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;



    private String note;


    @NotNull
    private LocalDateTime added_date_time;

    private LocalDateTime update_date_time;

    private LocalDateTime delete_date_time;

    @NotNull
    private Integer added_user_id;

    private Integer update_user_id;

    private Integer delete_user_id;


//    Foreign Key
    @ManyToOne
    @JoinColumn(name = "item_production_order_id", referencedColumnName = "id") // foreign key
    private ItemProductionOrder item_production_order_id;
}
