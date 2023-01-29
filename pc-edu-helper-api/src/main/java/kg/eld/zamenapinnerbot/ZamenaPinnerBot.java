package kg.eld.zamenapinnerbot;


import kg.eld.zamenapinnerbot.service.MessageService;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Component;
import org.telegram.telegrambots.bots.TelegramLongPollingBot;
import org.telegram.telegrambots.meta.api.objects.Update;

@Log4j2
@Component
public class ZamenaPinnerBot extends TelegramLongPollingBot {

	private final MessageService messageService;

	public ZamenaPinnerBot(@Lazy MessageService messageService) {
		this.messageService = messageService;
	}

	@Override
	public void onUpdateReceived(Update update) {
		log.info("Сообщение: {}", update);
		if (update.hasMessage() && update.getMessage().hasText())
			messageService.processMessage(update);
	}

	@Value("${telegram.bot-name}")
	private String botName;
	@Value("${telegram.bot-token}")
	private String botToken;

	@Override
	public String getBotUsername() {
		return this.botName;
	}

	@Override
	public String getBotToken() {
		return this.botToken;
	}
}