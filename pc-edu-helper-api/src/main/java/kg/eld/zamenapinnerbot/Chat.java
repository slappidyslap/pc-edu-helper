package kg.eld.zamenapinnerbot;

import lombok.AllArgsConstructor;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

@Document("chats")
@Data
@AllArgsConstructor
public class Chat {
	@Id
	@Field("id")
	private Long id;
}
