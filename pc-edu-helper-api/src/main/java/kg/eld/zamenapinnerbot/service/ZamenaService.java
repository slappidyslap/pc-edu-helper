package kg.eld.zamenapinnerbot.service;

import kg.eld.zamenapinnerbot.model.TelegramChat;
import kg.eld.zamenapinnerbot.ZamenaPinnerBot;
import kg.eld.zamenapinnerbot.model.ZamenaSnapshot;
import kg.eld.zamenapinnerbot.repository.ChatRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;
import org.telegram.telegrambots.meta.api.methods.pinnedmessages.PinChatMessage;
import org.telegram.telegrambots.meta.api.methods.send.SendDocument;
import org.telegram.telegrambots.meta.api.objects.InputFile;
import org.telegram.telegrambots.meta.api.objects.Message;
import org.telegram.telegrambots.meta.exceptions.TelegramApiException;

import java.io.IOException;

@Service
@RequiredArgsConstructor
@Log4j2
public class ZamenaService {

    private final ZamenaPinnerBot bot;
    private final ChatRepository chatRepository;
    private final DocumentService documentService;

    public void processZamena(ZamenaSnapshot snapshot) {
        log.info("Рассылаем сообщения...");

        Resource resource = documentService.createZamenaDocument(snapshot);

        for (TelegramChat chat : chatRepository.findAll()) {
            try {
                SendDocument sendDocument = SendDocument
                        .builder()
                        .chatId(chat.getChatId())
                        .document(new InputFile(
                                resource.getInputStream(),
                                snapshot.getName() + ".pdf"))
                        .build();

                Message sentDocumentMessage = bot.execute(sendDocument);

                PinChatMessage pinChatMessage = PinChatMessage.builder()
                        .chatId(chat.getChatId())
                        .messageId(sentDocumentMessage.getMessageId())
                        .build();
                bot.execute(pinChatMessage);
            } catch (IOException e) {
                throw new RuntimeException(e);
            } catch (TelegramApiException e) {
                log.warn(e.getMessage());
                /*try {
                    bot.execute(SendMessage
                            .builder()
                            .chatId(chat.getId())
                            .text("Напоминаю, что я не админ")
                            .build());
                } catch (TelegramApiException ex) {
                    throw new RuntimeException(ex);
                }*/
            }
        }
    }
}
