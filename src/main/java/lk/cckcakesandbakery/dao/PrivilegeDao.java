package lk.cckcakesandbakery.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import lk.cckcakesandbakery.entity.Privilege;

public interface PrivilegeDao extends JpaRepository<Privilege, Integer> {

    @Query(value = "select p from Privilege p where p.role_id.id =?1 and p.module_id.id =?2")
    Privilege getPrivilegeByRoleModule(Integer roleid, Integer moduleid);


//    To check the privileges of user relevant to user roles
    @Query(value = "select bit_or(p.privi_select), bit_or( p.privi_insert), bit_or(p.privi_update), bit_or(p.privi_delete) FROM cckcakesandbakery.privilege as p where p.module_id in (select m.id from cckcakesandbakery.module as m where m.name = ?2) and p.role_id in (select uhr.role_id from cckcakesandbakery.user_has_role as uhr where uhr.user_id in (select u.id from cckcakesandbakery.user as u where u.username = ?1));", nativeQuery = true)
    String getUserPrivilegeByUserModule(String username, String modulename);
//    In here, bit_or is used to merge the privileges for multiple roles when user has more than one role
}
