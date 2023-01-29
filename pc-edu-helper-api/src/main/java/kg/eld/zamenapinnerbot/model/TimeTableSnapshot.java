package kg.eld.zamenapinnerbot.model;

import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

import java.util.List;
import java.util.Map;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class TimeTableSnapshot {
    String name;
    Map<String, Map<String, Map<String, List<Lesson>>>> data;
}
