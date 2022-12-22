package kg.eld.zamenapinnerbot.model;

import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Lesson {
    String subject;
    String to;
    String teacher;
    String audience;
    String type;

    @Override
    public String toString() {
        return subject + " " + to + " " + audience + " " + teacher;
    }
}
