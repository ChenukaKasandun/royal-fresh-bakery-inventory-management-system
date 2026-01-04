package lk.cckcakesandbakery.dao;

import lk.cckcakesandbakery.entity.Item;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import lk.cckcakesandbakery.entity.Material;

import java.util.List;

public interface RawMaterialDao extends JpaRepository<Material, Integer> {

    @Query(value = "SELECT * FROM cckcakesandbakery.material as m where m.material_name =?1 ;", nativeQuery = true)
    Material getByName(String material_name);

    @Query(value = "SELECT * FROM cckcakesandbakery.material as m where m.rawmaterial_status_id <>2 ;" , nativeQuery = true)
    List<Material> list();

}
