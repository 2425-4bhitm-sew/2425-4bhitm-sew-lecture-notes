package at.htlleonding;

import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import java.util.ArrayList;
import java.util.List;

@Path("/hello")
public class GreetingResource {

    @GET
    @Produces(MediaType.TEXT_PLAIN)
    public String hello() {
        return "Hello RESTEasy";
    }

    @GET
    @Path("foo")
    @Produces(MediaType.TEXT_PLAIN)
    public Response foo() {
        return Response
                .ok("x")
                .header("name", "Mr. Anderson")
                .build();
    }

    @GET
    @Path("person")
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response bar() {
        Person andi = new Person("Andreas", "Kreuzer");
        List<Person> liste = new ArrayList<>();
        liste.add(andi);

        return Response.ok(andi).build();
    }

}
