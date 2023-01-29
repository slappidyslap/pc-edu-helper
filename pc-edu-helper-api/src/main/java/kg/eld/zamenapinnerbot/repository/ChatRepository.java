package kg.eld.zamenapinnerbot.repository;

import kg.eld.zamenapinnerbot.model.TelegramChat;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ChatRepository extends CrudRepository<TelegramChat, String> {

	boolean existsByChatId(Long chatId);
}
