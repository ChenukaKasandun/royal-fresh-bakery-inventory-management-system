package lk.cckcakesandbakery;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

@SpringBootApplication
@RestController // Adding mapping to servlet container for running the programme
public class CckcakesandbakeryApplication {

	public static void main(String[] args) {
		SpringApplication.run(CckcakesandbakeryApplication.class, args);

		System.out.println("Hello World");
	}



}
