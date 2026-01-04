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
@Table(name = "vehicle")

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Vehicle {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @NotNull
    private String name;

    private String number_plate_no;

    private String model;

    private LocalDateTime added_date_time;
    private LocalDateTime update_date_time;
    private LocalDateTime delete_date_time;

    private Integer added_user_id;
    private Integer update_user_id;
    private Integer delete_user_id;

    // Foreign key
    @ManyToOne
    @JoinColumn(name = "employee_id", referencedColumnName = "id")
    private Employee employee_id;

    // Foreign Key
    @ManyToOne
    @JoinColumn(name = "vehicle_route_id", referencedColumnName = "id")
    private VehicleRoute vehicle_route_id;

    @ManyToOne
    @JoinColumn(name = "vehicle_status_id", referencedColumnName = "id")
    private VehicleStatus vehicle_status_id;

    @ManyToOne
    @JoinColumn(name = "vehicle_type_id", referencedColumnName = "id")
    private VehicleType vehicle_type_id;

}
