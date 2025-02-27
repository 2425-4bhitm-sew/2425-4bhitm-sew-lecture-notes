package at.htl;

import io.quarkus.logging.Log;
import io.quarkus.runtime.Startup;
import jakarta.enterprise.context.ApplicationScoped;
import org.eclipse.microprofile.rest.client.inject.RestClient;

import java.util.List;

@ApplicationScoped
public class InitBean {

    @RestClient
    MyRestService myRestService;


    @Startup
    void startup() {
        Log.info("Read form REST-resource");
        List<ToDoDto> myList = myRestService.getAll();
        System.out.println(myList);
    }


}
