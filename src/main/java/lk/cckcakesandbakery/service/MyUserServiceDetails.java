package lk.cckcakesandbakery.service;

import java.util.HashSet;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;
import lk.cckcakesandbakery.dao.UserDao;
import lk.cckcakesandbakery.entity.Role;
import lk.cckcakesandbakery.entity.User;

@Service
public class MyUserServiceDetails implements UserDetailsService {

    @Autowired
    private UserDao userDao;

    @Override
    @Transactional // In order to login to the system after giving correct username and password,
                   // this annotation is neeeded
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {

        System.out.println(username);

        User extUser = userDao.getByUsername(username);

        Set<GrantedAuthority> authority = new HashSet();
        for (Role userRole : extUser.getRoles()) {
            authority.add(new SimpleGrantedAuthority(userRole.getName()));

        }

        return new org.springframework.security.core.userdetails.User(extUser.getUsername(), extUser.getPassword(),
                extUser.getStatus(), true, true, true, authority);
    }
}
