package kg.eld.zamenapinnerbot.service;

import kg.eld.zamenapinnerbot.ZamenaPinnerBot;
import kg.eld.zamenapinnerbot.model.TelegramChat;
import kg.eld.zamenapinnerbot.repository.ChatRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.telegram.telegrambots.meta.api.methods.send.SendMessage;
import org.telegram.telegrambots.meta.api.objects.Message;
import org.telegram.telegrambots.meta.api.objects.Update;
import org.telegram.telegrambots.meta.exceptions.TelegramApiException;

import java.util.Optional;

@Service
@Log4j2
@RequiredArgsConstructor
public class MessageService {

    @Value("${telegram.bot-username}")
    private String botUsername;

    private final ChatRepository chatRepository;
    private final ZamenaPinnerBot bot;

    public void processMessage(Update update) {
        if (update.getMessage().getText().equals("/start" + botUsername)) {
            Message message = update.getMessage();
            Long chatId = message.getChatId();

            if (chatRepository.existsByChatId(chatId)) {
                SendMessage sendMessage = SendMessage
                        .builder()
                        .chatId(chatId)
                        .text("Повторно нет необходимости!")
                        .build();
                try {
                    bot.execute(sendMessage);
                } catch (TelegramApiException e) {
                    e.printStackTrace();
                }
                return;
            }

            chatRepository.save(new TelegramChat(chatId));

            SendMessage sendMessage = SendMessage
                    .builder()
                    .chatId(chatId)
                    .text("Принято!")
                    .build();
            try {
                bot.execute(sendMessage);
            } catch (TelegramApiException e) {
                e.printStackTrace();
            }
        } else if (update.getMessage().getMigrateFromChatId() != null) {
            Message message = update.getMessage();
            Optional<TelegramChat> chat = chatRepository.findById(message.getMigrateFromChatId().toString());
            chat.ifPresent(actualChat -> {
                actualChat.setId(message.getChatId());
                chatRepository.deleteById(message.getMigrateFromChatId().toString());
                chatRepository.save(actualChat);
            });
        }
    }
}
