package kg.eld.zamenapinnerbot;


import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.telegram.telegrambots.meta.api.methods.BotApiMethod;
import org.telegram.telegrambots.meta.api.methods.send.SendMessage;
import org.telegram.telegrambots.meta.api.methods.updates.SetWebhook;
import org.telegram.telegrambots.meta.api.objects.Message;
import org.telegram.telegrambots.meta.api.objects.Update;
import org.telegram.telegrambots.meta.exceptions.TelegramApiException;
import org.telegram.telegrambots.starter.SpringWebhookBot;

import java.util.Optional;

@Component
public class ZamenaPinnerBot extends SpringWebhookBot {

	@Value("${telegram.webhook-path}")
	private String webhookpath;
	@Value("${telegram.bot-name}")
	private String botName;
	@Value("${telegram.bot-token}")
	private String botToken;
	@Value("${telegram.bot-username}")
	private String botUsername;

	private final ChatRepository chatRepository;

	private static final String START_TEXT = "Принято!";

	public ZamenaPinnerBot(SetWebhook setWebhook, ChatRepository chatRepository) {
		super(setWebhook);
		this.chatRepository = chatRepository;
	}

	@Override
	public BotApiMethod<?> onWebhookUpdateReceived(Update update) {
		if (
				update.hasMessage()
				&& update.getMessage().hasText()
				&& update.getMessage().getText().equals("/start" + botUsername)
		) {
			Message message = update.getMessage();
			Long chatId = message.getChatId();

			chatRepository.save(new Chat(chatId));

			SendMessage sendMessage = SendMessage
					.builder()
					.chatId(chatId)
					.text(START_TEXT)
					.build();
			try {
				execute(sendMessage);
			} catch (TelegramApiException e) {
				e.printStackTrace();
			}
		}
		else if (
				update.hasMessage()
				&& update.getMessage().getMigrateFromChatId() != null
		) {
			Message message = update.getMessage();
			Optional<Chat> chat = chatRepository.findById(message.getMigrateFromChatId().toString());
			chat.ifPresent(actualChat -> {
				actualChat.setId(message.getChatId());
				chatRepository.deleteById(message.getMigrateFromChatId().toString());
				chatRepository.save(actualChat);
			});
		}
		return null;
	}

	@Override
	public String getBotPath() {
		return this.webhookpath;
	}

	@Override
	public String getBotUsername() {
		return this.botName;
	}

	@Override
	public String getBotToken() {
		return this.botToken;
	}
}