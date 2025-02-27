package at.htl;

public record ToDoDto(
        long id,
        long userId,
        String title,
        boolean completed
) { }
