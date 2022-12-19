package kg.eld.zamenapinnerbot;

import lombok.*;

import javax.persistence.*;

@Entity
@Getter
@Setter
@ToString
@EqualsAndHashCode(of = "chatId")
@NoArgsConstructor
public class Chat {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id", nullable = false)
	private Long id;

	@Column(name = "chat_id", nullable = false)
	private Long chatId;

	public Chat(Long chatId) {
		this.chatId = chatId;
	}
}
