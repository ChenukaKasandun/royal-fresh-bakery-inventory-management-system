package lk.cckcakesandbakery.entity;


import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.persistence.GenerationType;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Entity
@Table(name = "customer_has_item")

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CustomerHasItem {

    @Id // PK
    @GeneratedValue(strategy = GenerationType.IDENTITY) // AI
    private Integer id;

    @NotNull
    private Integer qty;

    // Foreign Key
    @ManyToOne
    @JoinColumn(name = "customer_id" , referencedColumnName = "id")
    @JsonIgnore
    private Customer customer_id;


    // Foreign Key
    @ManyToOne
    @JoinColumn(name = "item_id", referencedColumnName = "id")
    private Item item_id;



    //Foreign Key
    @ManyToOne
    @JoinColumn(name = "production_session_id" , referencedColumnName = "id")
    private ProductionSession production_session_id;

}
