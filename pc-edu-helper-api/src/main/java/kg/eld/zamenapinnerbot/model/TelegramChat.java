package kg.eld.zamenapinnerbot.model;

import lombok.*;

import javax.persistence.*;

@Entity
@Getter
@Setter
@ToString
@EqualsAndHashCode(of = "chatId")
@NoArgsConstructor
public class TelegramChat {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id", nullable = false)
	private Long id;

	@Column(name = "chat_id", nullable = false)
	private Long chatId;

	public TelegramChat(Long chatId) {
		this.chatId = chatId;
	}
}
