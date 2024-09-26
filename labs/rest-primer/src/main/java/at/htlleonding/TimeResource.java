package at.htlleonding;

import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Path("time")
public class TimeResource {

    @GET
    @Produces(MediaType.TEXT_PLAIN)
    public String time() {
        return LocalDateTime.now().toString();
    }
}
