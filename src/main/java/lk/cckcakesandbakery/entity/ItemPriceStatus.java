package lk.cckcakesandbakery.entity;


import jakarta.persistence.*;
import jakarta.persistence.GenerationType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Entity
@Table(name = "item_price_status") // table mapping
@Data // setter and getters, toString
@AllArgsConstructor // All Argument constructor
@NoArgsConstructor // Default constructor / empty constructor
public class ItemPriceStatus {

    @Id // PK
    @GeneratedValue(strategy = GenerationType.IDENTITY) // AI
    private Integer id;

    private String status;
}
