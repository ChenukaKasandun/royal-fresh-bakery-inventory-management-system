
package lk.cckcakesandbakery.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity // this class generate as an entity
@Table(name = "employee_civil_status") // table mapping

@Data // setter and getters, toString
@AllArgsConstructor // All Argument constructor
@NoArgsConstructor // Default constructor / empty constructor
public class EmployeeCivilStatus {

    @Id
    @JoinColumn(name = "employee_civil_status_id", referencedColumnName = "id")
    private Integer id;

    @NotNull
    private String status;

}
