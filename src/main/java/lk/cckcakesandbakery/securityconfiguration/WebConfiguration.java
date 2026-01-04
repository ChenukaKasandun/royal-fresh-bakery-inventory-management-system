package lk.cckcakesandbakery.securityconfiguration;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class WebConfiguration {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        // service authentication matching(urls)
        http.authorizeHttpRequests(auth -> {
            auth.requestMatchers("/login").permitAll()
                    .requestMatchers("/index").permitAll()
                    .requestMatchers("/createadmin").permitAll()
                    .requestMatchers("/bootstrap-5.2.3/**").permitAll()
                    .requestMatchers("/fontawesome-free-6.6.0-web/**").permitAll()
                    .requestMatchers("/css/**").permitAll()
                    .requestMatchers("/images/**").permitAll()
                    .requestMatchers("/dashboard").hasAnyAuthority("Admin", "Manager", "Cashier", "Baker", "Driver")
                    .requestMatchers("/employee/**").hasAnyAuthority("Admin", "Manager", "Cashier")
                    .requestMatchers("/privilege/**").hasAnyAuthority("Admin", "Manager", "Cashier", "Baker")
                    .requestMatchers("/user/**").hasAnyAuthority("Admin", "Manager", "Cashier")
                    .requestMatchers("/item/**").hasAnyAuthority("Admin", "Manager", "Cashier")
                    .requestMatchers("/itemprice/**").hasAnyAuthority("Admin", "Manager", "Cashier", "Baker")
                    .requestMatchers("/supplier/**").hasAnyAuthority("Admin", "Manager", "Cashier", "Baker")
                    .anyRequest().authenticated();
        })
                // Login details
                .formLogin(login -> {
                    login
                            .loginPage("/login") //
                            .defaultSuccessUrl("/dashboard", true)
                            .failureUrl("/login?error=usernamepassworderror")// Nowadays allmost systems use common
                                                                             // username and password errors
                            .usernameParameter(("username"))
                            .passwordParameter(("password"));

                })

                // logout details
                .logout(logout -> {
                    logout
                            .logoutUrl("/logout")
                            .clearAuthentication(true)
                            .logoutSuccessUrl("/login");

                })

                // If any errors ---> errorpage
                // accessDeniedPage --> forward to errorpage when incorrect user try to log into
                // denied page
                .exceptionHandling(exp -> {
                    exp.accessDeniedPage("/errorpage");
                })

                // In order to access data using js requests,we have to disable csrf.
                .csrf(csrf -> {
                    csrf.disable();
                });

        return http.build();
    }

    @Bean // this creates a class for BCryptPasswordEncoder and then we can call its
          // instances anywhere in the project
          // BCryptPasswordEncoder --> this is used as for oneway encryption method.You
          // can encrypt only .Cannot Decrypt(although it's an oneway encryption method,it has capability to compare the plaintext
    //and the ciphertext)
    public BCryptPasswordEncoder bCryptPasswordEncoder() {
        return new BCryptPasswordEncoder();
    }

}
