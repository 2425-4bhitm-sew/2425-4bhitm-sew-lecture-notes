package at.htl;

import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import org.eclipse.microprofile.rest.client.inject.RegisterRestClient;

import java.util.List;

@RegisterRestClient
public interface MyRestService {

    @GET
    @Path("todos")
    List<ToDoDto> getAll();

}
